/**
 * Deterministic flow engine for non-AI bots.
 *
 * A bot with `ai_enabled = false` can carry a `flow` definition (a graph of
 * nodes). Each contact carries a `flow_state` marking where they are. On every
 * inbound message we run the state machine forward: consume the reply at the
 * waiting node, then walk forward emitting messages until we hit the next node
 * that needs input (or the end). No LLM involved.
 */

export type FlowNode =
  | { type: "say"; text: string; next: string }
  | { type: "menu"; text: string; var?: string; options: { label: string; next: string }[] }
  | { type: "collect"; text: string; var: string; next: string }
  | { type: "ask_media"; text: string; var: string; next: string }
  | { type: "end"; text: string }

export type Flow = { start: string; nodes: Record<string, FlowNode> }

export type FlowState = {
  node: string
  vars: Record<string, string>
  startedAt: string
  updatedAt: string
} | null

type WaitingNode = Extract<FlowNode, { type: "menu" | "collect" | "ask_media" }>

/** Nodes that pause the machine and wait for the next inbound message. */
function isWaiting(node: FlowNode): node is WaitingNode {
  return node.type === "menu" || node.type === "collect" || node.type === "ask_media"
}

/** Pull the first positive integer out of a user's reply (handles "2", "2 ...", "‎2️⃣"). */
function parseChoice(input: string): number | null {
  const ascii = input.replace(/[️⃣]/g, "") // strip emoji variation/keycap marks
  const m = ascii.match(/\d+/)
  if (!m) return null
  const n = parseInt(m[0], 10)
  return Number.isFinite(n) ? n : null
}

/**
 * Advance the flow by one inbound message.
 * Returns the assistant messages to send (in order) and the next state.
 * State becomes `null` when the conversation reaches an `end` node.
 */
export function runFlow(opts: {
  flow: Flow
  state: FlowState
  userInput: string
  mediaUrl: string | null
  now: Date
}): { messages: string[]; state: FlowState } {
  const { flow, state, userInput, mediaUrl, now } = opts
  const iso = now.toISOString()

  // Fresh / closed conversation: ignore the trigger content, render from start.
  if (!state) {
    return render(flow, flow.start, {}, iso, iso)
  }

  const current = flow.nodes[state.node]
  // State points at an unknown/non-waiting node (e.g. flow was edited): restart.
  if (!current || !isWaiting(current)) {
    return render(flow, flow.start, {}, iso, iso)
  }

  const vars = { ...state.vars }
  let target: string

  if (current.type === "menu") {
    const choice = parseChoice(userInput)
    const picked = choice && choice >= 1 && choice <= current.options.length
      ? current.options[choice - 1]
      : null
    if (!picked) {
      // Invalid selection — re-prompt with the same menu, keep state.
      return { messages: [current.text], state: { ...state, updatedAt: iso } }
    }
    if (current.var) vars[current.var] = picked.label
    target = picked.next
  } else if (current.type === "collect") {
    vars[current.var] = userInput
    target = current.next
  } else {
    // ask_media — prefer the attachment, fall back to any text the user sent.
    vars[current.var] = mediaUrl ?? userInput
    target = current.next
  }

  return render(flow, target, vars, state.startedAt, iso)
}

/** Walk forward from `nodeId`, emitting messages until a waiting node or the end. */
function render(
  flow: Flow,
  nodeId: string,
  vars: Record<string, string>,
  startedAt: string,
  updatedAt: string
): { messages: string[]; state: FlowState } {
  const messages: string[] = []
  let id: string | undefined = nodeId

  // Cap hops to guard against a misconfigured loop in the flow definition.
  for (let hops = 0; hops < 50; hops++) {
    if (!id) break
    const node: FlowNode | undefined = flow.nodes[id]
    if (!node) break

    messages.push(node.text)

    if (node.type === "end") {
      return { messages, state: null }
    }
    if (isWaiting(node)) {
      return { messages, state: { node: id, vars, startedAt, updatedAt } }
    }
    // say node — keep walking.
    id = node.next
  }

  // Fell off the end without an explicit `end` node: treat as closed.
  return { messages, state: null }
}

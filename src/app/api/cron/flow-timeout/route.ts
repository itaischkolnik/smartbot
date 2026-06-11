import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { sendMessage } from "@/lib/greenapi"
import type { FlowState } from "@/lib/flow-engine"

export const runtime = "nodejs"
export const maxDuration = 60

/**
 * Auto-close abandoned non-AI flow conversations.
 *
 * Finds contacts mid-flow whose last activity is older than the bot's
 * `flow_timeout_hours`, sends the bot's `flow_timeout_message`, and clears their
 * `flow_state`. Meant to be hit on a schedule (see vercel.json) with a
 * `Bearer ${CRON_SECRET}` Authorization header.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const db = createAdminClient()
  const now = Date.now()

  // Active, non-AI bots that have both a flow and a timeout message configured.
  const { data: bots } = await db
    .from("chatbots")
    .select(
      "id, greenapi_instance_id, greenapi_instance_token, flow_timeout_hours, flow_timeout_message"
    )
    .eq("is_active", true)
    .eq("ai_enabled", false)
    .not("flow", "is", null)
    .not("flow_timeout_message", "is", null)

  let closed = 0

  for (const bot of bots ?? []) {
    if (!bot.greenapi_instance_id || !bot.greenapi_instance_token || !bot.flow_timeout_message) {
      continue
    }
    const creds = { instanceId: bot.greenapi_instance_id, token: bot.greenapi_instance_token }
    const maxAgeMs = (bot.flow_timeout_hours || 24) * 60 * 60 * 1000

    const { data: contacts } = await db
      .from("contacts")
      .select("id, chat_id, flow_state")
      .eq("chatbot_id", bot.id)
      .not("flow_state", "is", null)

    for (const contact of contacts ?? []) {
      const state = contact.flow_state as unknown as FlowState
      if (!state?.updatedAt || !contact.chat_id) continue

      const ageMs = now - new Date(state.updatedAt).getTime()
      if (ageMs < maxAgeMs) continue

      try {
        await sendMessage(creds, contact.chat_id, bot.flow_timeout_message)
        await db.from("messages").insert({
          chatbot_id: bot.id,
          contact_id: contact.id,
          role: "assistant",
          content: bot.flow_timeout_message,
        })
      } catch (e) {
        console.error("flow-timeout send failed", e)
      }

      await db.from("contacts").update({ flow_state: null }).eq("id", contact.id)
      closed++
    }
  }

  return NextResponse.json({ ok: true, closed })
}

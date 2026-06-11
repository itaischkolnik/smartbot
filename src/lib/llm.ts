import Anthropic from "@anthropic-ai/sdk"
import OpenAI from "openai"

export type ChatTurn = { role: "user" | "assistant"; content: string }

export type GenerateArgs = {
  provider: string
  model: string
  system: string
  history: ChatTurn[]
  userMessage: string
  temperature?: number
  maxTokens?: number
  imageUrl?: string | null
}

const openai = () => new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const anthropic = () => new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function generateReply(args: GenerateArgs): Promise<string> {
  if (args.provider === "anthropic") return generateAnthropic(args)
  return generateOpenAI(args)
}

async function generateOpenAI(a: GenerateArgs): Promise<string> {
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: a.system },
    ...a.history.map((t) => ({ role: t.role, content: t.content }) as const),
  ]

  if (a.imageUrl) {
    messages.push({
      role: "user",
      content: [
        { type: "text", text: a.userMessage || "" },
        { type: "image_url", image_url: { url: a.imageUrl } },
      ],
    })
  } else {
    messages.push({ role: "user", content: a.userMessage })
  }

  const res = await openai().chat.completions.create({
    model: a.model,
    messages,
    temperature: a.temperature ?? 1,
    max_tokens: a.maxTokens ?? 600,
  })
  return res.choices[0]?.message?.content?.trim() ?? ""
}

async function generateAnthropic(a: GenerateArgs): Promise<string> {
  const messages: Anthropic.MessageParam[] = a.history.map((t) => ({
    role: t.role,
    content: t.content,
  }))

  if (a.imageUrl) {
    const { base64, mime } = await fetchAsBase64(a.imageUrl)
    messages.push({
      role: "user",
      content: [
        { type: "text", text: a.userMessage || "" },
        {
          type: "image",
          source: { type: "base64", media_type: mime as any, data: base64 },
        },
      ],
    })
  } else {
    messages.push({ role: "user", content: a.userMessage })
  }

  const res = await anthropic().messages.create({
    model: a.model,
    system: a.system,
    messages,
    temperature: a.temperature ?? 1,
    max_tokens: a.maxTokens ?? 600,
  })
  const block = res.content.find((b) => b.type === "text")
  return block && block.type === "text" ? block.text.trim() : ""
}

/** Voice transcription always uses OpenAI Whisper (Claude has no audio API). */
export async function transcribeAudio(base64: string, mime: string): Promise<string> {
  const ext = mime.includes("ogg") ? "ogg" : mime.includes("mp3") ? "mp3" : "m4a"
  const file = await OpenAI.toFile(Buffer.from(base64, "base64"), `audio.${ext}`, {
    type: mime,
  })
  const res = await openai().audio.transcriptions.create({ model: "whisper-1", file })
  return res.text?.trim() ?? ""
}

async function fetchAsBase64(url: string): Promise<{ base64: string; mime: string }> {
  const r = await fetch(url)
  const mime = r.headers.get("content-type") ?? "image/jpeg"
  const buf = Buffer.from(await r.arrayBuffer())
  return { base64: buf.toString("base64"), mime }
}

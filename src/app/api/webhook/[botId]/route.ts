import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import {
  parseInbound,
  cleanPhone,
  sendMessage,
  downloadMedia,
} from "@/lib/greenapi"
import { generateReply, transcribeAudio } from "@/lib/llm"
import { buildSystemPrompt, toHistory } from "@/lib/bot-engine"
import { runFlow, type Flow, type FlowState } from "@/lib/flow-engine"
import type { BotCapabilities, Json } from "@/lib/database.types"

export const runtime = "nodejs"
export const maxDuration = 60

// GreenAPI sends a GET to verify the URL when you set it.
export async function GET() {
  return NextResponse.json({ ok: true })
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ botId: string }> }
) {
  const { botId } = await params
  const ok = () => NextResponse.json({ ok: true })

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return ok()
  }

  const inbound = parseInbound(body)
  if (!inbound || inbound.typeWebhook !== "incomingMessageReceived") return ok()

  const db = createAdminClient()

  const { data: bot } = await db.from("chatbots").select("*").eq("id", botId).single()
  if (!bot || !bot.is_active) return ok()
  if (!bot.greenapi_instance_id || !bot.greenapi_instance_token) return ok()

  const creds = { instanceId: bot.greenapi_instance_id, token: bot.greenapi_instance_token }
  const caps = (bot.capabilities ?? {}) as BotCapabilities
  const phone = cleanPhone(inbound.chatId)

  // Upsert contact
  let { data: contact } = await db
    .from("contacts")
    .select("*")
    .eq("chatbot_id", botId)
    .eq("phone", phone)
    .maybeSingle()

  if (!contact) {
    const { data: created } = await db
      .from("contacts")
      .insert({
        chatbot_id: botId,
        phone,
        chat_id: inbound.chatId,
        name: inbound.senderName || null,
      })
      .select("*")
      .single()
    contact = created
  }
  if (!contact) return ok()

  // Resolve the user's message content (text / voice / image)
  let userText = inbound.text || inbound.caption || ""
  let messageType = "text"
  let imageUrl: string | null = null

  try {
    if (inbound.messageType === "audioMessage" && inbound.mediaUrl) {
      messageType = "voice"
      if (caps.voice) {
        const { base64, mime } = await downloadMedia(inbound.mediaUrl)
        userText = await transcribeAudio(base64, mime)
      }
    } else if (inbound.messageType === "imageMessage" && inbound.mediaUrl) {
      messageType = "image"
      if (caps.image) imageUrl = inbound.mediaUrl
    }
  } catch (e) {
    console.error("media handling failed", e)
  }

  // Log inbound message
  await db.from("messages").insert({
    chatbot_id: botId,
    contact_id: contact.id,
    role: "user",
    content: userText,
    message_type: messageType,
    media_url: inbound.mediaUrl,
  })
  await db.from("contacts").update({ last_message_at: new Date().toISOString() }).eq("id", contact.id)

  // Blocked contact (manual takeover) -> log only, don't reply
  if (contact.is_blocked) return ok()

  // Non-AI bot: run the deterministic flow if one is defined, else the canned greeting.
  if (!bot.ai_enabled) {
    const flow = bot.flow as unknown as Flow | null

    if (flow && flow.start) {
      const { messages: outgoing, state } = runFlow({
        flow,
        state: (contact.flow_state ?? null) as unknown as FlowState,
        userInput: userText,
        mediaUrl: inbound.mediaUrl,
        now: new Date(),
      })

      for (const message of outgoing) {
        await sendMessage(creds, inbound.chatId, message)
        await db.from("messages").insert({
          chatbot_id: botId,
          contact_id: contact.id,
          role: "assistant",
          content: message,
        })
      }

      await db
        .from("contacts")
        .update({ flow_state: state as unknown as Json })
        .eq("id", contact.id)
      return ok()
    }

    if (bot.greeting_message) {
      await sendMessage(creds, inbound.chatId, bot.greeting_message)
      await db.from("messages").insert({
        chatbot_id: botId,
        contact_id: contact.id,
        role: "assistant",
        content: bot.greeting_message,
      })
    }
    return ok()
  }

  // Load recent history (exclude the just-inserted message from the "history" window cleanly)
  const { data: historyRows } = await db
    .from("messages")
    .select("role, content, created_at")
    .eq("contact_id", contact.id)
    .order("created_at", { ascending: false })
    .limit(21)

  const ordered = (historyRows ?? []).reverse()
  // Drop the final row (current user message) — it's passed separately
  const history = toHistory(ordered.slice(0, -1)).slice(-20)

  // Products for catalog-enabled bots
  let products
  if (caps.products) {
    const { data } = await db.from("products").select("*").eq("chatbot_id", botId).limit(200)
    products = data ?? undefined
  }

  const system = buildSystemPrompt({ bot, products })

  let reply = ""
  try {
    reply = await generateReply({
      provider: bot.provider,
      model: bot.model,
      system,
      history,
      userMessage: userText || (imageUrl ? "(the customer sent an image)" : ""),
      temperature: Number(bot.temperature) || 1,
      maxTokens: bot.max_tokens || 600,
      imageUrl,
    })
  } catch (e) {
    console.error("LLM generation failed", e)
    return ok()
  }

  if (!reply) return ok()

  try {
    await sendMessage(creds, inbound.chatId, reply)
  } catch (e) {
    console.error("send failed", e)
  }

  await db.from("messages").insert({
    chatbot_id: botId,
    contact_id: contact.id,
    role: "assistant",
    content: reply,
  })

  return ok()
}

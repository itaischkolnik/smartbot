/**
 * Thin GreenAPI client. Each bot carries its own instance id + token,
 * so every call is scoped to that bot's WhatsApp number.
 */
const BASE = "https://api.green-api.com"

export type GreenApiCreds = { instanceId: string; token: string }

export async function sendMessage(creds: GreenApiCreds, chatId: string, message: string) {
  const res = await fetch(
    `${BASE}/waInstance${creds.instanceId}/sendMessage/${creds.token}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId, message }),
    }
  )
  if (!res.ok) {
    throw new Error(`GreenAPI sendMessage failed: ${res.status} ${await res.text()}`)
  }
  return res.json()
}

/** Download a media file (voice/image) that GreenAPI hosts. Returns base64 + mime. */
export async function downloadMedia(url: string): Promise<{ base64: string; mime: string }> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`media download failed: ${res.status}`)
  const mime = res.headers.get("content-type") ?? "application/octet-stream"
  const buf = Buffer.from(await res.arrayBuffer())
  return { base64: buf.toString("base64"), mime }
}

export function cleanPhone(chatId: string): string {
  return chatId.replace("@c.us", "").replace("@g.us", "")
}

/** Normalize the inbound GreenAPI webhook into a flat shape we can work with. */
export type InboundMessage = {
  typeWebhook: string
  chatId: string
  senderName: string
  messageType: string // textMessage | extendedTextMessage | audioMessage | imageMessage ...
  text: string
  mediaUrl: string | null
  caption: string | null
}

export function parseInbound(body: any): InboundMessage | null {
  const typeWebhook = body?.typeWebhook
  if (!typeWebhook) return null

  const md = body?.messageData ?? {}
  const messageType = md?.typeMessage ?? ""
  const text =
    md?.textMessageData?.textMessage ??
    md?.extendedTextMessageData?.text ??
    ""
  const mediaUrl = md?.fileMessageData?.downloadUrl ?? null
  const caption = md?.fileMessageData?.caption ?? null

  return {
    typeWebhook,
    chatId: body?.senderData?.chatId ?? "",
    senderName: body?.senderData?.senderName ?? body?.senderData?.chatName ?? "",
    messageType,
    text,
    mediaUrl,
    caption,
  }
}

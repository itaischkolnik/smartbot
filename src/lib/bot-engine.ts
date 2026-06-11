import type { Chatbot, Product } from "@/lib/database.types"

/** Compose the full system prompt from the bot's editable fields + live context. */
export function buildSystemPrompt(opts: {
  bot: Chatbot
  products?: Product[]
  now?: Date
}): string {
  const { bot, products } = opts
  const now = opts.now ?? new Date()

  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: bot.timezone || "Asia/Jerusalem",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "long",
  }).formatToParts(now)
  const hour = `${time.find((p) => p.type === "hour")?.value}:${time.find((p) => p.type === "minute")?.value}`
  const weekday = time.find((p) => p.type === "weekday")?.value ?? ""

  const parts: string[] = []

  if (bot.role_objective) parts.push(`# Role & Objective\n${bot.role_objective}`)
  if (bot.company_overview) parts.push(`# Company Overview\n${bot.company_overview}`)
  if (bot.system_prompt) parts.push(`# Behavior Rules\n${bot.system_prompt}`)
  if (bot.language) parts.push(`# Language\nAlways respond in ${bot.language} unless the customer clearly writes in another language.`)
  if (bot.language_prompt) parts.push(bot.language_prompt)
  if (bot.custom_prompt) parts.push(`# Additional Instructions\n${bot.custom_prompt}`)

  if (products && products.length > 0) {
    const catalog = products
      .slice(0, 200)
      .map((p) => {
        const price = p.price != null ? ` — ${p.price} ${p.currency ?? ""}` : ""
        const stock = p.in_stock === false ? " (out of stock)" : ""
        return `- ${p.name}${price}${stock}${p.description ? `: ${p.description}` : ""}${p.url ? ` [${p.url}]` : ""}`
      })
      .join("\n")
    parts.push(`# Product Catalog\nYou may help the customer buy from these products. Recommend relevant items and share links/prices.\n${catalog}`)
  }

  parts.push(`# System Context\nCurrent day: ${weekday}\nCurrent time: ${hour} (${bot.timezone || "Asia/Jerusalem"})`)

  return parts.join("\n\n")
}

/** Pull recent turns for context, oldest first. */
export function toHistory(
  rows: { role: string; content: string }[]
): { role: "user" | "assistant"; content: string }[] {
  return rows
    .filter((r) => r.role === "user" || r.role === "assistant")
    .map((r) => ({ role: r.role as "user" | "assistant", content: r.content }))
}

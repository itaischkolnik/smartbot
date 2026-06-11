export const PROVIDERS = [
  {
    id: "anthropic",
    label: "Claude (Anthropic)",
    models: [
      { id: "claude-opus-4-8", label: "Claude Opus 4.8 — highest quality" },
      { id: "claude-sonnet-4-6", label: "Claude Sonnet 4.6 — balanced" },
      { id: "claude-haiku-4-5-20251001", label: "Claude Haiku 4.5 — fast/cheap" },
    ],
  },
  {
    id: "openai",
    label: "OpenAI",
    models: [
      { id: "gpt-4o", label: "GPT-4o — chat + vision" },
      { id: "gpt-4o-mini", label: "GPT-4o mini — fast/cheap" },
    ],
  },
] as const

export type ProviderId = (typeof PROVIDERS)[number]["id"]

export const CAPABILITIES = [
  { key: "voice", label: "Voice notes", help: "Transcribe incoming WhatsApp voice messages (uses OpenAI Whisper)." },
  { key: "image", label: "Image understanding", help: "Analyze photos the customer sends and answer about them." },
  { key: "scheduling", label: "Meeting scheduling", help: "Let the bot book consultations into a calendar/CRM." },
  { key: "products", label: "Product catalog", help: "Bot can search the store catalog and sell products in chat." },
] as const

export const LANGUAGES = ["Hebrew", "English", "Arabic", "Russian", "Spanish", "French"] as const

export function modelsFor(provider: string) {
  return PROVIDERS.find((p) => p.id === provider)?.models ?? []
}

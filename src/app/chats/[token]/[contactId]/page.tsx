import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function PublicThreadPage({
  params,
}: {
  params: Promise<{ token: string; contactId: string }>
}) {
  const { token, contactId } = await params
  const supabase = await createClient()

  const { data: bots } = await supabase.rpc("get_public_bot", { p_token: token })
  const bot = bots?.[0]
  if (!bot) notFound()

  const { data: messages } = await supabase.rpc("get_public_messages", {
    p_token: token,
    p_contact: contactId,
  })

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-5 py-8">
      <Link href={`/chats/${token}`} className="text-sm text-brand hover:underline">
        ← All conversations
      </Link>
      <h1 className="mb-6 mt-2 text-xl font-bold">{bot.name}</h1>

      <div className="space-y-3">
        {(messages ?? []).map((m) => {
          const fromBot = m.role === "assistant" || m.role === "agent"
          return (
            <div
              key={m.id}
              className={`flex ${fromBot ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                  fromBot
                    ? "bg-surface-2 text-foreground"
                    : "bg-brand text-black"
                }`}
              >
                {m.message_type === "image" && m.media_url && (
                  <span className="mb-1 block text-xs opacity-70">📷 image</span>
                )}
                {m.message_type === "voice" && (
                  <span className="mb-1 block text-xs opacity-70">🎤 voice</span>
                )}
                <p className="whitespace-pre-wrap">{m.content}</p>
                <p className={`mt-1 text-[10px] ${fromBot ? "text-muted" : "text-black/60"}`}>
                  {new Date(m.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          )
        })}
        {(!messages || messages.length === 0) && (
          <p className="text-muted">No messages in this conversation.</p>
        )}
      </div>
    </div>
  )
}

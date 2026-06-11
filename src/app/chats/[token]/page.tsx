import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function PublicChatsPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const supabase = await createClient()

  const { data: bots } = await supabase.rpc("get_public_bot", { p_token: token })
  const bot = bots?.[0]
  if (!bot) notFound()

  const { data: contacts } = await supabase.rpc("get_public_contacts", { p_token: token })

  return (
    <div className="mx-auto min-h-screen max-w-3xl px-5 py-10">
      <div className="mb-6">
        <span className="text-sm text-brand">{bot.company || "SmartBot"}</span>
        <h1 className="text-2xl font-bold">{bot.name} — Conversations</h1>
      </div>

      {!contacts || contacts.length === 0 ? (
        <p className="text-muted">No conversations yet.</p>
      ) : (
        <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
          {contacts.map((c) => (
            <Link
              key={c.id}
              href={`/chats/${token}/${c.id}`}
              className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-surface-2"
            >
              <div>
                <p className="font-medium">{c.name || c.phone}</p>
                <p className="text-xs text-muted">{c.phone}</p>
              </div>
              <span className="text-xs text-muted">
                {c.last_message_at
                  ? new Date(c.last_message_at).toLocaleString()
                  : ""}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

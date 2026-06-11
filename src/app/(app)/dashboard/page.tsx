import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { LinkButton } from "@/components/ui"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: bots } = await supabase
    .from("chatbots")
    .select("id, name, company, whatsapp_number, created_at, is_active, ai_enabled, provider")
    .order("created_at", { ascending: false })

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Chatbots</h1>
        <LinkButton href="/dashboard/bots/new">+ Create New Bot</LinkButton>
      </div>

      {!bots || bots.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted">
          No bots yet. Create your first one to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {bots.map((bot) => (
            <Link
              key={bot.id}
              href={`/dashboard/bots/${bot.id}`}
              className="group relative rounded-xl border border-border bg-surface p-5 transition-colors hover:border-brand"
            >
              <span
                className={`absolute right-4 top-4 h-2.5 w-2.5 rounded-full ${
                  bot.is_active ? "bg-brand" : "bg-zinc-600"
                }`}
                title={bot.is_active ? "Active" : "Inactive"}
              />
              <h3 className="mb-3 text-lg font-bold">{bot.name}</h3>
              <p className="text-sm text-muted">
                Company: <span className="text-foreground">{bot.company || "—"}</span>
              </p>
              <p className="text-sm text-muted">
                WhatsApp: <span className="text-foreground">{bot.whatsapp_number || "—"}</span>
              </p>
              <div className="mt-2 flex gap-2">
                <span className="rounded bg-surface-2 px-2 py-0.5 text-[11px] text-muted">
                  {bot.ai_enabled ? bot.provider : "no-AI"}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-muted">
                  {new Date(bot.created_at).toLocaleDateString()}
                </span>
                <span className="text-sm font-medium text-brand group-hover:underline">
                  View Details →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

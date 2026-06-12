import { createClient } from "@/lib/supabase/server"
import { LinkButton } from "@/components/ui"
import { BotsView } from "./bots-view"

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
        <BotsView bots={bots} />
      )}
    </div>
  )
}

import { createClient } from "@/lib/supabase/server"
import { Card } from "@/components/ui"

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { count: botCount } = await supabase
    .from("chatbots")
    .select("*", { count: "exact", head: true })
  const { count: msgCount } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
  const { count: contactCount } = await supabase
    .from("contacts")
    .select("*", { count: "exact", head: true })

  const stats = [
    { label: "Bots", value: botCount ?? 0 },
    { label: "Conversations", value: contactCount ?? 0 },
    { label: "Messages", value: msgCount ?? 0 },
  ]

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Analytics</h1>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <p className="text-sm text-muted">{s.label}</p>
            <p className="mt-1 text-3xl font-bold text-brand">{s.value}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

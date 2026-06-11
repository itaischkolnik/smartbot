import { createClient } from "@/lib/supabase/server"
import { Card } from "@/components/ui"

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="max-w-2xl">
      <h1 className="mb-8 text-3xl font-bold">Settings</h1>
      <Card className="space-y-3">
        <div>
          <label>Signed in as</label>
          <input readOnly value={user?.email ?? ""} />
        </div>
        <p className="text-xs text-muted">
          Provider API keys (OpenAI / Anthropic) and the Supabase service-role key are
          configured via environment variables on the server.
        </p>
      </Card>
    </div>
  )
}

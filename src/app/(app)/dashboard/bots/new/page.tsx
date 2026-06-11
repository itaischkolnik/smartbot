import { createBot } from "../../actions"
import { Card, Button, LinkButton } from "@/components/ui"
import { LANGUAGES } from "@/lib/constants"

export default function NewBotPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-2 text-3xl font-bold">Create New Bot</h1>
      <p className="mb-8 text-sm text-muted">
        Start with the basics — you can edit prompts, capabilities and the GreenAPI
        connection right after.
      </p>

      <form action={createBot}>
        <Card className="space-y-4">
          <div>
            <label>Bot name *</label>
            <input name="name" required placeholder="CleverMind (He)" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Company</label>
              <input name="company" placeholder="CleverMind" />
            </div>
            <div>
              <label>Language</label>
              <select name="language" defaultValue="Hebrew">
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label>WhatsApp number</label>
            <input name="whatsapp_number" placeholder="972523839427" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>GreenAPI Instance ID</label>
              <input name="greenapi_instance_id" placeholder="7105545314" />
            </div>
            <div>
              <label>GreenAPI Token</label>
              <input name="greenapi_instance_token" placeholder="xxxx…" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <LinkButton href="/dashboard" variant="ghost">
              Cancel
            </LinkButton>
            <Button type="submit">Create Bot</Button>
          </div>
        </Card>
      </form>
    </div>
  )
}

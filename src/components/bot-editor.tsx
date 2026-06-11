"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Chatbot, BotCapabilities } from "@/lib/database.types"
import { updateBot, deleteBot } from "@/app/(app)/dashboard/actions"
import { Button, LinkButton } from "@/components/ui"
import { PROVIDERS, CAPABILITIES, LANGUAGES, modelsFor } from "@/lib/constants"

const TABS = ["Details", "WhatsApp", "Bot Settings", "Prompts", "Flow"] as const
type Tab = (typeof TABS)[number]

export function BotEditor({ bot, appUrl }: { bot: Chatbot; appUrl: string }) {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>("Details")
  const [provider, setProvider] = useState(bot.provider)
  const [aiEnabled, setAiEnabled] = useState(bot.ai_enabled)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const caps = (bot.capabilities ?? {}) as BotCapabilities

  const webhookUrl = `${appUrl}/api/webhook/${bot.id}`
  const shareUrl = `${appUrl}/chats/${bot.public_token}`

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    const fd = new FormData(e.currentTarget)
    await updateBot(bot.id, fd)
    setSaving(false)
    setSaved(true)
    router.refresh()
    setTimeout(() => setSaved(false), 2500)
  }

  async function onDelete() {
    if (!confirm(`Delete "${bot.name}"? This removes all its chats. This cannot be undone.`))
      return
    await deleteBot(bot.id)
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{bot.name}</h1>
          <p className="text-sm text-muted">Bot configuration</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-sm text-brand">Saved ✓</span>}
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save Changes"}
          </Button>
          <LinkButton href="/dashboard" variant="ghost">
            Back
          </LinkButton>
          <Button type="button" variant="danger" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </div>

      <div className="mb-6 flex gap-1 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm transition-colors ${
              tab === t
                ? "border-brand text-brand"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="max-w-3xl space-y-5">
        {/* DETAILS */}
        <Section show={tab === "Details"}>
          <Row>
            <Field label="Name">
              <input name="name" defaultValue={bot.name} required />
            </Field>
            <Field label="Company">
              <input name="company" defaultValue={bot.company ?? ""} />
            </Field>
          </Row>
          <Row>
            <Field label="Language">
              <select name="language" defaultValue={bot.language ?? "Hebrew"}>
                {LANGUAGES.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </Field>
            <Field label="Timezone">
              <input name="timezone" defaultValue={bot.timezone} />
            </Field>
          </Row>
          <Toggle name="is_active" label="Bot active" defaultChecked={bot.is_active} />
        </Section>

        {/* WHATSAPP / GREENAPI */}
        <Section show={tab === "WhatsApp"}>
          <Field label="WhatsApp number">
            <input name="whatsapp_number" defaultValue={bot.whatsapp_number} />
          </Field>
          <Row>
            <Field label="GreenAPI Instance ID">
              <input name="greenapi_instance_id" defaultValue={bot.greenapi_instance_id} />
            </Field>
            <Field label="GreenAPI Token">
              <input name="greenapi_instance_token" defaultValue={bot.greenapi_instance_token ?? ""} />
            </Field>
          </Row>
          <CopyBox label="Webhook URL — paste this into your GreenAPI instance settings" value={webhookUrl} />
        </Section>

        {/* BOT SETTINGS */}
        <Section show={tab === "Bot Settings"}>
          <Toggle
            name="ai_enabled"
            label="AI replies enabled (off = canned greeting / flow only)"
            defaultChecked={bot.ai_enabled}
            onChange={setAiEnabled}
          />

          {/* AI-only configuration — hidden (but still submitted) when AI is off */}
          <div className={aiEnabled ? "space-y-5" : "hidden"}>
            <Row>
              <Field label="AI Provider">
                <select
                  name="provider"
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                >
                  {PROVIDERS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Model">
                <select name="model" defaultValue={bot.model} key={provider}>
                  {modelsFor(provider).map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </Field>
            </Row>
            <Row>
              <Field label="Temperature">
                <input name="temperature" type="number" step="0.1" min="0" max="2" defaultValue={bot.temperature} />
              </Field>
              <Field label="Max tokens">
                <input name="max_tokens" type="number" min="50" max="4000" defaultValue={bot.max_tokens} />
              </Field>
            </Row>
            <div>
              <p className="mb-2 text-sm text-muted">Capabilities</p>
              <div className="space-y-2">
                {CAPABILITIES.map((c) => (
                  <Toggle
                    key={c.key}
                    name={`cap_${c.key}`}
                    label={c.label}
                    help={c.help}
                    defaultChecked={Boolean(caps[c.key as keyof BotCapabilities])}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* When AI is off, point the user to where the non-AI behavior lives */}
          {!aiEnabled && (
            <p className="text-sm text-muted">
              AI replies are off. This bot will use the{" "}
              <button
                type="button"
                onClick={() => setTab("Flow")}
                className="text-brand hover:underline"
              >
                Flow
              </button>{" "}
              if one is defined, otherwise the canned greeting from the{" "}
              <button
                type="button"
                onClick={() => setTab("Prompts")}
                className="text-brand hover:underline"
              >
                Prompts
              </button>{" "}
              tab.
            </p>
          )}
        </Section>

        {/* PROMPTS */}
        <Section show={tab === "Prompts"}>
          <Field label="Role & Objective">
            <textarea name="role_objective" rows={3} defaultValue={bot.role_objective ?? ""} />
          </Field>
          <Field label="Company Overview">
            <textarea name="company_overview" rows={3} defaultValue={bot.company_overview ?? ""} />
          </Field>
          <Field label="Behavior Rules (system prompt)">
            <textarea name="system_prompt" rows={6} defaultValue={bot.system_prompt ?? ""} />
          </Field>
          <Field label="Language Prompt">
            <textarea name="language_prompt" rows={2} defaultValue={bot.language_prompt ?? ""} />
          </Field>
          <Field label="Custom Prompt">
            <textarea name="custom_prompt" rows={6} defaultValue={bot.custom_prompt ?? ""} />
          </Field>
          <Field label="Greeting / Canned message (used by non-AI bots)">
            <textarea name="greeting_message" rows={4} defaultValue={bot.greeting_message ?? ""} />
          </Field>
        </Section>

        {/* FLOW (non-AI deterministic menu tree) */}
        <Section show={tab === "Flow"}>
          <p className="text-sm text-muted">
            Runs only when <strong>AI replies</strong> are turned off (Bot Settings). Define a
            menu/branching tree as JSON; each contact is walked through it step by step. If left
            empty, a non-AI bot falls back to the canned greeting above.
          </p>
          <Field label="Flow definition (JSON)">
            <textarea
              name="flow"
              rows={20}
              spellCheck={false}
              className="font-mono text-xs"
              defaultValue={bot.flow ? JSON.stringify(bot.flow, null, 2) : ""}
            />
          </Field>
          <Row>
            <Field label="Auto-close after (hours of silence)">
              <input
                name="flow_timeout_hours"
                type="number"
                min="1"
                max="720"
                defaultValue={bot.flow_timeout_hours ?? 24}
              />
            </Field>
          </Row>
          <Field label="Auto-close message (sent when an unfinished chat times out)">
            <textarea name="flow_timeout_message" rows={3} defaultValue={bot.flow_timeout_message ?? ""} />
          </Field>
        </Section>
      </div>

      {/* Always-on hidden share link in footer */}
      <div className="mt-8 max-w-3xl">
        <CopyBox label="Public chat history link (share with your client — no login needed)" value={shareUrl} />
      </div>
    </form>
  )
}

function Section({ show, children }: { show: boolean; children: React.ReactNode }) {
  return <div className={show ? "space-y-5" : "hidden"}>{children}</div>
}
function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label>{label}</label>
      {children}
    </div>
  )
}
function Toggle({
  name,
  label,
  help,
  defaultChecked,
  onChange,
}: {
  name: string
  label: string
  help?: string
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
}) {
  return (
    <label className="flex cursor-pointer items-start rounded-lg border border-border bg-surface-2 p-3">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        onChange={(e) => onChange?.(e.target.checked)}
        className="mt-0.5 h-4 w-auto shrink-0 accent-[var(--brand)]"
      />
      <span>
        <span className="text-sm text-foreground">{label}</span>
        {help && <span className="block text-xs text-muted">{help}</span>}
      </span>
    </label>
  )
}
function CopyBox({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label>{label}</label>
      <div className="flex gap-2">
        <input readOnly value={value} onFocus={(e) => e.currentTarget.select()} />
        <Button
          type="button"
          variant="ghost"
          onClick={() => navigator.clipboard?.writeText(value)}
        >
          Copy
        </Button>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"

type Bot = {
  id: string
  name: string
  company: string | null
  whatsapp_number: string | null
  created_at: string
  is_active: boolean
  ai_enabled: boolean
  provider: string | null
}

type ViewMode = "cards" | "list"

function StatusDot({ active, className = "" }: { active: boolean; className?: string }) {
  return (
    <span
      className={`h-2.5 w-2.5 rounded-full ${active ? "bg-brand" : "bg-zinc-600"} ${className}`}
      title={active ? "Active" : "Inactive"}
    />
  )
}

function ProviderTag({ bot }: { bot: Bot }) {
  return (
    <span className="rounded bg-surface-2 px-2 py-0.5 text-[11px] text-muted">
      {bot.ai_enabled ? bot.provider : "no-AI"}
    </span>
  )
}

function Arrow() {
  return (
    <svg
      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

export function BotsView({ bots }: { bots: Bot[] }) {
  const [view, setView] = useState<ViewMode>("cards")

  return (
    <>
      <div className="mb-5 flex justify-end">
        <div className="inline-flex rounded-lg border border-border bg-surface p-1">
          <button
            type="button"
            onClick={() => setView("cards")}
            aria-pressed={view === "cards"}
            className={`flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              view === "cards"
                ? "bg-surface-2 text-foreground"
                : "text-muted hover:bg-surface-2/60 hover:text-foreground"
            }`}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            Cards
          </button>
          <button
            type="button"
            onClick={() => setView("list")}
            aria-pressed={view === "list"}
            className={`flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              view === "list"
                ? "bg-surface-2 text-foreground"
                : "text-muted hover:bg-surface-2/60 hover:text-foreground"
            }`}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            List
          </button>
        </div>
      </div>

      {view === "cards" ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {bots.map((bot) => (
            <Link
              key={bot.id}
              href={`/dashboard/bots/${bot.id}`}
              className="group relative rounded-xl border border-border bg-surface p-5 transition-colors hover:border-brand"
            >
              <StatusDot active={bot.is_active} className="absolute right-4 top-4" />
              <h3 className="mb-3 text-lg font-bold">{bot.name}</h3>
              <p className="text-sm text-muted">
                Company: <span className="text-foreground">{bot.company || "—"}</span>
              </p>
              <p className="text-sm text-muted">
                WhatsApp: <span className="text-foreground">{bot.whatsapp_number || "—"}</span>
              </p>
              <div className="mt-2 flex gap-2">
                <ProviderTag bot={bot} />
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4">
                <span className="text-xs text-muted">
                  {new Date(bot.created_at).toLocaleDateString()}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-brand/30 bg-brand/10 px-3 py-1.5 text-sm font-semibold text-brand transition-all duration-200 group-hover:border-brand group-hover:bg-brand group-hover:text-black group-hover:shadow-[0_0_20px_-4px_var(--brand)]">
                  View Details
                  <Arrow />
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          {bots.map((bot, i) => (
            <Link
              key={bot.id}
              href={`/dashboard/bots/${bot.id}`}
              className={`group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-surface-2 ${
                i > 0 ? "border-t border-border/60" : ""
              }`}
            >
              <StatusDot active={bot.is_active} className="shrink-0" />
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-bold">{bot.name}</h3>
                <p className="truncate text-sm text-muted">{bot.company || "—"}</p>
              </div>
              <span className="hidden w-40 truncate text-sm text-muted sm:block">
                {bot.whatsapp_number || "—"}
              </span>
              <div className="hidden shrink-0 md:block">
                <ProviderTag bot={bot} />
              </div>
              <span className="hidden w-24 shrink-0 text-xs text-muted lg:block">
                {new Date(bot.created_at).toLocaleDateString()}
              </span>
              <span className="shrink-0 text-brand transition-transform duration-200 group-hover:translate-x-0.5">
                <Arrow />
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}

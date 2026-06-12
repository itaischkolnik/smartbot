"use client"

import { useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"

type Contact = {
  id: string
  name: string | null
  phone: string
  last_message_at: string | null
}

type Message = {
  id: string
  role: string
  content: string | null
  message_type: string | null
  media_url: string | null
  created_at: string
}

function initials(c: Contact) {
  const base = (c.name || c.phone || "?").trim()
  const parts = base.split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return base.slice(0, 2).toUpperCase()
}

function formatWhen(iso: string | null) {
  if (!iso) return ""
  const d = new Date(iso)
  const now = new Date()
  const sameDay = d.toDateString() === now.toDateString()
  return sameDay
    ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : d.toLocaleDateString([], { day: "2-digit", month: "short" })
}

export function ChatViewer({
  token,
  botName,
  company,
  contacts,
}: {
  token: string
  botName: string
  company: string | null
  contacts: Contact[]
}) {
  const sorted = [...contacts].sort(
    (a, b) =>
      new Date(b.last_message_at ?? 0).getTime() -
      new Date(a.last_message_at ?? 0).getTime()
  )

  const [selectedId, setSelectedId] = useState<string | null>(sorted[0]?.id ?? null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = useRef(createClient()).current
  const scrollRef = useRef<HTMLDivElement>(null)

  const selected = sorted.find((c) => c.id === selectedId) ?? null

  useEffect(() => {
    if (!selectedId) return
    let cancelled = false
    setLoading(true)
    supabase
      .rpc("get_public_messages", { p_token: token, p_contact: selectedId })
      .then(({ data }) => {
        if (cancelled) return
        setMessages((data as Message[]) ?? [])
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [selectedId, token, supabase])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages])

  return (
    <div className="flex h-screen overflow-hidden bg-black text-foreground">
      {/* Sidebar */}
      <aside
        className={`flex w-full shrink-0 flex-col border-r border-border bg-black sm:w-80 ${
          selectedId ? "hidden sm:flex" : "flex"
        }`}
      >
        <div className="flex items-center gap-2.5 border-b border-border px-5 py-4">
          <span className="inline-block h-7 w-7 shrink-0 rotate-45 rounded-md bg-brand shadow-[0_0_20px_-4px_var(--brand)]" />
          <span className="text-lg font-bold text-brand">SmartBot</span>
        </div>

        <div className="border-b border-border px-5 py-4">
          <p className="text-xs font-medium text-brand">{company || "SmartBot"}</p>
          <h1 className="text-lg font-bold">{botName}</h1>
          <p className="mt-0.5 text-xs text-muted">
            {sorted.length} conversation{sorted.length === 1 ? "" : "s"}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {sorted.length === 0 ? (
            <p className="px-5 py-6 text-sm text-muted">No conversations yet.</p>
          ) : (
            sorted.map((c) => {
              const active = c.id === selectedId
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedId(c.id)}
                  className={`flex w-full cursor-pointer items-center gap-3 border-b border-border/60 px-4 py-3 text-left transition-colors ${
                    active ? "bg-surface-2" : "hover:bg-surface"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      active ? "bg-brand text-black" : "bg-surface-2 text-brand"
                    }`}
                  >
                    {initials(c)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">
                      {c.name || c.phone}
                    </span>
                    <span className="block truncate text-xs text-muted">{c.phone}</span>
                  </span>
                  <span className="shrink-0 text-[10px] text-muted">
                    {formatWhen(c.last_message_at)}
                  </span>
                </button>
              )
            })
          )}
        </div>
      </aside>

      {/* Main conversation */}
      <main
        className={`flex-1 flex-col ${selectedId ? "flex" : "hidden sm:flex"}`}
      >
        {!selected ? (
          <div className="flex h-full items-center justify-center text-sm text-muted">
            Select a conversation to view it here.
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 border-b border-border px-5 py-3.5">
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="cursor-pointer text-muted hover:text-foreground sm:hidden"
                aria-label="Back to conversations"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M11 18l-6-6 6-6" />
                </svg>
              </button>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-2 text-xs font-bold text-brand">
                {initials(selected)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {selected.name || selected.phone}
                </p>
                <p className="truncate text-xs text-muted">{selected.phone}</p>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-6">
              <div className="mx-auto max-w-2xl">
              {loading ? (
                <p className="text-center text-sm text-muted">Loading…</p>
              ) : messages.length === 0 ? (
                <p className="text-center text-sm text-muted">
                  No messages in this conversation.
                </p>
              ) : (
                messages.map((m, i) => {
                  const fromBot = m.role === "assistant" || m.role === "agent"
                  const prev = messages[i - 1]
                  const next = messages[i + 1]
                  const prevFromBot =
                    prev && (prev.role === "assistant" || prev.role === "agent")
                  const nextFromBot =
                    next && (next.role === "assistant" || next.role === "agent")
                  const groupStart = !prev || prevFromBot !== fromBot
                  const groupEnd = !next || nextFromBot !== fromBot
                  return (
                    <div
                      key={m.id}
                      className={`flex ${fromBot ? "justify-start" : "justify-end"} ${
                        groupStart ? (i === 0 ? "" : "mt-4") : "mt-0.5"
                      }`}
                    >
                      <div
                        className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                          fromBot
                            ? `bg-surface-2 text-foreground ${groupEnd ? "rounded-bl-md" : ""}`
                            : `bg-brand text-black ${groupEnd ? "rounded-br-md" : ""}`
                        }`}
                      >
                        {m.message_type === "image" && m.media_url && (
                          <span className="mb-1 block text-xs opacity-70">📷 image</span>
                        )}
                        {m.message_type === "voice" && (
                          <span className="mb-1 block text-xs opacity-70">🎤 voice</span>
                        )}
                        <p dir="auto" className="whitespace-pre-wrap break-words text-start">
                          {m.content}
                        </p>
                        {groupEnd && (
                          <p
                            className={`mt-1 text-[10px] ${
                              fromBot ? "text-muted" : "text-black/60"
                            }`}
                          >
                            {new Date(m.created_at).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

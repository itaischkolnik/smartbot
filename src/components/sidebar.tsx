"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

const NAV = [
  { href: "/dashboard", label: "My Chatbots", icon: "💬" },
  { href: "/analytics", label: "Analytics", icon: "📊" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
]

export function Sidebar({ email }: { email: string | null }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function signOut() {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-black px-4 py-6">
      <Link href="/dashboard" className="mb-8 flex flex-col items-center gap-2">
        <span className="inline-block h-10 w-10 rotate-45 rounded-lg bg-brand shadow-[0_0_24px_-4px_var(--brand)]" />
        <span className="text-xl font-bold text-brand">SmartBot</span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-brand text-black font-semibold"
                  : "text-muted hover:bg-surface-2 hover:text-foreground"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-4 border-t border-border pt-4 text-center">
        <p className="mb-2 truncate text-xs text-muted">{email}</p>
        <button
          onClick={signOut}
          className="text-sm text-muted hover:text-foreground"
        >
          ⟵ Sign Out
        </button>
      </div>
    </aside>
  )
}

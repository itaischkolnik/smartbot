import Link from "next/link"
import { ComponentProps } from "react"

export function Logo() {
  return (
    <Link href="/dashboard" className="flex flex-col items-center gap-2 select-none">
      <span className="inline-block h-12 w-12 rotate-45 rounded-lg bg-brand shadow-[0_0_30px_-4px_var(--brand)]" />
      <span className="text-2xl font-bold text-brand">SmartBot</span>
    </Link>
  )
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<"button"> & { variant?: "primary" | "ghost" | "danger" }) {
  const styles = {
    primary: "bg-brand hover:bg-brand-hover text-black font-semibold",
    ghost: "bg-surface-2 hover:bg-[#1d1d1d] text-foreground border border-border",
    danger: "bg-transparent hover:bg-[#2a1414] text-danger border border-danger/50",
  }[variant]
  return (
    <button
      {...props}
      className={`rounded-lg px-4 py-2 text-sm transition-colors disabled:opacity-50 ${styles} ${className}`}
    />
  )
}

export function LinkButton({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<typeof Link> & { variant?: "primary" | "ghost" | "danger" }) {
  const styles = {
    primary: "bg-brand hover:bg-brand-hover text-black font-semibold",
    ghost: "bg-surface-2 hover:bg-[#1d1d1d] text-foreground border border-border",
    danger: "bg-transparent hover:bg-[#2a1414] text-danger border border-danger/50",
  }[variant]
  return (
    <Link
      {...props}
      className={`inline-block rounded-lg px-4 py-2 text-sm transition-colors ${styles} ${className}`}
    />
  )
}

export function Card({ className = "", ...props }: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={`rounded-xl border border-border bg-surface p-5 ${className}`}
    />
  )
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 text-lg font-semibold text-brand">{children}</h2>
}

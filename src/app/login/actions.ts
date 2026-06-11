"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export type LoginState = { error?: string }

export async function loginAction(
  _prev: LoginState | undefined,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") || "").trim()
  const password = String(formData.get("password") || "")

  const adminEmail = process.env.ADMIN_EMAIL?.trim()
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminEmail || !adminPassword || adminPassword === "change-this-strong-password") {
    return {
      error:
        "Admin login is not configured. Set ADMIN_EMAIL and a real ADMIN_PASSWORD in .env.local.",
    }
  }

  // .env.local is the single source of truth for who may log in.
  if (email.toLowerCase() !== adminEmail.toLowerCase() || password !== adminPassword) {
    return { error: "Invalid credentials." }
  }

  const supabase = await createClient()
  const first = await supabase.auth.signInWithPassword({
    email: adminEmail,
    password: adminPassword,
  })

  if (first.error) {
    // The Supabase Auth user doesn't exist yet — provision it with the service role.
    try {
      const admin = createAdminClient()
      const { error: createErr } = await admin.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
      })
      if (createErr && !/already|registered|exists/i.test(createErr.message)) {
        return { error: `Could not provision admin user: ${createErr.message}` }
      }
    } catch {
      return {
        error:
          "Cannot provision the admin user — check SUPABASE_SERVICE_ROLE_KEY in .env.local.",
      }
    }

    const retry = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    })
    if (retry.error) return { error: retry.error.message }
  }

  redirect("/dashboard")
}

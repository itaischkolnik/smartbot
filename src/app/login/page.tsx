"use client"

import { useActionState } from "react"
import { loginAction, type LoginState } from "./actions"
import { Logo, Button, Card } from "@/components/ui"

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<LoginState | undefined, FormData>(
    loginAction,
    undefined
  )

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <Card>
          <h1 className="mb-1 text-xl font-semibold">Sign in</h1>
          <p className="mb-5 text-sm text-muted">Manage your clients&apos; chatbots.</p>
          <form action={formAction} className="space-y-4">
            <div>
              <label>Email</label>
              <input type="email" name="email" required placeholder="you@example.com" />
            </div>
            <div>
              <label>Password</label>
              <input type="password" name="password" required placeholder="••••••••" />
            </div>
            {state?.error && <p className="text-sm text-danger">{state.error}</p>}
            <Button type="submit" disabled={pending} className="w-full">
              {pending ? "..." : "Sign in"}
            </Button>
          </form>
          <p className="mt-4 text-center text-xs text-muted">
            Credentials are set in <code>.env.local</code>.
          </p>
        </Card>
      </div>
    </div>
  )
}

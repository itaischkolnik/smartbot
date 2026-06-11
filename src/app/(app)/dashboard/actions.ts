"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type { BotCapabilities, Json } from "@/lib/database.types"

export async function createBot(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data, error } = await supabase
    .from("chatbots")
    .insert({
      user_id: user.id,
      name: String(formData.get("name") || "Untitled Bot"),
      company: (formData.get("company") as string) || null,
      whatsapp_number: String(formData.get("whatsapp_number") || ""),
      greenapi_instance_id: String(formData.get("greenapi_instance_id") || ""),
      greenapi_instance_token: (formData.get("greenapi_instance_token") as string) || null,
      language: (formData.get("language") as string) || "Hebrew",
    })
    .select("id")
    .single()

  if (error) throw new Error(error.message)
  revalidatePath("/dashboard")
  redirect(`/dashboard/bots/${data.id}`)
}

export async function updateBot(id: string, formData: FormData) {
  const supabase = await createClient()

  const capabilities: BotCapabilities = {
    voice: formData.get("cap_voice") === "on",
    image: formData.get("cap_image") === "on",
    scheduling: formData.get("cap_scheduling") === "on",
    products: formData.get("cap_products") === "on",
  }

  const num = (k: string, d: number) => {
    const v = Number(formData.get(k))
    return Number.isFinite(v) ? v : d
  }

  // Flow definition: validate the JSON so a bad paste fails the save visibly.
  let flow: unknown = null
  const flowRaw = (formData.get("flow") as string | null)?.trim()
  if (flowRaw) {
    try {
      flow = JSON.parse(flowRaw)
    } catch (e) {
      throw new Error(`Invalid flow JSON: ${e instanceof Error ? e.message : String(e)}`)
    }
  }

  const { error } = await supabase
    .from("chatbots")
    .update({
      name: String(formData.get("name") || ""),
      company: (formData.get("company") as string) || null,
      language: (formData.get("language") as string) || null,
      whatsapp_number: String(formData.get("whatsapp_number") || ""),
      greenapi_instance_id: String(formData.get("greenapi_instance_id") || ""),
      greenapi_instance_token: (formData.get("greenapi_instance_token") as string) || null,
      ai_enabled: formData.get("ai_enabled") === "on",
      is_active: formData.get("is_active") === "on",
      provider: String(formData.get("provider") || "openai"),
      model: String(formData.get("model") || "gpt-4o"),
      temperature: num("temperature", 1),
      max_tokens: num("max_tokens", 600),
      timezone: String(formData.get("timezone") || "Asia/Jerusalem"),
      capabilities,
      role_objective: (formData.get("role_objective") as string) || null,
      company_overview: (formData.get("company_overview") as string) || null,
      system_prompt: (formData.get("system_prompt") as string) || null,
      language_prompt: (formData.get("language_prompt") as string) || null,
      custom_prompt: (formData.get("custom_prompt") as string) || null,
      greeting_message: (formData.get("greeting_message") as string) || null,
      flow: flow as Json,
      flow_timeout_hours: num("flow_timeout_hours", 24),
      flow_timeout_message: (formData.get("flow_timeout_message") as string) || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) throw new Error(error.message)
  revalidatePath(`/dashboard/bots/${id}`)
  revalidatePath("/dashboard")
}

export async function deleteBot(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("chatbots").delete().eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/dashboard")
  redirect("/dashboard")
}

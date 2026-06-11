import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BotEditor } from "@/components/bot-editor"

export default async function BotPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: bot } = await supabase.from("chatbots").select("*").eq("id", id).single()
  if (!bot) notFound()

  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://www.getsmartbot.io").replace(
    /\/+$/,
    ""
  )
  return <BotEditor bot={bot} appUrl={appUrl} />
}

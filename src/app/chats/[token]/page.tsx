import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ChatViewer } from "./chat-viewer"

export default async function PublicChatsPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const supabase = await createClient()

  const { data: bots } = await supabase.rpc("get_public_bot", { p_token: token })
  const bot = bots?.[0]
  if (!bot) notFound()

  const { data: contacts } = await supabase.rpc("get_public_contacts", { p_token: token })

  return (
    <ChatViewer
      token={token}
      botName={bot.name}
      company={bot.company}
      contacts={contacts ?? []}
    />
  )
}

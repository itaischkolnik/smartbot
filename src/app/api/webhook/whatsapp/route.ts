import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Configure Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Received webhook:', JSON.stringify(body, null, 2));

    // GreenAPI sends webhooks with messageData
    if (!body.messageData) {
      return NextResponse.json({ error: 'Invalid webhook data' }, { status: 400 });
    }

    // Extract relevant information from the webhook
    const {
      messageData,
      senderData,
      instanceData
    } = body;

    // Only process text messages for now
    if (messageData.typeMessage !== 'textMessage') {
      return NextResponse.json({ status: 'ignored', reason: 'not a text message' });
    }

    // Get the phone number that received the message (your bot's number)
    const receiverPhone = instanceData.wid;
    
    // Find the bot associated with this phone number
    const { data: bot, error: botError } = await supabase
      .from('chatbots')
      .select('*')
      .eq('whatsapp_number', receiverPhone)
      .single();

    if (botError || !bot) {
      console.error('Bot not found for number:', receiverPhone);
      return NextResponse.json(
        { error: 'Bot not found for this number' },
        { status: 404 }
      );
    }

    // Get the sender's phone number (the user messaging the bot)
    const senderPhone = senderData.sender;
    const messageText = messageData.textMessageData.textMessage;

    // Prepare to send response using GreenAPI
    const response = await fetch(
      `https://api.green-api.com/waInstance${bot.greenapi_instance_id}/sendMessage/${bot.greenapi_instance_token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId: `${senderPhone}@c.us`,
          message: await generateResponse(messageText, bot.prompt)
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to send WhatsApp response');
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function generateResponse(message: string, prompt: string): Promise<string> {
  // For now, return a simple response
  // TODO: Integrate with your AI service to generate responses based on the prompt
  return `Thank you for your message: "${message}". I am processing it according to my prompt.`;
} 
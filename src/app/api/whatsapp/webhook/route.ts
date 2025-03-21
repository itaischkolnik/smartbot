import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { greenAPI } from '@/lib/greenapi';

export async function POST(
  req: Request,
  { params }: { params: Record<string, string> }
): Promise<Response> {
  try {
    const body = await req.json();

    // Verify this is a message notification
    if (
      body.typeWebhook !== 'incomingMessageReceived' ||
      !body.messageData?.textMessageData?.textMessage
    ) {
      return NextResponse.json({ success: true });
    }

    const senderNumber = body.senderData.sender.split('@')[0];
    const message = body.messageData.textMessageData.textMessage;

    // Find the corresponding chatbot for this WhatsApp number
    const { data: chatbot, error: chatbotError } = await supabase
      .from('chatbots')
      .select('*')
      .eq('whatsapp_number', senderNumber)
      .single();

    if (chatbotError || !chatbot) {
      console.error('No chatbot found for number:', senderNumber);
      return NextResponse.json({ success: true });
    }

    // Get chatbot response from OpenAI
    const chatResponse = await fetch(`${req.url.split('/whatsapp')[0]}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatbot_id: chatbot.id,
        message,
      }),
    });

    if (!chatResponse.ok) {
      throw new Error('Failed to get chatbot response');
    }

    const { response } = await chatResponse.json();

    // Send response back via WhatsApp
    await greenAPI.sendMessage(senderNumber, response);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle webhook verification
export async function GET(request: Request) {
  return NextResponse.json({ success: true });
} 
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { supabase } from '@/lib/supabase';
import { generateChatResponse, type ChatMessage } from '@/lib/openai';

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get request body
    const body = await request.json();
    const { chatbot_id, message } = body;

    if (!chatbot_id || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get chatbot details
    const { data: chatbot, error: chatbotError } = await supabase
      .from('chatbots')
      .select('*')
      .eq('id', chatbot_id)
      .single();

    if (chatbotError || !chatbot) {
      return NextResponse.json({ error: 'Chatbot not found' }, { status: 404 });
    }

    // Get recent conversation history (last 10 messages)
    const { data: history } = await supabase
      .from('conversations')
      .select('*')
      .eq('chatbot_id', chatbot_id)
      .order('timestamp', { ascending: false })
      .limit(10);

    // Prepare messages for OpenAI
    const messages: ChatMessage[] = [
      { role: 'system', content: chatbot.prompt },
      ...(history || []).reverse().map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.message,
      })) as ChatMessage[],
      { role: 'user', content: message },
    ];

    // Generate response from OpenAI
    const response = await generateChatResponse(messages);

    // Store user message in conversation history
    await supabase.from('conversations').insert([
      {
        chatbot_id,
        message,
        sender: 'user',
      },
    ]);

    // Store bot response in conversation history
    await supabase.from('conversations').insert([
      {
        chatbot_id,
        message: response,
        sender: 'bot',
      },
    ]);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
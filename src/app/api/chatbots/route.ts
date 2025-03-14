import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user's chatbots
    const { data: chatbots, error: chatbotsError } = await supabase
      .from('chatbots')
      .select(`
        id,
        name,
        prompt,
        whatsapp_number,
        greenapi_instance_id,
        created_at,
        conversations (
          id,
          message,
          sender,
          timestamp
        )
      `)
      .eq('user_id', userData.id)
      .order('created_at', { ascending: false });

    if (chatbotsError) {
      return NextResponse.json(
        { error: 'Failed to fetch chatbots' },
        { status: 500 }
      );
    }

    return NextResponse.json(chatbots);
  } catch (error) {
    console.error('Error fetching chatbots:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
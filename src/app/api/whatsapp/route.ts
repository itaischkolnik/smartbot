import { NextResponse } from 'next/server';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Explicitly set runtime to edge
export const runtime = 'edge';
// Set dynamic to force-dynamic to prevent caching
export const dynamic = 'force-dynamic';

const GREENAPI_BASE_URL = 'https://api.green-api.com';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { botId, userId, action } = body;
    
    if (!botId || !userId || !action) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const supabase = createClientComponentClient();

    // Get bot's GreenAPI credentials
    const { data: bot, error: botError } = await supabase
      .from('chatbots')
      .select('greenapi_instance_id, greenapi_instance_token')
      .eq('id', botId)
      .single();

    if (botError || !bot) {
      return NextResponse.json(
        { error: 'Failed to get bot credentials' },
        { status: 500 }
      );
    }

    const { greenapi_instance_id, greenapi_instance_token } = bot;

    if (!greenapi_instance_id || !greenapi_instance_token) {
      return NextResponse.json(
        { error: 'Missing GreenAPI credentials' },
        { status: 400 }
      );
    }

    if (action === 'getState') {
      try {
        const response = await fetch(
          `${GREENAPI_BASE_URL}/waInstance${greenapi_instance_id}/getStateInstance/${greenapi_instance_token}`,
          { method: 'GET' }
        );

        if (!response.ok) {
          throw new Error(`GreenAPI returned status ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json({ status: data.stateInstance });
      } catch (error: any) {
        return NextResponse.json(
          { error: 'Failed to get state', details: error.message },
          { status: 500 }
        );
      }
    }

    if (action === 'qrCode') {
      try {
        const response = await fetch(
          `${GREENAPI_BASE_URL}/waInstance${greenapi_instance_id}/qr/${greenapi_instance_token}`,
          { method: 'GET' }
        );

        if (!response.ok) {
          throw new Error(`GreenAPI returned status ${response.status}`);
        }

        const data = await response.json();
        
        if (data.type === 'alreadyLogged') {
          return NextResponse.json({ status: 'connected' });
        }

        return NextResponse.json({
          status: 'awaiting_scan',
          qrCode: data.message
        });
      } catch (error: any) {
        return NextResponse.json(
          { error: 'Failed to get QR code', details: error.message },
          { status: 500 }
        );
      }
    }

    if (action === 'logout') {
      try {
        const response = await fetch(
          `${GREENAPI_BASE_URL}/waInstance${greenapi_instance_id}/logout/${greenapi_instance_token}`,
          { method: 'GET' }
        );

        if (!response.ok) {
          throw new Error(`GreenAPI returned status ${response.status}`);
        }

        return NextResponse.json({ status: 'disconnected' });
      } catch (error: any) {
        return NextResponse.json(
          { error: 'Failed to logout', details: error.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
} 
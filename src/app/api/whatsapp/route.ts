import { NextResponse } from 'next/server';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Explicitly set runtime to edge
export const runtime = 'edge';
// Set dynamic to force-dynamic to prevent caching
export const dynamic = 'force-dynamic';

const GREENAPI_BASE_URL = 'https://api.green-api.com';

interface WhatsAppResponse {
  status: string;
  qrCode?: string;
  error?: string;
  details?: string;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json() as {
      botId: string;
      userId: string;
      action: 'getState' | 'qrCode' | 'logout';
    };
    const { botId, userId, action } = body;
    
    if (!botId || !userId || !action) {
      return NextResponse.json<ErrorResponse>(
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
        return NextResponse.json<WhatsAppResponse>({ status: data.stateInstance });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to get state';
        return NextResponse.json<ErrorResponse>(
          { error: 'Failed to get state', details: errorMessage },
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
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json<ErrorResponse>(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
} 
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/lib/database.types';
import Link from 'next/link';
import Image from 'next/image';

export default function ConnectWhatsAppPage() {
  const params = useParams();
  const botId = params.id as string;
  const { data: session } = useSession();
  const [status, setStatus] = useState<string>('initializing');
  const [error, setError] = useState<string | null>(null);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [instanceId, setInstanceId] = useState('')
  const [token, setToken] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    async function checkWhatsAppState() {
      if (!session?.user?.email || !botId) {
        setError('Missing required session data or bot ID');
        setStatus('error');
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        // Get user's Supabase ID
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('email', session.user.email)
          .single();

        if (userError || !userData) {
          throw new Error('Failed to get user data: ' + userError?.message);
        }

        setUser(userData);

        // Check WhatsApp state
        const stateResponse = await fetch('/api/whatsapp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            botId,
            userId: userData.id,
            action: 'getState',
          }),
        });

        const stateData = await stateResponse.json();
        
        if (!stateResponse.ok) {
          throw new Error(stateData.details || stateData.error || 'Failed to get WhatsApp state');
        }

        if (stateData.status === 'authorized') {
          setStatus('connected');
          return;
        }

        // If not authorized, get QR code
        const qrResponse = await fetch('/api/whatsapp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            botId,
            userId: userData.id,
            action: 'qrCode',
          }),
        });

        const qrData = await qrResponse.json();

        if (!qrResponse.ok) {
          throw new Error(qrData.details || qrData.error || 'Failed to get QR code');
        }

        if (qrData.status === 'connected') {
          setStatus('connected');
        } else {
          setStatus('awaiting_scan');
          setQrCode(qrData.qrCode);

          // Start polling for state changes
          intervalId = setInterval(async () => {
            try {
              const pollResponse = await fetch('/api/whatsapp', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  botId,
                  userId: userData.id,
                  action: 'getState',
                }),
              });

              const pollData = await pollResponse.json();

              if (pollData.status === 'authorized') {
                setStatus('connected');
                clearInterval(intervalId);
              }
            } catch (err) {
              console.error('Failed to poll state:', err);
              setError('Failed to get status updates');
              clearInterval(intervalId);
            }
          }, 2000);
        }
      } catch (error) {
        console.error('Failed to initialize WhatsApp:', error);
        setError(error instanceof Error ? error.message : 'Failed to initialize WhatsApp');
        setStatus('error');
      } finally {
        setIsLoading(false);
      }
    }

    checkWhatsAppState();

    // Cleanup
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [session, botId, supabase]);

  // ... rest of the component
} 
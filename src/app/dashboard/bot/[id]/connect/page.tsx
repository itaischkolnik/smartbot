'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/database.types';
import Link from 'next/link';

export default function ConnectWhatsAppPage() {
  const router = useRouter();
  const params = useParams();
  const botId = params.id as string;
  const { data: session } = useSession();
  const [status, setStatus] = useState<string>('initializing');
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient<Database>();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<{ id: string } | null>(null);

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

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          botId,
          userId: user?.id,
          action: 'logout',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to logout');
      }

      setStatus('disconnected');
      setQrCode(null);
    } catch (error) {
      console.error('Failed to logout:', error);
      setError(error instanceof Error ? error.message : 'Failed to logout');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">Connect WhatsApp</h1>
          <Link
            href={`/dashboard/bot/${botId}`}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Back to Bot Details
          </Link>
        </div>

        <div className="bg-[#1E1E1E] rounded-lg p-8">
          <div className="text-center">
            {isLoading && (
              <div className="text-gray-400">
                <div className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full mr-2" />
                {status === 'initializing' ? 'Initializing WhatsApp connection...' : 'Loading...'}
              </div>
            )}

            {!isLoading && status === 'awaiting_scan' && qrCode && (
              <div className="space-y-4">
                <h2 className="text-xl text-white mb-4">Scan the QR Code</h2>
                <p className="text-gray-400 mb-6">
                  Open WhatsApp on your phone and scan this QR code to connect your bot
                </p>
                <div className="inline-block p-4 bg-white rounded-lg">
                  <img src={qrCode} alt="WhatsApp QR Code" className="max-w-[300px]" />
                </div>
              </div>
            )}

            {!isLoading && status === 'connected' && (
              <div>
                <div className="text-green-500 mb-6">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  WhatsApp connected successfully!
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                  disabled={isLoading}
                >
                  Disconnect WhatsApp
                </button>
              </div>
            )}

            {!isLoading && status === 'disconnected' && (
              <div className="text-yellow-500">
                <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                WhatsApp disconnected. Please refresh the page to reconnect.
                <button 
                  onClick={() => window.location.reload()} 
                  className="block mx-auto mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Reconnect
                </button>
              </div>
            )}

            {!isLoading && status === 'error' && (
              <div className="text-red-500">
                <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error || 'An error occurred while connecting to WhatsApp'}
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
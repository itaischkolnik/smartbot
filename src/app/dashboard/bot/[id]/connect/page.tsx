'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/database.types';
import Link from 'next/link';
import Image from 'next/image';

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

  const handleConnect = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Test the GreenAPI connection
      const response = await fetch('/api/whatsapp/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instanceId,
          token
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to connect to WhatsApp. Please check your credentials.')
      }

      // Save the credentials
      const { error: updateError } = await supabase
        .from('chatbots')
        .update({
          greenapi_instance_id: instanceId,
          greenapi_token: token,
          whatsapp_status: 'connected'
        })
        .eq('id', params.id)

      if (updateError) {
        throw updateError
      }

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

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
                  <Image 
                    src={qrCode} 
                    alt="WhatsApp QR Code" 
                    width={300} 
                    height={300}
                    className="max-w-[300px]" 
                  />
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

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                Successfully connected to WhatsApp!
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Connect using Green API</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="instanceId" className="block text-sm font-medium text-gray-700">
                Instance ID
              </label>
              <input
                type="text"
                id="instanceId"
                value={instanceId}
                onChange={(e) => setInstanceId(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter your Green API Instance ID"
              />
            </div>

            <div>
              <label htmlFor="token" className="block text-sm font-medium text-gray-700">
                API Token
              </label>
              <input
                type="password"
                id="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter your Green API Token"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <button
              onClick={handleConnect}
              disabled={isLoading || !instanceId || !token}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isLoading || !instanceId || !token
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
            >
              {isLoading ? 'Connecting...' : 'Connect WhatsApp'}
            </button>

            <div className="mt-4 text-sm text-gray-600">
              <h3 className="font-medium mb-2">How to get your Green API credentials:</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>Go to <a href="https://green-api.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-500">green-api.com</a></li>
                <li>Sign up or log in to your account</li>
                <li>Create a new instance or select an existing one</li>
                <li>Copy your Instance ID and API Token</li>
                <li>Paste them in the fields above and click Connect</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
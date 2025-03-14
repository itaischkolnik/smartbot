'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/database.types';

interface WhatsAppSettingsProps {
  botId: string;
  whatsappStatus: string | null;
  greenApiInstanceId: string | null;
}

export default function WhatsAppSettings({ botId, whatsappStatus, greenApiInstanceId }: WhatsAppSettingsProps) {
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const supabase = createClientComponentClient<Database>();

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      const { error } = await supabase
        .from('chatbots')
        .update({
          whatsapp_status: 'disconnected',
          greenapi_instance_id: null,
          greenapi_token: null
        })
        .eq('id', botId);

      if (error) throw error;
      
      // Reload the page to reflect changes
      window.location.reload();
    } catch (error) {
      console.error('Error disconnecting WhatsApp:', error);
    } finally {
      setIsDisconnecting(false);
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">WhatsApp Connection</h3>
        
        <div className="mt-3 max-w-xl text-sm text-gray-500">
          <p>
            {whatsappStatus === 'connected'
              ? `Connected to WhatsApp using Green API (Instance ID: ${greenApiInstanceId})`
              : 'Connect your bot to WhatsApp to start receiving and responding to messages.'}
          </p>
        </div>

        <div className="mt-5">
          {whatsappStatus === 'connected' ? (
            <button
              type="button"
              onClick={handleDisconnect}
              disabled={isDisconnecting}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:text-sm"
            >
              {isDisconnecting ? 'Disconnecting...' : 'Disconnect WhatsApp'}
            </button>
          ) : (
            <Link
              href={`/dashboard/bot/${botId}/connect`}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
            >
              Connect WhatsApp
            </Link>
          )}
        </div>

        {whatsappStatus !== 'connected' && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900">To connect your bot to WhatsApp:</h4>
            <ul className="mt-3 list-disc list-inside text-sm text-gray-500 space-y-2">
              <li>Click the "Connect WhatsApp" button above</li>
              <li>Sign up for a Green API account if you haven't already</li>
              <li>Create a new instance and get your credentials</li>
              <li>Enter your Green API Instance ID and Token</li>
              <li>Start using your WhatsApp-enabled bot!</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
} 
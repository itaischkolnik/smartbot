'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/database.types';

type AlertProps = {
  message: string;
  onClose: () => void;
};

function Alert({ message, onClose }: AlertProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-[#1E1E1E] rounded-lg p-6 max-w-md w-full mx-4 shadow-xl border border-gray-700">
        <div className="text-white mb-6">{message}</div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#25D366] hover:bg-[#1fa855] text-white px-6 py-2 rounded-lg transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

type WhatsAppSettingsProps = {
  botId: string;
  userId: string;
  greenApiInstanceId: string | null;
  greenApiInstanceToken: string | null;
  onUpdate: () => void;
};

export default function WhatsAppSettings({
  botId,
  userId,
  greenApiInstanceId,
  greenApiInstanceToken,
  onUpdate,
}: WhatsAppSettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alert, setAlert] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    greenapi_instance_id: greenApiInstanceId || '',
    greenapi_instance_token: greenApiInstanceToken || '',
  });
  const supabase = createClientComponentClient<Database>();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // First, try to update only if both values are provided
      if (formData.greenapi_instance_id && formData.greenapi_instance_token) {
        const { error: updateError } = await supabase
          .from('chatbots')
          .update({
            greenapi_instance_id: formData.greenapi_instance_id,
            greenapi_instance_token: formData.greenapi_instance_token,
          })
          .eq('id', botId);

        if (updateError) {
          // If update fails, try to update one field at a time
          const { error: idError } = await supabase
            .from('chatbots')
            .update({ greenapi_instance_id: formData.greenapi_instance_id })
            .eq('id', botId);

          if (idError) throw idError;

          const { error: tokenError } = await supabase
            .from('chatbots')
            .update({ greenapi_instance_token: formData.greenapi_instance_token })
            .eq('id', botId);

          if (tokenError) throw tokenError;
        }
      }

      onUpdate();
    } catch (err) {
      console.error('Error updating WhatsApp settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to update WhatsApp settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          botId,
          userId,
          action: 'getState',
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || data.details || 'Failed to test connection');
      }

      const data = await response.json();
      setAlert('Connection successful! Current state: ' + data.status);
    } catch (err) {
      console.error('Error testing connection:', err);
      setError(err instanceof Error ? err.message : 'Failed to test connection');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {alert && <Alert message={alert} onClose={() => setAlert(null)} />}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="greenapi_instance_id" className="block text-gray-400 mb-2">
            GreenAPI Instance ID
          </label>
          <input
            type="text"
            id="greenapi_instance_id"
            name="greenapi_instance_id"
            value={formData.greenapi_instance_id}
            onChange={handleInputChange}
            className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25D366]"
            placeholder="Enter your GreenAPI Instance ID"
          />
        </div>

        <div>
          <label htmlFor="greenapi_instance_token" className="block text-gray-400 mb-2">
            GreenAPI Token
          </label>
          <input
            type="password"
            id="greenapi_instance_token"
            name="greenapi_instance_token"
            value={formData.greenapi_instance_token}
            onChange={handleInputChange}
            className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25D366]"
            placeholder="Enter your GreenAPI Token"
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#25D366] hover:bg-[#1fa855] text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Settings'}
          </button>

          <button
            type="button"
            onClick={handleTestConnection}
            disabled={isLoading || !formData.greenapi_instance_id || !formData.greenapi_instance_token}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test Connection'}
          </button>
        </div>
      </form>

      <div className="mt-6 border-t border-gray-700 pt-6">
        <h3 className="text-lg font-medium text-white mb-4">Connection Instructions</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-400">
          <li>Enter your GreenAPI Instance ID and Token from your GreenAPI dashboard</li>
          <li>Click "Save Settings" to store your credentials</li>
          <li>Click "Test Connection" to verify your credentials work</li>
          <li>Use the "Connect WhatsApp" button at the top to scan the QR code and start using your bot</li>
        </ol>
      </div>
    </div>
  );
} 
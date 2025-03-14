'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/database.types';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import WhatsAppSettings from './components/WhatsAppSettings';

type Chatbot = Database['public']['Tables']['chatbots']['Row'] & {
  greenapi_instance_token?: string | null;
};

const LANGUAGE_OPTIONS = [
  { value: 'af', label: 'Afrikaans' },
  { value: 'ar', label: 'Arabic' },
  { value: 'bg', label: 'Bulgarian' },
  { value: 'bn', label: 'Bengali' },
  { value: 'ca', label: 'Catalan' },
  { value: 'cs', label: 'Czech' },
  { value: 'da', label: 'Danish' },
  { value: 'de', label: 'German' },
  { value: 'el', label: 'Greek' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'et', label: 'Estonian' },
  { value: 'fa', label: 'Persian' },
  { value: 'fi', label: 'Finnish' },
  { value: 'fr', label: 'French' },
  { value: 'he', label: 'Hebrew' },
  { value: 'hi', label: 'Hindi' },
  { value: 'hr', label: 'Croatian' },
  { value: 'hu', label: 'Hungarian' },
  { value: 'id', label: 'Indonesian' },
  { value: 'it', label: 'Italian' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'lt', label: 'Lithuanian' },
  { value: 'lv', label: 'Latvian' },
  { value: 'ms', label: 'Malay' },
  { value: 'nl', label: 'Dutch' },
  { value: 'no', label: 'Norwegian' },
  { value: 'pl', label: 'Polish' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ro', label: 'Romanian' },
  { value: 'ru', label: 'Russian' },
  { value: 'sk', label: 'Slovak' },
  { value: 'sl', label: 'Slovenian' },
  { value: 'sq', label: 'Albanian' },
  { value: 'sr', label: 'Serbian' },
  { value: 'sv', label: 'Swedish' },
  { value: 'th', label: 'Thai' },
  { value: 'tr', label: 'Turkish' },
  { value: 'uk', label: 'Ukrainian' },
  { value: 'ur', label: 'Urdu' },
  { value: 'vi', label: 'Vietnamese' },
  { value: 'zh', label: 'Chinese' },
];

const LANGUAGE_NAMES: { [key: string]: string } = {
  af: 'Afrikaans',
  ar: 'Arabic',
  bg: 'Bulgarian',
  bn: 'Bengali',
  ca: 'Catalan',
  cs: 'Czech',
  da: 'Danish',
  de: 'German',
  el: 'Greek',
  en: 'English',
  es: 'Spanish',
  et: 'Estonian',
  fa: 'Persian',
  fi: 'Finnish',
  fr: 'French',
  he: 'Hebrew',
  hi: 'Hindi',
  hr: 'Croatian',
  hu: 'Hungarian',
  id: 'Indonesian',
  it: 'Italian',
  ja: 'Japanese',
  ko: 'Korean',
  lt: 'Lithuanian',
  lv: 'Latvian',
  ms: 'Malay',
  nl: 'Dutch',
  no: 'Norwegian',
  pl: 'Polish',
  pt: 'Portuguese',
  ro: 'Romanian',
  ru: 'Russian',
  sk: 'Slovak',
  sl: 'Slovenian',
  sq: 'Albanian',
  sr: 'Serbian',
  sv: 'Swedish',
  th: 'Thai',
  tr: 'Turkish',
  uk: 'Ukrainian',
  ur: 'Urdu',
  vi: 'Vietnamese',
  zh: 'Chinese'
};

export default function BotDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const botId = params.id as string;
  const { data: session } = useSession();
  const [bot, setBot] = useState<Chatbot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'whatsapp'>('details');
  const [formData, setFormData] = useState<Partial<Chatbot>>({});
  const supabase = createClientComponentClient<Database>();

  async function fetchBot() {
    if (!session?.user?.email || !botId) return;

    try {
      setIsLoading(true);
      setError(null);

      // First get the user's ID
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .single();

      if (userError) throw new Error('Failed to fetch user data');
      if (!userData) throw new Error('User not found');

      // Then fetch the bot details
      const { data: botData, error: botError } = await supabase
        .from('chatbots')
        .select('*')
        .eq('id', botId)
        .eq('user_id', userData.id)
        .single();

      if (botError) throw new Error('Failed to fetch bot details');
      if (!botData) throw new Error('Bot not found');

      setBot(botData);
      setFormData(botData);
    } catch (err) {
      console.error('Error fetching bot:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchBot();
  }, [session, botId, supabase]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('chatbots')
        .update(formData)
        .eq('id', botId);

      if (error) throw error;

      setBot(prev => ({ ...prev!, ...formData }));
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating bot:', err);
      setError('Failed to update bot details');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#141414] p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !bot) {
    return (
      <div className="min-h-screen bg-[#141414] p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-red-500">{error || 'Bot not found'}</p>
          <Link href="/dashboard" className="text-[#25D366] hover:underline mt-4 inline-block">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">Bot Details</h1>
          <div className="space-x-4">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-[#25D366] hover:bg-[#1fa855] text-white px-4 py-2 rounded-lg transition-colors"
              >
                Edit Bot
              </button>
            )}
            <Link
              href="/dashboard"
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors inline-block"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        <div className="bg-[#1E1E1E] rounded-lg overflow-hidden">
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'details'
                  ? 'text-white bg-[#2A2A2A] border-b-2 border-[#25D366]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Bot Details
            </button>
            <button
              onClick={() => setActiveTab('whatsapp')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'whatsapp'
                  ? 'text-white bg-[#2A2A2A] border-b-2 border-[#25D366]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              WhatsApp Settings
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'details' ? (
              isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-gray-400 mb-2">Bot Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleInputChange}
                      className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-2">Company</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company || ''}
                      onChange={handleInputChange}
                      className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-2">WhatsApp Number</label>
                    <input
                      type="text"
                      name="whatsapp_number"
                      value={formData.whatsapp_number || ''}
                      onChange={handleInputChange}
                      className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-2">Language</label>
                    <select
                      name="language"
                      value={formData.language || ''}
                      onChange={handleInputChange}
                      className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                    >
                      {LANGUAGE_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-2">Prompt</label>
                    <textarea
                      name="prompt"
                      value={formData.prompt || ''}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="bg-[#25D366] hover:bg-[#1fa855] text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(bot);
                        setIsEditing(false);
                      }}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-gray-400 mb-1">Bot Name</h2>
                    <p className="text-white text-lg">{bot.name}</p>
                  </div>

                  <div>
                    <h2 className="text-gray-400 mb-1">Company</h2>
                    <p className="text-white text-lg">{bot.company}</p>
                  </div>

                  <div>
                    <h2 className="text-gray-400 mb-1">WhatsApp Number</h2>
                    <p className="text-white text-lg">{bot.whatsapp_number}</p>
                  </div>

                  <div>
                    <h2 className="text-gray-400 mb-1">Language</h2>
                    <p className="text-white text-lg">{LANGUAGE_NAMES[bot.language || ''] || bot.language}</p>
                  </div>

                  <div>
                    <h2 className="text-gray-400 mb-1">Prompt</h2>
                    <p className="text-white text-lg whitespace-pre-wrap">{bot.prompt}</p>
                  </div>
                </div>
              )
            ) : (
              <WhatsAppSettings
                botId={botId}
                userId={bot.user_id}
                greenApiInstanceId={bot.greenapi_instance_id}
                greenApiInstanceToken={bot.greenapi_instance_token ?? null}
                onUpdate={() => fetchBot()}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
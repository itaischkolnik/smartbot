'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/lib/database.types';
import Link from 'next/link';
import { useParams } from 'next/navigation';

type Chatbot = Database['public']['Tables']['chatbots']['Row'];

const LANGUAGE_OPTIONS = [
  { code: 'af', name: 'Afrikaans' },
  { code: 'ar', name: 'Arabic' },
  { code: 'bg', name: 'Bulgarian' },
  { code: 'bn', name: 'Bengali' },
  { code: 'ca', name: 'Catalan' },
  { code: 'cs', name: 'Czech' },
  { code: 'da', name: 'Danish' },
  { code: 'de', name: 'German' },
  { code: 'el', name: 'Greek' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'et', name: 'Estonian' },
  { code: 'fa', name: 'Persian' },
  { code: 'fi', name: 'Finnish' },
  { code: 'fr', name: 'French' },
  { code: 'he', name: 'Hebrew' },
  { code: 'hi', name: 'Hindi' },
  { code: 'hr', name: 'Croatian' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'id', name: 'Indonesian' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'lt', name: 'Lithuanian' },
  { code: 'lv', name: 'Latvian' },
  { code: 'ms', name: 'Malay' },
  { code: 'nl', name: 'Dutch' },
  { code: 'no', name: 'Norwegian' },
  { code: 'pl', name: 'Polish' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ro', name: 'Romanian' },
  { code: 'ru', name: 'Russian' },
  { code: 'sk', name: 'Slovak' },
  { code: 'sl', name: 'Slovenian' },
  { code: 'sv', name: 'Swedish' },
  { code: 'sw', name: 'Swahili' },
  { code: 'ta', name: 'Tamil' },
  { code: 'th', name: 'Thai' },
  { code: 'tr', name: 'Turkish' },
  { code: 'uk', name: 'Ukrainian' },
  { code: 'ur', name: 'Urdu' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'zh', name: 'Chinese' }
];

export default function BotDetailsPage() {
  const params = useParams();
  const botId = params.id as string;
  const { data: session } = useSession();
  const [bot, setBot] = useState<Chatbot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'whatsapp'>('details');
  const [formData, setFormData] = useState<Partial<Chatbot>>({});
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function fetchBot() {
    if (!session?.user?.email || !botId) {
      console.log('Missing required data:', JSON.stringify({
        email: session?.user?.email,
        botId
      }, null, 2));
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // First get the user's ID
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .single();

      if (userError) {
        console.error('User fetch error:', JSON.stringify(userError, null, 2));
        throw new Error('Failed to fetch user data');
      }
      if (!userData) {
        console.error('No user data found for email:', session.user.email);
        throw new Error('User not found');
      }

      console.log('Found user:', JSON.stringify(userData, null, 2));

      // Then fetch the bot details
      const { data: botData, error: botError } = await supabase
        .from('chatbots')
        .select('*')
        .eq('id', botId)
        .eq('user_id', userData.id)
        .single();

      if (botError) {
        console.error('Bot fetch error:', JSON.stringify(botError, null, 2));
        throw new Error('Failed to fetch bot details');
      }
      if (!botData) {
        console.error('No bot found with ID:', botId);
        throw new Error('Bot not found');
      }

      console.log('Fetched bot data:', JSON.stringify({
        id: botData.id,
        name: botData.name,
        prompt: botData.prompt,
        language: botData.language,
        company: botData.company,
        whatsapp_number: botData.whatsapp_number
      }, null, 2));

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
    console.log('useEffect triggered with:', JSON.stringify({
      'session?.user?.email': session?.user?.email,
      botId
    }, null, 2));
    fetchBot();
  }, [session?.user?.email, botId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log('Input change:', name, value);
    
    if (name === 'language') {
      // When language changes, update both language and prompt
      const selectedLanguage = LANGUAGE_OPTIONS.find(lang => lang.code === value)?.name || value;
      setFormData(prev => {
        const newData = {
          ...prev,
          language: value,
          prompt: prev.prompt?.replace(
            /Please communicate in [a-zA-Z]+/,
            `Please communicate in ${selectedLanguage}`
          )
        };
        console.log('New form data:', JSON.stringify(newData, null, 2));
        return newData;
      });
    } else {
      // For other fields, just update normally
      setFormData(prev => {
        const newData = { ...prev, [name]: value };
        console.log('New form data:', JSON.stringify(newData, null, 2));
        return newData;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Submitting form data:', JSON.stringify(formData, null, 2));
      const { error } = await supabase
        .from('chatbots')
        .update(formData)
        .eq('id', botId);

      if (error) throw error;

      console.log('Update successful');
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
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#25D366]"></div>
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
                onClick={() => {
                  setActiveTab('details');
                  setIsEditing(true);
                }}
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

        <div className="bg-[#1a1a1a] rounded-lg overflow-hidden">
          <div className="flex border-b border-gray-800">
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
                      <option value="">Select a language</option>
                      {LANGUAGE_OPTIONS.map(lang => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-2">System Prompt</label>
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
                    <p className="text-white text-lg">
                      {LANGUAGE_OPTIONS.find(lang => lang.code === bot.language)?.name || bot.language || 'Not specified'}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-gray-400 mb-1">System Prompt</h2>
                    <p className="text-white text-lg whitespace-pre-wrap">{bot.prompt}</p>
                  </div>
                </div>
              )
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="text-gray-400 mb-1">WhatsApp Integration</h2>
                  <p className="text-white text-lg">
                    {bot.greenapi_instance_id 
                      ? `Connected (Instance ID: ${bot.greenapi_instance_id})`
                      : 'Not connected'}
                  </p>
                </div>
                
                {!bot.greenapi_instance_id && (
                  <Link
                    href={`/dashboard/bot/${bot.id}/connect`}
                    className="bg-[#25D366] hover:bg-[#1fa855] text-white px-4 py-2 rounded-lg transition-colors inline-block"
                  >
                    Connect WhatsApp
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
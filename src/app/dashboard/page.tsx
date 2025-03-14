'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/database.types';
import Link from 'next/link';

type Chatbot = Database['public']['Tables']['chatbots']['Row'];

export default function DashboardPage() {
  const { data: session } = useSession();
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    async function fetchChatbots() {
      if (!session?.user?.email) return;

      try {
        setIsLoading(true);
        setError(null);

        // First get the user's ID from the users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('email', session.user.email)
          .single();

        if (userError) {
          throw new Error('Failed to fetch user data');
        }

        if (!userData) {
          throw new Error('User not found');
        }

        // Then fetch the chatbots for this user
        const { data: botsData, error: botsError } = await supabase
          .from('chatbots')
          .select('*')
          .eq('user_id', userData.id)
          .order('created_at', { ascending: false });

        if (botsError) {
          throw new Error('Failed to fetch chatbots');
        }

        setChatbots(botsData);
      } catch (err) {
        console.error('Error fetching chatbots:', err);
        setError('Failed to fetch chatbots');
      } finally {
        setIsLoading(false);
      }
    }

    fetchChatbots();
  }, [session, supabase]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#141414] p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#25D366]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">My Chatbots</h1>
          <Link
            href="/dashboard/bot/new"
            className="bg-[#25D366] hover:bg-[#1fa855] text-white px-4 py-2 rounded-lg transition-colors"
          >
            Create New Bot
          </Link>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6 text-red-500">
            {error}
            <button
              onClick={() => window.location.reload()}
              className="ml-4 underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}

        {chatbots.length === 0 ? (
          <div className="bg-[#1a1a1a] rounded-lg p-12 text-center">
            <p className="text-gray-400 mb-4">You haven't created any chatbots yet.</p>
            <Link
              href="/dashboard/bot/new"
              className="text-[#25D366] hover:text-[#1fa855] underline"
            >
              Create your first chatbot
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chatbots.map((bot) => (
              <div
                key={bot.id}
                className="bg-[#1a1a1a] rounded-lg p-6 hover:bg-[#222222] transition-colors border border-[#25D366]/10 hover:border-[#25D366]/20"
              >
                <h3 className="text-xl font-semibold mb-2 text-white">{bot.name}</h3>
                {bot.company && (
                  <p className="text-gray-400 mb-2">Company: {bot.company}</p>
                )}
                <p className="text-gray-400 mb-4">
                  WhatsApp: {bot.whatsapp_number}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Created: {new Date(bot.created_at).toLocaleDateString()}
                  </span>
                  <Link
                    href={`/dashboard/bot/${bot.id}`}
                    className="text-[#25D366] hover:text-[#1fa855] flex items-center gap-1"
                  >
                    View Details
                    <span className="text-lg">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
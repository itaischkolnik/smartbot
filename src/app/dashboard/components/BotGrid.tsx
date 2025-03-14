'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Chatbot } from '@/lib/supabase';
import BotGridSkeleton from './BotGridSkeleton';

export default function BotGrid() {
  const router = useRouter();
  const [bots, setBots] = useState<Chatbot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBots();
  }, []);

  async function fetchBots() {
    try {
      const response = await fetch('/api/chatbots');
      if (!response.ok) {
        throw new Error('Failed to fetch chatbots');
      }
      const data = await response.json();
      setBots(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load chatbots');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this chatbot?')) {
      return;
    }

    try {
      const response = await fetch(`/api/chatbots/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete chatbot');
      }

      setBots(bots.filter(bot => bot.id !== id));
    } catch (err) {
      alert('Failed to delete chatbot');
    }
  }

  if (loading) {
    return <BotGridSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <button
          onClick={fetchBots}
          className="text-blue-500 hover:text-blue-600 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (bots.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
        No chatbots found. Create your first one!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bots.map((bot) => (
        <div
          key={bot.id}
          className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-green-500 transition-all cursor-pointer"
          onClick={() => router.push(`/dashboard/bot/${bot.id}`)}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">{bot.name}</h3>
            <span className="text-green-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </div>
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{bot.prompt}</p>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">{new Date(bot.created_at).toLocaleDateString()}</span>
            <span className="text-green-500">{bot.whatsapp_number}</span>
          </div>
        </div>
      ))}
    </div>
  );
} 
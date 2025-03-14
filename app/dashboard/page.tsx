'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { createClient } from '@/lib/supabase-browser';
import type { Database } from '@/lib/database.types';
import Link from 'next/link';

type Chatbot = Database['public']['Tables']['chatbots']['Row'];

export default function DashboardPage() {
  const { data: session } = useSession();
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

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
  // ... rest of the component
} 
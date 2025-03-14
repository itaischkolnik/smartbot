import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Type definitions for our database tables
export type User = {
  id: string;
  email: string;
  google_id: string;
  name?: string;
  image?: string;
  created_at: string;
};

export type Chatbot = {
  id: string;
  user_id: string;
  name: string;
  prompt: string;
  whatsapp_number: string;
  greenapi_instance_id: string;
  created_at: string;
};

export type Conversation = {
  id: string;
  chatbot_id: string;
  message: string;
  sender: 'user' | 'bot';
  timestamp: string;
};

// Create a Supabase client for server components
export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set(name, value, options)
          } catch (error) {
            // Handle cookie error
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.delete(name)
          } catch (error) {
            // Handle cookie error
          }
        },
      },
    }
  )
}

// Verify database connection
export const verifyDatabaseConnection = async () => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) throw error;
    console.log('Database connection verified');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}; 
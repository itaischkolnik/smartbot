import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing env.SUPABASE_SERVICE_ROLE_KEY');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    db: {
      schema: 'public'
    }
  }
);

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

// Verify database connection
export const verifyDatabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) throw error;
    console.log('Database connection verified');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}; 
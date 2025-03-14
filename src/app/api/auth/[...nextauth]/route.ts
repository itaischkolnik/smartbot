import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createClient } from '@supabase/supabase-js';

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

// Initialize Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  db: {
    schema: 'public'
  }
});

// Verify Supabase connection
const verifySupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) {
      console.error('Supabase connection error:', error);
      throw error;
    }
    console.log('Supabase connection verified');
  } catch (error) {
    console.error('Failed to verify Supabase connection:', error);
    throw error;
  }
};

// Verify connection on startup
verifySupabaseConnection().catch(console.error);

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile"
        }
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  logger: {
    error: (code, ...args) => {
      console.error('[NextAuth][Error]', { code, details: args });
    },
    warn: (code, ...args) => {
      console.warn('[NextAuth][Warn]', { code, details: args });
    },
    debug: (code, ...args) => {
      console.log('[NextAuth][Debug]', { code, details: args });
    },
  },
  pages: {
    signIn: "/auth/login",
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('[NextAuth][SignIn] Attempt:', {
        email: user?.email,
        name: user?.name,
        accountType: account?.provider,
        hasProfile: !!profile
      });
      
      if (!user?.email) {
        console.error("[NextAuth][SignIn] No email provided by Google");
        throw new Error('No email provided by Google');
      }

      try {
        // First, verify we can connect to Supabase
        await verifySupabaseConnection();

        // Check if user exists in Supabase
        const { data: existingUser, error: selectError } = await supabase
          .from('users')
          .select('*')
          .eq('email', user.email)
          .single();

        if (selectError) {
          if (selectError.code === 'PGRST116') {
            console.log('[NextAuth][SignIn] Creating new user:', user.email);
            // Create new user in Supabase
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                email: user.email,
                google_id: account?.providerAccountId,
                name: user.name,
                image: user.image,
                created_at: new Date().toISOString()
              });

            if (insertError) {
              console.error('[NextAuth][SignIn] User creation failed:', insertError);
              throw new Error(`Failed to create user: ${insertError.message}`);
            }
          } else {
            console.error('[NextAuth][SignIn] Database error:', selectError);
            throw new Error(`Database error: ${selectError.message}`);
          }
        } else {
          console.log('[NextAuth][SignIn] Existing user found:', user.email);
        }

        return true;
      } catch (error) {
        console.error('[NextAuth][SignIn] Error:', error);
        throw error;
      }
    },
    async jwt({ token, account, profile }) {
      if (account) {
        console.log('[NextAuth][JWT] Setting up token for:', token.email);
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
      }
      return token;
    },
    async session({ session, token }) {
      console.log('[NextAuth][Session] Setting up session for:', session?.user?.email);
      
      if (session.user) {
        try {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('email', session.user.email)
            .single();

          if (userError) {
            console.error('[NextAuth][Session] Error fetching user data:', userError);
          } else if (userData) {
            session.user.id = userData.id;
          }
        } catch (error) {
          console.error('[NextAuth][Session] Error in session callback:', error);
        }
      }
      return session;
    }
  },
});

export { handler as GET, handler as POST }; 
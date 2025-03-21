'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(() => {
    const errorParam = searchParams?.get('error');
    return errorParam ? decodeURIComponent(errorParam) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Starting Google sign-in process...');
      const callbackUrl = searchParams?.get('callbackUrl') || '/dashboard';
      
      console.log('Callback URL:', callbackUrl);
      console.log('Current URL:', window.location.href);
      
      const result = await signIn('google', {
        callbackUrl,
        redirect: true
      });

      // Note: The code below might not execute due to redirect: true
      console.log('Sign-in result:', result);
      
      if (result?.error) {
        console.error('Sign-in error:', result.error);
        setError(
          result.error === 'OAuthSignin' 
            ? 'Failed to start Google sign-in. Please try again.'
            : result.error === 'AccessDenied'
            ? 'Access was denied. Please make sure you are using an authorized Google account.'
            : result.error === 'Configuration'
            ? 'There is a problem with the server configuration. Please try again later.'
            : `Authentication error: ${result.error}`
        );
      } else if (result?.url) {
        console.log('Redirecting to:', result.url);
        router.push(result.url);
      }
    } catch (error) {
      console.error('Unexpected error during sign in:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-[#25D366] rounded-2xl rotate-45 transform transition-transform hover:rotate-0 duration-500 mb-6" />
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome to <span className="text-[#25D366]">SmartBot</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Create and manage intelligent WhatsApp chatbots
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-center">
            {error}
          </div>
        )}

        {/* Login Button */}
        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#25D366]/20 hover:border-[#25D366]/40 transition-all">
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-[#25D366] text-white rounded-lg px-6 py-4 font-medium hover:bg-[#1fa855] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Connecting to Google...</span>
              </div>
            ) : (
              <>
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </button>
          <p className="text-gray-400 text-sm text-center mt-4">
            Secure login powered by Google OAuth 2.0
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          {[
            "AI-Powered Responses",
            "Easy WhatsApp Integration",
            "Real-time Monitoring",
            "24/7 Availability"
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-[#1a1a1a] p-4 rounded-xl border border-[#25D366]/20 text-center"
            >
              <div className="text-[#25D366] mb-2">●</div>
              <div className="text-white text-sm font-medium">{feature}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 
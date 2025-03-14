'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  useEffect(() => {
    console.log('Auth Error Details:', {
      error,
      errorDescription,
      allParams: Object.fromEntries([...searchParams.entries()])
    });
  }, [error, errorDescription, searchParams]);

  const getErrorMessage = (errorCode: string | null) => {
    const baseMessage = (() => {
      switch (errorCode) {
        case 'AccessDenied':
          return 'Access was denied. This usually means either:\n1. Your Google account is not in the test users list\n2. You denied the permissions request';
        case 'Configuration':
          return 'There is a problem with the server configuration. This might be due to missing or invalid credentials.';
        case 'Verification':
          return 'The verification link was invalid or has expired. Please try signing in again.';
        default:
          return 'An authentication error occurred. Please try again.';
      }
    })();

    return errorDescription 
      ? `${baseMessage}\n\nError details: ${errorDescription}`
      : baseMessage;
  };

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#1a1a1a] rounded-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">
          Authentication Error
        </h1>
        <p className="text-gray-300 mb-8 whitespace-pre-line">
          {getErrorMessage(error)}
        </p>
        <div className="space-y-4">
          <Link
            href="/auth/login"
            className="block w-full bg-[#25D366] hover:bg-[#1fa855] text-white py-3 px-4 rounded-lg transition-colors"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="block w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
} 
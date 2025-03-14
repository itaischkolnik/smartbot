'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center p-4">
      <div className="bg-[#1E1E1E] rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-white mb-4">Authentication Error</h1>
        <p className="text-gray-400 mb-6">
          {error || 'An error occurred during authentication. Please try again.'}
        </p>
        <a
          href="/"
          className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#141414] flex items-center justify-center p-4">
        <div className="bg-[#1E1E1E] rounded-lg p-8 max-w-md w-full">
          <div className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" />
          <p className="text-gray-400 mt-4">Loading...</p>
        </div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
} 
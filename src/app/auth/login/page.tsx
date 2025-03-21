'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import type { ReactElement } from 'react';
import dynamic from 'next/dynamic';

const LoginContent = dynamic(() => import('./LoginContent'), {
  loading: () => (
    <div className="min-h-screen bg-[#111111] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-[#25D366] rounded-full" />
        <p className="text-gray-400 mt-4">Loading...</p>
      </div>
    </div>
  ),
  ssr: false
});

export default function LoginPage(): ReactElement {
  return <LoginContent />;
} 
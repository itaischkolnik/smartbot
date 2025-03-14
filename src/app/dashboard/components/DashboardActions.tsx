'use client';

import { useRouter } from 'next/navigation';

export default function DashboardActions() {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-bold text-white">
        My Chatbots
      </h1>
      <button
        onClick={() => router.push('/dashboard/create')}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        Create New Bot
      </button>
    </div>
  );
} 
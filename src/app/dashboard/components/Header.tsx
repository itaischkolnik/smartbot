'use client';

import Image from 'next/image';
import { signOut } from 'next-auth/react';

interface HeaderProps {
  userEmail: string;
}

export default function Header({ userEmail }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="SmartBot Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              SmartBot
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-gray-600 dark:text-gray-300">
              {userEmail}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 
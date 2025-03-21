'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Sidebar from './components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#141414] p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#25D366]"></div>
      </div>
    );
  }

  if (!session) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-[#111111]">
      <div className="flex">
        <Sidebar 
          userEmail={session.user?.email || ''} 
          userImage={session.user?.image || ''}
        />
        <main className="flex-1 min-h-screen pl-64">
          {children}
        </main>
      </div>
    </div>
  );
} 
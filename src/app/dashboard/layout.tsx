import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Sidebar from './components/Sidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect('/login');
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
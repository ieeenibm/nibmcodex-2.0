'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Gamepad2, LogOut, Users, BookOpen } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleSignOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-300 font-sans selection:bg-cyan-400/30">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-navy-900 border-r border-white/5 flex flex-col">
        <div className="p-6">
          <Link href="/admin/dashboard" className="flex items-center gap-2 text-white hover:text-cyan-400 transition-colors">
            <Gamepad2 className="w-6 h-6 text-cyan-500" />
            <span className="font-bold text-xl tracking-tight">Pulse Mini</span>
          </Link>
          <p className="text-xs text-slate-500 mt-1 font-mono">Host Dashboard</p>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 text-cyan-400 border border-cyan-500/20"
          >
            <Gamepad2 className="w-5 h-5" />
            <span className="font-medium text-sm">Sessions</span>
          </Link>
          <Link
            href="/admin/dashboard/hosts"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
          >
            <Users className="w-5 h-5" />
            <span className="font-medium text-sm">Manage Hosts</span>
          </Link>
          <Link
            href="/admin/dashboard/docs"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            <span className="font-medium text-sm">Host Guide</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg hover:bg-white/5 text-slate-400 hover:text-red-400 transition-colors text-left text-sm font-medium"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pl-64 min-h-screen">
        <div className="max-w-6xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

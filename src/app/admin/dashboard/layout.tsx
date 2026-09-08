'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Gamepad2, LogOut, Users, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('pulse_mini_sidebar_collapsed');
    if (saved !== null) {
      setIsCollapsed(saved === 'true');
    }
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('pulse_mini_sidebar_collapsed', String(next));
      return next;
    });
  };

  const handleSignOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const isSessionsActive =
    pathname === '/admin/dashboard' || pathname.startsWith('/admin/dashboard/session');
  const isHostsActive = pathname.startsWith('/admin/dashboard/hosts');
  const isDocsActive = pathname.startsWith('/admin/dashboard/docs');

  return (
    <div className="min-h-screen bg-navy-950 text-slate-300 font-sans selection:bg-cyan-400/30">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 bg-navy-900 border-r border-white/5 flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className={`p-4 flex items-center ${isCollapsed ? 'flex-col gap-3 justify-center' : 'justify-between'} border-b border-white/5`}>
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2.5 text-white hover:text-cyan-400 transition-colors"
            title="Pulse Mini Dashboard"
          >
            <Gamepad2 className="w-6 h-6 text-cyan-500 shrink-0" />
            {!isCollapsed && (
              <div>
                <span className="font-bold text-lg tracking-tight block leading-tight">Pulse Mini</span>
                <span className="text-[10px] text-slate-500 font-mono">Host Dashboard</span>
              </div>
            )}
          </Link>

          <button
            onClick={toggleCollapse}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1.5 mt-4">
          <Link
            href="/admin/dashboard"
            title="Sessions"
            className={`flex items-center gap-3 ${
              isCollapsed ? 'justify-center px-0' : 'px-3'
            } py-2.5 rounded-lg transition-colors ${
              isSessionsActive
                ? 'bg-white/5 text-cyan-400 border border-cyan-500/20 font-semibold'
                : 'hover:bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <Gamepad2 className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span className="font-medium text-sm">Sessions</span>}
          </Link>
          <Link
            href="/admin/dashboard/hosts"
            title="Manage Hosts"
            className={`flex items-center gap-3 ${
              isCollapsed ? 'justify-center px-0' : 'px-3'
            } py-2.5 rounded-lg transition-colors ${
              isHostsActive
                ? 'bg-white/5 text-cyan-400 border border-cyan-500/20 font-semibold'
                : 'hover:bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span className="font-medium text-sm">Manage Hosts</span>}
          </Link>
          <Link
            href="/admin/dashboard/docs"
            title="Host Guide"
            className={`flex items-center gap-3 ${
              isCollapsed ? 'justify-center px-0' : 'px-3'
            } py-2.5 rounded-lg transition-colors ${
              isDocsActive
                ? 'bg-white/5 text-cyan-400 border border-cyan-500/20 font-semibold'
                : 'hover:bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span className="font-medium text-sm">Host Guide</span>}
          </Link>
        </nav>

        <div className="p-3 border-t border-white/5">
          <button
            onClick={handleSignOut}
            title="Sign Out"
            className={`flex items-center gap-3 ${
              isCollapsed ? 'justify-center px-0' : 'px-3'
            } py-2.5 w-full rounded-lg hover:bg-white/5 text-slate-400 hover:text-red-400 transition-colors text-left text-sm font-medium`}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`min-h-screen transition-all duration-300 ease-in-out ${
          isCollapsed ? 'pl-20' : 'pl-64'
        }`}
      >
        <div className="max-w-6xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Gamepad2, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';

function PlayForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    const codeParam = searchParams.get('code');
    if (codeParam) {
      setCode(codeParam.toUpperCase());
    }
  }, [searchParams]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim() || isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/play/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), joinCode: code.trim().toUpperCase() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to join session');
      }

      localStorage.setItem(`pulse_mini_${data.sessionId}`, data.participantId);
      router.push(`/play/${data.sessionId}`);
    } catch (err: any) {
      setError(err.message);
      isSubmittingRef.current = false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
      <div className="bg-navy-900/90 backdrop-blur-md py-8 px-5 sm:px-10 shadow-2xl sm:rounded-3xl border border-white/10">
        <form className="space-y-5" onSubmit={handleJoin}>
          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-slate-400 mb-2">
              Your Nickname
            </label>
            <input
              required
              autoFocus
              type="text"
              placeholder="e.g. CyberNinja"
              maxLength={25}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="appearance-none block w-full px-4 py-3.5 border border-white/10 rounded-2xl shadow-sm placeholder-slate-600 bg-navy-950 text-white font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-lg text-center"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-slate-400 mb-2">
              Game PIN / Code
            </label>
            <input
              required
              type="text"
              placeholder="ABC123"
              maxLength={10}
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="appearance-none block w-full px-4 py-3.5 border border-white/10 rounded-2xl shadow-sm placeholder-slate-600 bg-navy-950 text-cyan-400 font-black tracking-[0.25em] uppercase focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-2xl text-center"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2.5 rounded-xl text-xs text-center font-bold">
              {error}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || !name.trim() || !code.trim()}
              className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-cyan-500/20 text-lg font-black text-navy-950 bg-cyan-400 hover:bg-cyan-300 active:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed enabled:cursor-pointer transition-all transform active:scale-98"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Join Session</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PlayContent() {
  return (
    <main className="min-h-screen bg-navy-950 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-6 left-6 z-10">
          <Link
            href="/"
            className="text-slate-400 hover:text-cyan-300 font-bold font-mono tracking-tight text-xs flex items-center gap-1.5 transition-colors"
          >
            &larr; BACK TO NIBMCODEX
          </Link>
        </div>

        <div className="my-auto">
          <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
            <div className="inline-flex p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl mb-4">
              <Gamepad2 className="w-10 h-10 text-cyan-400" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">Pulse Mini</h1>
            <p className="text-slate-400 text-sm mt-1">Live interactive arena</p>
          </div>

          <PlayForm />
        </div>

        <div className="pb-2 text-center relative z-10">
          <p className="text-slate-600 text-xs font-mono">POWERED BY PULSE MINI</p>
        </div>

        {/* Decorative Background Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-navy-950 to-navy-950 pointer-events-none" />
      </main>
  );
}

export default function PlayPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-navy-950 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        </div>
      }
    >
      <PlayContent />
    </Suspense>
  );
}

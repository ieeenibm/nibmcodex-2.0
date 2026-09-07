'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Trophy, CheckCircle2, AlertTriangle, Loader2, QrCode, ArrowRight } from 'lucide-react';

export default function TicketClaimPage() {
  const params = useParams();
  const router = useRouter();
  const code = (params?.code as string)?.toUpperCase() || '';

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [nickname, setNickname] = useState('');
  const [needsName, setNeedsName] = useState(false);
  const [sessionMeta, setSessionMeta] = useState<{ id: string; name: string; ticketNumber: number } | null>(null);

  const [result, setResult] = useState<{
    success: boolean;
    pointsEarned: number;
    isWinning: boolean;
    ticketNumber: number;
    newScore: number;
    participantName: string;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);

  const attemptClaim = async (participantId?: string, nameToUse?: string) => {
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/play/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          participantId: participantId || undefined,
          name: nameToUse?.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.needsRegistration) {
          setNeedsName(true);
          setSessionMeta({
            id: data.sessionId,
            name: data.sessionName,
            ticketNumber: data.ticketNumber,
          });
          setLoading(false);
          return;
        }

        if (data.alreadyClaimed) {
          setAlreadyClaimed(true);
          setError(data.error);
          setLoading(false);
          return;
        }

        throw new Error(data.error || 'Failed to claim ticket');
      }

      // Save participantId to localStorage so future claims are instant
      if (data.participantId) {
        localStorage.setItem(`pulse_mini_last_id`, data.participantId);
        if (sessionMeta?.id) {
          localStorage.setItem(`pulse_mini_${sessionMeta.id}`, data.participantId);
        }
      }

      setResult(data);
      setNeedsName(false);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!code) return;

    // Check if participantId exists in localStorage
    const savedId = localStorage.getItem(`pulse_mini_last_id`);
    attemptClaim(savedId || undefined);
  }, [code]);

  return (
    <div className="min-h-screen bg-navy-950 text-white flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden select-none">
      <header className="flex justify-between items-center py-4 border-b border-white/10 z-10">
        <Link href="/" className="font-mono text-cyan-400 font-bold text-xs tracking-wider flex items-center gap-1">
          &larr; NIBM CODEX 2.0
        </Link>
        <span className="text-[10px] font-mono uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full">
          GOLDEN TICKET SCAN
        </span>
      </header>

      <main className="my-auto max-w-md w-full mx-auto relative z-10 py-8">
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
            <p className="text-slate-300 font-bold font-mono">Verifying Ticket #{code}...</p>
          </div>
        ) : result ? (
          <div className="bg-navy-900/90 border-2 border-cyan-500/40 clip-slanted rounded-none p-8 text-center backdrop-blur-md shadow-2xl animate-in zoom-in-95 duration-500">
            {result.isWinning ? (
              <div className="w-20 h-20 bg-yellow-500/20 border-2 border-yellow-500/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-yellow-500/20">
                <Trophy className="w-10 h-10 text-yellow-400 animate-bounce" />
              </div>
            ) : (
              <div className="w-20 h-20 bg-cyan-500/20 border-2 border-cyan-500/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-cyan-500/20">
                <CheckCircle2 className="w-10 h-10 text-cyan-400" />
              </div>
            )}

            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold mb-1 block">
              TICKET #{String(result.ticketNumber).padStart(2, '0')} CLAIMED!
            </span>

            <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">
              {result.isWinning ? 'GOLDEN TICKET FOUND!' : 'Ticket Discovered!'}
            </h2>

            <p className="text-slate-300 text-sm mb-6">
              Great job, <strong className="text-white">{result.participantName}</strong>!
            </p>

            <div className="bg-navy-950 border border-white/10 p-5 mb-6 clip-slanted rounded-none">
              <div className="flex items-center justify-between text-left">
                <div>
                  <span className="text-xs text-slate-400 uppercase font-mono block">Points Earned</span>
                  <span className="text-3xl font-black text-cyan-400 font-mono">+{result.pointsEarned}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 uppercase font-mono block">Total Score</span>
                  <span className="text-2xl font-black text-yellow-400 font-mono">{result.newScore} pts</span>
                </div>
              </div>
            </div>

            <p className="text-slate-400 text-xs font-mono mb-6">
              Search the venue for more QR tickets to climb the leaderboard!
            </p>

            <Link
              href="/play"
              className="w-full py-4 bg-cyan-400 hover:bg-cyan-300 text-navy-950 font-black text-base clip-slanted rounded-none flex items-center justify-center gap-2 transition-all shadow-xl shadow-cyan-500/20"
            >
              <span>Back to Arena</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : needsName ? (
          <div className="bg-navy-900/90 border border-white/10 clip-slanted rounded-none p-8 text-center backdrop-blur-md shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-cyan-500/15 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-cyan-500/30">
              <QrCode className="w-8 h-8 text-cyan-400" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white mb-1">Claim Ticket!</h2>
            <p className="text-slate-400 text-sm mb-6">
              Enter your nickname to claim points for <span className="text-cyan-400 font-bold">{sessionMeta?.name || 'this session'}</span>.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (nickname.trim()) attemptClaim(undefined, nickname);
              }}
              className="space-y-4"
            >
              <div>
                <input
                  required
                  type="text"
                  autoFocus
                  maxLength={25}
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Your Nickname (e.g. Alex)"
                  className="w-full px-4 py-3.5 bg-navy-950 border border-white/15 clip-slanted rounded-none text-white text-center font-bold text-lg focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              {error && (
                <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/30 p-2 font-semibold">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting || !nickname.trim()}
                className="w-full py-4 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 text-navy-950 font-black text-lg clip-slanted rounded-none flex items-center justify-center gap-2 transition-all shadow-xl shadow-cyan-500/20"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Claiming...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Claim Ticket</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-navy-900/90 border border-red-500/30 clip-slanted rounded-none p-8 text-center backdrop-blur-md shadow-2xl">
            <div className="w-16 h-16 bg-red-500/15 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/30">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>

            <h2 className="text-2xl font-black text-white mb-2">
              {alreadyClaimed ? 'Already Claimed!' : 'Unable to Claim'}
            </h2>

            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
              {error || 'This ticket code is invalid or has expired.'}
            </p>

            <Link
              href="/play"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold clip-slanted rounded-none text-sm transition-colors"
            >
              Return to Arena
            </Link>
          </div>
        )}
      </main>

      <footer className="py-4 text-center text-slate-600 text-[11px] font-mono z-10">
        PULSE MINI • GOLDEN TICKET SCAVENGER HUNT • NIBM CODEX 2.0
      </footer>

      {/* Decorative Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-navy-950 to-navy-950 pointer-events-none" />
    </div>
  );
}

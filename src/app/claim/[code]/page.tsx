'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  Trophy,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  QrCode,
  ArrowRight,
  Clock,
  Zap,
  XCircle,
  Compass,
  RotateCcw,
} from 'lucide-react';

interface TicketInfo {
  valid: boolean;
  ticketNumber: number;
  sessionId: string;
  sessionName: string;
  isWinning: boolean;
  message?: string;
  potentialPoints?: number;
  hasQuestion?: boolean;
  question?: string;
  options?: string[];
  timeLimit?: number;
  maxAttempts?: number;
  attemptsUsed?: number;
  attemptsRemaining?: number;
  alreadyClaimed?: boolean;
  isExpired?: boolean;
}

interface ClaimResult {
  success: boolean;
  isWinning: boolean;
  isCorrect?: boolean;
  pointsEarned: number;
  attemptsUsed?: number;
  attemptsRemaining?: number;
  message?: string;
  ticketNumber: number;
  participantName?: string;
  newScore?: number;
}

export default function TicketClaimPage() {
  const params = useParams();
  const code = (params?.code as string)?.toUpperCase() || '';

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [nickname, setNickname] = useState('');
  const [needsName, setNeedsName] = useState(false);
  const [participantId, setParticipantId] = useState<string | null>(null);

  const [ticketInfo, setTicketInfo] = useState<TicketInfo | null>(null);
  const [result, setResult] = useState<ClaimResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [wrongAttemptMessage, setWrongAttemptMessage] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Trivia countdown timer
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hasAutoSubmittedRef = useRef<boolean>(false);

  // Load participant from localStorage on mount
  useEffect(() => {
    const savedId = localStorage.getItem('pulse_mini_last_id');
    if (savedId) {
      setParticipantId(savedId);
    }
  }, []);

  // Fetch ticket details
  const fetchTicketInfo = async (pid?: string) => {
    if (!code) return;
    setLoading(true);
    setError(null);

    try {
      let activePid = pid !== undefined ? pid : participantId;

      const url = `/api/play/claim?code=${encodeURIComponent(code)}${activePid ? `&participantId=${encodeURIComponent(activePid)}` : ''}`;
      const res = await fetch(url);
      const data: TicketInfo = await res.json();

      if (!res.ok) {
        throw new Error((data as any).error || 'Failed to query ticket');
      }

      // If activePid wasn't found initially, try reading session-specific participant key
      if (!activePid && data.sessionId) {
        const sessionPid = localStorage.getItem(`pulse_mini_${data.sessionId}`);
        if (sessionPid) {
          activePid = sessionPid;
          setParticipantId(sessionPid);
          // Re-fetch with detected participant ID so attempt counts reflect accurately
          fetchTicketInfo(sessionPid);
          return;
        }
      }

      setTicketInfo(data);

      if (!activePid) {
        setNeedsName(true);
      } else if (data.isWinning && data.hasQuestion && !data.alreadyClaimed && (data.attemptsRemaining ?? 1) > 0) {
        // Start countdown timer for winning trivia
        const limit = data.timeLimit || 30;
        setTimeLeft(limit);
        startTimeRef.current = Date.now();
        hasAutoSubmittedRef.current = false;
      }
    } catch (err: any) {
      setError(err.message || 'Unable to load ticket details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketInfo();
  }, [code]);

  // Trivia Countdown Hook for Winning Ticket
  useEffect(() => {
    if (
      !ticketInfo?.isWinning ||
      !ticketInfo?.hasQuestion ||
      ticketInfo.alreadyClaimed ||
      (ticketInfo.attemptsRemaining ?? 1) <= 0 ||
      needsName ||
      loading ||
      result?.isCorrect ||
      submitting
    ) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    if (startTimeRef.current === 0) {
      startTimeRef.current = Date.now();
    }

    const limit = ticketInfo.timeLimit || 30;

    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const remaining = Math.max(0, limit - elapsed);
      setTimeLeft(Math.ceil(remaining));

      if (remaining <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        if (!hasAutoSubmittedRef.current) {
          hasAutoSubmittedRef.current = true;
          // Auto-submit timeout answer
          submitClaim('', limit);
        }
      }
    }, 250);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [ticketInfo?.isWinning, ticketInfo?.hasQuestion, ticketInfo?.alreadyClaimed, ticketInfo?.attemptsRemaining, needsName, loading, result?.isCorrect, submitting]);

  // Submit Answer
  const submitClaim = async (chosenAnswer: string, explicitTimeTaken?: number) => {
    if (submitting) return;
    setSubmitting(true);
    setSelectedOption(chosenAnswer);
    setWrongAttemptMessage(null);

    try {
      const elapsed = explicitTimeTaken ?? Math.max(0, (Date.now() - (startTimeRef.current || Date.now())) / 1000);

      const res = await fetch('/api/play/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          participantId: participantId || undefined,
          name: nickname.trim() || undefined,
          answer: chosenAnswer,
          timeTaken: elapsed,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.needsRegistration) {
          setNeedsName(true);
          return;
        }

        if (data.alreadyClaimed) {
          setError(data.error);
          setTicketInfo((prev) => (prev ? { ...prev, alreadyClaimed: true } : null));
          return;
        }

        throw new Error(data.error || 'Failed to process claim');
      }

      if (data.participantId) {
        setParticipantId(data.participantId);
        localStorage.setItem('pulse_mini_last_id', data.participantId);
        if (ticketInfo?.sessionId) {
          localStorage.setItem(`pulse_mini_${ticketInfo.sessionId}`, data.participantId);
        }
      }

      // If answer was incorrect but attempts remain, allow another try
      if (!data.isCorrect && (data.attemptsRemaining ?? 0) > 0) {
        setWrongAttemptMessage(data.message || `Incorrect answer! You have ${data.attemptsRemaining} attempt(s) remaining.`);
        setTicketInfo((prev) =>
          prev
            ? {
                ...prev,
                attemptsUsed: data.attemptsUsed,
                attemptsRemaining: data.attemptsRemaining,
              }
            : null
        );
        setSelectedOption(null);
      } else {
        // Correct answer OR out of attempts
        if (timerRef.current) clearInterval(timerRef.current);
        setResult(data);
        setNeedsName(false);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong while submitting.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Nickname Registration
  const handleRegisterName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;
    setNeedsName(false);

    if (ticketInfo?.isWinning && ticketInfo?.hasQuestion && !ticketInfo.alreadyClaimed) {
      setTimeLeft(ticketInfo.timeLimit || 30);
      startTimeRef.current = Date.now();
      hasAutoSubmittedRef.current = false;
    } else {
      submitClaim('');
    }
  };

  const timeLimit = ticketInfo?.timeLimit || 30;
  const timerPercentage = Math.max(0, Math.min(100, (timeLeft / timeLimit) * 100));
  const isUrgent = timeLeft <= 7;

  // Live decaying points calculation to show urgency
  const basePotential = ticketInfo?.potentialPoints || 1000;
  const liveDecayedPoints = Math.max(100, Math.round(basePotential * (0.4 + 0.6 * (timeLeft / timeLimit))));

  return (
    <div className="min-h-screen bg-navy-950 text-white flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden select-none">
      <header className="flex justify-between items-center py-4 border-b border-white/10 z-10">
        <Link
          href={ticketInfo?.sessionId ? `/play/${ticketInfo.sessionId}` : '/play'}
          className="font-mono text-cyan-400 font-bold text-xs tracking-wider flex items-center gap-1 hover:text-cyan-300 transition-colors"
        >
          &larr; CODEX ARENA
        </Link>
        <span className="text-[10px] font-mono uppercase tracking-widest bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 px-2.5 py-1 rounded-full flex items-center gap-1.5 font-bold">
          <Sparkles className="w-3 h-3 text-yellow-400" />
          GOLDEN TICKET HUNT
        </span>
      </header>

      <main className="my-auto max-w-md w-full mx-auto relative z-10 py-6">
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
            <p className="text-slate-300 font-bold font-mono text-sm">Verifying QR Ticket #{code}...</p>
          </div>
        ) : error && !result && !ticketInfo?.alreadyClaimed ? (
          /* Error State */
          <div className="bg-navy-900/90 border border-red-500/30 clip-slanted rounded-none p-8 text-center backdrop-blur-md shadow-2xl">
            <div className="w-16 h-16 bg-red-500/15 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/30">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>

            <h2 className="text-2xl font-black text-white mb-2">Unable to Scan</h2>
            <p className="text-slate-300 text-sm mb-6 leading-relaxed">{error}</p>

            <Link
              href={ticketInfo?.sessionId ? `/play/${ticketInfo.sessionId}` : '/play'}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold clip-slanted rounded-none text-sm transition-colors"
            >
              Return to Arena
            </Link>
          </div>
        ) : needsName ? (
          /* Nickname Input Screen */
          <div className="bg-navy-900/95 border border-cyan-500/30 clip-slanted rounded-none p-8 text-center backdrop-blur-md shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-cyan-500/15 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-cyan-500/30">
              <QrCode className="w-8 h-8 text-cyan-400" />
            </div>

            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold mb-1 block">
              TICKET #{String(ticketInfo?.ticketNumber || 1).padStart(2, '0')} SCANNED
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">Identify Yourself</h2>
            <p className="text-slate-400 text-sm mb-6">
              Enter your nickname to check this ticket for <strong className="text-cyan-400">{ticketInfo?.sessionName || 'this arena'}</strong>.
            </p>

            <form onSubmit={handleRegisterName} className="space-y-4">
              <div>
                <input
                  required
                  type="text"
                  autoFocus
                  maxLength={25}
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Your Nickname"
                  className="w-full px-4 py-3.5 bg-navy-950 border border-white/20 clip-slanted rounded-none text-white text-center font-bold text-lg focus:outline-none focus:border-cyan-400 transition-colors placeholder:text-slate-600"
                />
              </div>

              <button
                type="submit"
                disabled={!nickname.trim()}
                className="w-full py-4 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 text-navy-950 font-black text-lg clip-slanted rounded-none flex items-center justify-center gap-2 transition-all shadow-xl shadow-cyan-500/20"
              >
                <span>Continue</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        ) : ticketInfo && !ticketInfo.isWinning ? (
          /* === DECOY QR CARD === */
          <div className="bg-navy-900/90 border border-amber-500/30 clip-slanted rounded-none p-8 text-center backdrop-blur-md shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-amber-500/10 border-2 border-amber-500/30 rounded-full flex items-center justify-center mx-auto mb-5 shadow-xl shadow-amber-500/10">
              <Compass className="w-10 h-10 text-amber-400 animate-pulse" />
            </div>

            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold mb-1 block">
              TICKET #{String(ticketInfo.ticketNumber).padStart(2, '0')} • DECOY CODE
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-amber-400 mb-2">Not The Golden Ticket!</h2>
            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
              This is not the right QR code. Keep on searching! The true Golden Ticket is hidden somewhere in the venue.
            </p>

            <Link
              href={ticketInfo.sessionId ? `/play/${ticketInfo.sessionId}` : '/play'}
              className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-navy-950 font-black text-base clip-slanted rounded-none flex items-center justify-center gap-2 transition-all shadow-xl shadow-amber-500/20"
            >
              <span>Keep Searching (Back to Arena)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : ticketInfo?.alreadyClaimed && !result ? (
          /* Already Claimed Screen */
          <div className="bg-navy-900/90 border border-yellow-500/30 clip-slanted rounded-none p-8 text-center backdrop-blur-md shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-yellow-500/15 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-yellow-500/30">
              <CheckCircle2 className="w-8 h-8 text-yellow-400" />
            </div>

            <span className="text-xs font-mono uppercase tracking-widest text-yellow-400 font-bold mb-1 block">
              TICKET #{String(ticketInfo.ticketNumber).padStart(2, '0')} • GOLDEN TICKET
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">Already Claimed!</h2>
            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
              You have already cracked and claimed this Golden Ticket! Check the big screen to see your standing.
            </p>

            <Link
              href={ticketInfo.sessionId ? `/play/${ticketInfo.sessionId}` : '/play'}
              className="w-full py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold clip-slanted rounded-none flex items-center justify-center gap-2 transition-colors text-sm"
            >
              <span>Return to Arena</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : result ? (
          /* Final Claim Result Screen */
          <div className="bg-navy-900/95 border-2 border-cyan-500/40 clip-slanted rounded-none p-6 sm:p-8 text-center backdrop-blur-md shadow-2xl animate-in zoom-in-95 duration-500">
            {result.isCorrect ? (
              <div className="w-20 h-20 bg-yellow-500/20 border-2 border-yellow-500/50 rounded-full flex items-center justify-center mx-auto mb-5 shadow-2xl shadow-yellow-500/20">
                <Trophy className="w-10 h-10 text-yellow-400 animate-bounce" />
              </div>
            ) : (
              <div className="w-20 h-20 bg-red-500/20 border-2 border-red-500/50 rounded-full flex items-center justify-center mx-auto mb-5 shadow-2xl shadow-red-500/20">
                <XCircle className="w-10 h-10 text-red-400" />
              </div>
            )}

            <span className="text-xs font-mono uppercase tracking-widest text-yellow-400 font-bold mb-1 block">
              TICKET #{String(result.ticketNumber).padStart(2, '0')} • GOLDEN TICKET
            </span>

            <h2 className="text-2xl sm:text-3xl font-black text-white mb-1">
              {result.isCorrect ? 'GOLDEN TICKET SOLVED!' : 'ATTEMPTS EXHAUSTED'}
            </h2>

            <p className="text-slate-300 text-sm mb-5">
              {result.message || (result.isCorrect ? 'Grand bounty unlocked!' : 'Unable to crack the trivia challenge.')}
            </p>

            {/* Points Summary Card */}
            <div className="bg-navy-950 border border-white/10 p-4 sm:p-5 mb-6 clip-slanted rounded-none space-y-3">
              <div className="flex items-center justify-between text-left">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-mono block">Points Earned</span>
                  <span className={`text-3xl sm:text-4xl font-black font-mono ${result.isCorrect ? 'text-yellow-400' : 'text-slate-500'}`}>
                    +{result.pointsEarned}
                  </span>
                </div>
                {result.newScore !== undefined && (
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 uppercase font-mono block">New Score</span>
                    <span className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">
                      {result.newScore} pts
                    </span>
                  </div>
                )}
              </div>
            </div>

            <Link
              href={ticketInfo?.sessionId ? `/play/${ticketInfo.sessionId}` : '/play'}
              className="w-full py-4 bg-cyan-400 hover:bg-cyan-300 text-navy-950 font-black text-base clip-slanted rounded-none flex items-center justify-center gap-2 transition-all shadow-xl shadow-cyan-500/20"
            >
              <span>Back to Arena</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : ticketInfo?.isWinning && ticketInfo?.hasQuestion ? (
          /* === ACTIVE WINNING TRIVIA CHALLENGE === */
          <div className="bg-navy-900/95 border-2 border-yellow-500/40 clip-slanted rounded-none p-5 sm:p-7 backdrop-blur-md shadow-2xl animate-in fade-in duration-300">
            {/* Header info */}
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5" /> GOLDEN TICKET #{String(ticketInfo.ticketNumber).padStart(2, '0')}
                </span>
              </div>
              <div className="text-right font-mono">
                <span className="text-xs text-yellow-400 font-black block">
                  +{liveDecayedPoints} PTS
                </span>
                <span className="text-[10px] text-slate-500 uppercase">Degrading Live</span>
              </div>
            </div>

            {/* Attempts Info Badge */}
            <div className="mb-4 flex items-center justify-between bg-navy-950 border border-white/10 px-3 py-1.5 clip-slanted text-xs font-mono">
              <span className="text-slate-400">Attempts Allowed: <strong className="text-white">{ticketInfo.maxAttempts ?? 1}</strong></span>
              <span className="text-cyan-400 font-bold">Remaining: {ticketInfo.attemptsRemaining ?? 1}</span>
            </div>

            {/* Countdown Progress Bar & Timer */}
            <div className="mb-5">
              <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock className={`w-3.5 h-3.5 ${isUrgent ? 'text-red-400 animate-pulse' : 'text-yellow-400'}`} />
                  Time Remaining
                </span>
                <span className={`font-black text-sm ${isUrgent ? 'text-red-400 animate-pulse font-bold' : 'text-white'}`}>
                  {timeLeft}s
                </span>
              </div>
              <div className="w-full bg-navy-950 h-2 rounded-full overflow-hidden border border-white/10">
                <div
                  className={`h-full transition-all duration-200 ease-linear ${
                    isUrgent ? 'bg-red-500' : 'bg-yellow-400'
                  }`}
                  style={{ width: `${timerPercentage}%` }}
                />
              </div>
            </div>

            {/* Wrong Attempt Warning Banner */}
            {wrongAttemptMessage && (
              <div className="mb-4 bg-amber-500/20 border border-amber-500/40 text-amber-300 p-3 clip-slanted text-xs font-mono flex items-center gap-2 animate-shake">
                <RotateCcw className="w-4 h-4 shrink-0 text-amber-400" />
                <span>{wrongAttemptMessage}</span>
              </div>
            )}

            {/* Question Text */}
            <div className="bg-navy-950/80 border border-white/10 p-4 sm:p-5 mb-5 clip-slanted">
              <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                {ticketInfo.question}
              </h3>
            </div>

            {/* Answer Options Grid */}
            <div className="grid grid-cols-1 gap-3 mb-4">
              {ticketInfo.options?.map((option, idx) => {
                const label = ['A', 'B', 'C', 'D'][idx] || `${idx + 1}`;
                const isSelected = selectedOption === option;

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={submitting}
                    onClick={() => submitClaim(option)}
                    className={`w-full text-left p-3.5 sm:p-4 clip-slanted border transition-all flex items-center gap-3.5 font-medium text-sm sm:text-base group ${
                      isSelected
                        ? 'bg-yellow-500/20 border-yellow-400 text-white'
                        : 'bg-navy-950/90 border-white/15 hover:border-yellow-400/60 hover:bg-yellow-950/20 text-slate-200'
                    } disabled:opacity-60 cursor-pointer`}
                  >
                    <span
                      className={`w-8 h-8 rounded-lg font-mono font-black text-xs flex items-center justify-center shrink-0 border transition-colors ${
                        isSelected
                          ? 'bg-yellow-400 text-navy-950 border-yellow-400'
                          : 'bg-white/5 border-white/20 text-yellow-400 group-hover:border-yellow-400 group-hover:bg-yellow-400/10'
                      }`}
                    >
                      {label}
                    </span>
                    <span className="flex-1 leading-snug">{option}</span>
                  </button>
                );
              })}
            </div>

            {submitting && (
              <div className="text-center py-2 flex items-center justify-center gap-2 text-yellow-400 text-xs font-mono">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying answer...</span>
              </div>
            )}

            <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-slate-500 pt-2 text-center">
              <Zap className="w-3 h-3 text-yellow-400" />
              <span>Faster correct answers earn up to +{basePotential} points! Wrong answers earn 0.</span>
            </div>
          </div>
        ) : null}
      </main>

      <footer className="py-4 text-center text-slate-600 text-[11px] font-mono z-10">
        PULSE MINI • GOLDEN TICKET TRIVIA • NIBM CODEX 2.0
      </footer>

      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-navy-950 to-navy-950 pointer-events-none" />
    </div>
  );
}

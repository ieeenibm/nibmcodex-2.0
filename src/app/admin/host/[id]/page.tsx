'use client';

import { useState, useEffect, useRef } from 'react';
import useSWR from 'swr';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import QRCode from 'qrcode';
import {
  Play,
  ChevronRight,
  Users,
  CheckCircle2,
  ArrowLeft,
  Eye,
  QrCode as QrIcon,
  Flame,
  Clock,
  Sparkles,
  Zap,
} from 'lucide-react';

const ResponseBoard = dynamic(() => import('./ResponseBoard'), { ssr: false });

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch');
  return data;
};

export default function HostView() {
  const { id } = useParams();

  // Poll for overall session state
  const { data: session, mutate: mutateSession } = useSWR(`/api/admin/sessions/${id}`, fetcher, { refreshInterval: 1500 });

  // Poll for live stats (participant count, response count, distributions, leaderboard)
  const { data: liveStats, mutate: mutateLiveStats } = useSWR(`/api/admin/sessions/${id}/live-stats`, fetcher, { refreshInterval: 1000 });

  // Track "show answer" state PER question ID to prevent resets on SWR re-poll
  const [revealedQuestions, setRevealedQuestions] = useState<Set<string>>(new Set());
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [displayHost, setDisplayHost] = useState<string>('nibmcodex.nibmieee.lk/play');

  // Auto-advance configuration
  const [autoAdvance, setAutoAdvance] = useState<boolean>(true);
  const [autoAdvanceSeconds, setAutoAdvanceSeconds] = useState<number | null>(null);
  const [autoAdvanceReason, setAutoAdvanceReason] = useState<'TIME_UP' | 'ALL_ANSWERED' | null>(null);
  const [serverOffset, setServerOffset] = useState<number>(0);
  const [isStarting, setIsStarting] = useState<boolean>(false);
  const [isAdvancing, setIsAdvancing] = useState<boolean>(false);
  const hasAutoAdvancedRef = useRef<string | null>(null);

  // Sync serverOffset from session.serverTime
  useEffect(() => {
    if (session?.serverTime) {
      setServerOffset(Date.now() - new Date(session.serverTime).getTime());
    }
  }, [session?.serverTime]);

  // Generate QR code for instant join
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDisplayHost(`${window.location.host}/play`);
    }

    if (session?.joinCode) {
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://nibmcodex.nibmieee.lk';
      const joinUrl = `${origin}/play?code=${session.joinCode}`;
      QRCode.toDataURL(joinUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#06b6d4', // Cyan-500
          light: '#0a0f1d', // Dark Navy background
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('QR code error', err));
    }
  }, [session?.joinCode]);

  // Host Countdown Timer
  const activeQuestionIndex = session?.questions?.findIndex((q: any) => q.id === session.activeQuestionId) ?? -1;
  const activeQuestion = activeQuestionIndex !== -1 ? session.questions[activeQuestionIndex] : null;
  const showAnswer = activeQuestion ? revealedQuestions.has(activeQuestion.id) : false;
  const isTimed = (activeQuestion?.timeLimit ?? 30) > 0;

  const calculateRemaining = () => {
    if (!activeQuestion || !isTimed || !session?.questionStartedAt || session?.status !== 'ACTIVE') {
      return activeQuestion?.timeLimit ?? 30;
    }
    const start = new Date(session.questionStartedAt).getTime();
    const synchronizedNow = Date.now() - serverOffset;
    const elapsed = Math.max(0, (synchronizedNow - start) / 1000);
    return Math.max(0, (activeQuestion.timeLimit || 30) - elapsed);
  };

  // Reset auto-advance countdown and initialize timer synchronously when active question or status changes
  useEffect(() => {
    setAutoAdvanceSeconds(null);
    setAutoAdvanceReason(null);
    hasAutoAdvancedRef.current = null;
    if (activeQuestion && session?.status === 'ACTIVE') {
      setTimeLeft(Math.ceil(calculateRemaining()));
    } else {
      setTimeLeft(activeQuestion?.timeLimit ?? 30);
    }
  }, [session?.activeQuestionId, session?.status]);

  useEffect(() => {
    if (!activeQuestion || !isTimed || !session?.questionStartedAt || session?.status !== 'ACTIVE') {
      setTimeLeft(activeQuestion?.timeLimit ?? 30);
      return;
    }

    const updateTimer = () => {
      const remaining = calculateRemaining();
      setTimeLeft(Math.ceil(remaining));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 250);

    return () => clearInterval(interval);
  }, [activeQuestion?.id, activeQuestion?.timeLimit, isTimed, session?.questionStartedAt, session?.status, serverOffset]);

  const handleReveal = () => {
    if (activeQuestion) {
      setRevealedQuestions((prev) => new Set([...prev, activeQuestion.id]));
    }
  };

  const handleNext = async () => {
    if (isAdvancing) return;
    setIsAdvancing(true);
    setAutoAdvanceSeconds(null);
    setAutoAdvanceReason(null);
    try {
      const nextIdx = activeQuestionIndex + 1;
      if (nextIdx >= session.questions.length) {
        await fetch(`/api/admin/sessions/${id}/state`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'ENDED' }),
        });
      } else {
        await fetch(`/api/admin/sessions/${id}/state`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ activeQuestionId: session.questions[nextIdx]?.id }),
        });
      }
      await mutateSession();
      await mutateLiveStats();
    } finally {
      setIsAdvancing(false);
    }
  };

  // Trigger auto-advance when timer ends OR when all participants have answered
  useEffect(() => {
    if (!activeQuestion || session?.status !== 'ACTIVE' || !autoAdvance) return;
    if (autoAdvanceSeconds !== null) return; // already in countdown
    if (hasAutoAdvancedRef.current === activeQuestion.id) return; // already triggered for this question

    const totalPlayers = liveStats?.totalParticipants || 0;
    const responseCount = liveStats?.activeQuestionResponsesCount || 0;
    const allAnswered = totalPlayers > 0 && responseCount >= totalPlayers;
    const timeExpired = isTimed && timeLeft <= 0;

    if (!allAnswered && !timeExpired) return;

    // Mark question as triggered so it cannot re-fire
    hasAutoAdvancedRef.current = activeQuestion.id;

    if (allAnswered) {
      setAutoAdvanceReason('ALL_ANSWERED');
      if (session?.mode === 'COMPETITIVE' && activeQuestion.type === 'MCQ') {
        handleReveal();
      }
      setAutoAdvanceSeconds(3); // 3s grace when everyone answered
    } else if (timeExpired) {
      setAutoAdvanceReason('TIME_UP');
      if (session?.mode === 'COMPETITIVE' && activeQuestion.type === 'MCQ') {
        handleReveal();
        setAutoAdvanceSeconds(5);
      } else {
        setAutoAdvanceSeconds(3);
      }
    }
  }, [
    timeLeft,
    isTimed,
    autoAdvance,
    activeQuestion?.id,
    session?.status,
    session?.mode,
    autoAdvanceSeconds,
    liveStats?.totalParticipants,
    liveStats?.activeQuestionResponsesCount,
  ]);

  // Handle countdown tick
  useEffect(() => {
    if (autoAdvanceSeconds === null) return;

    if (autoAdvanceSeconds <= 0) {
      setAutoAdvanceSeconds(null);
      setAutoAdvanceReason(null);
      handleNext();
      return;
    }

    const timer = setTimeout(() => {
      setAutoAdvanceSeconds((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [autoAdvanceSeconds]);

  if (!session) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center text-cyan-400 font-bold gap-3">
        <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
        <span className="tracking-widest font-mono text-sm">INITIALIZING PULSE ARENA...</span>
      </div>
    );
  }

  const handleStart = async () => {
    if (isStarting || !session?.questions?.length) return;
    setIsStarting(true);
    try {
      await fetch(`/api/admin/sessions/${id}/state`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ACTIVE', activeQuestionId: session.questions[0]?.id }),
      });
      await mutateSession();
      await mutateLiveStats();
    } finally {
      setIsStarting(false);
    }
  };

  const timeProgress = activeQuestion?.timeLimit ? (timeLeft / activeQuestion.timeLimit) * 100 : 100;
  const handleEndEarly = async () => {
    if (!confirm("Are you sure you want to end this session early?")) return;
    await fetch(`/api/admin/sessions/${id}/state`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "ENDED" }),
    });
    await mutateSession();
    await mutateLiveStats();
  };

  const handleRestart = async () => {
    if (!confirm("Are you sure you want to restart this session? ALL participant data and scores will be permanently deleted.")) return;
    await fetch(`/api/admin/sessions/${id}/reset`, {
      method: "POST",
    });
    await mutateSession();
    await mutateLiveStats();
  };


  return (
    <div className="min-h-screen bg-navy-950 flex flex-col relative overflow-hidden select-none">
      {/* Header */}
      <header className="p-6 flex justify-between items-center z-10 border-b border-white/10 bg-navy-900/60 backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            Pulse Mini <span className="text-xs font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-md">HOST ARENA</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1 flex items-center gap-2">
            {session.name}
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/10 text-slate-300">
              {session.mode}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-right">
            <p className="text-[11px] text-slate-400 uppercase tracking-widest font-mono font-bold">JOIN AT {displayHost}</p>
            <div className="text-3xl font-black font-mono tracking-[0.25em] text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.6)]">
              {session.joinCode}
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-navy-900/90 px-4 py-2 clip-slanted rounded-none border border-white/10 shadow-lg">
            <Users className="w-5 h-5 text-cyan-400" />
            <span className="text-xl font-black text-white font-mono">{liveStats?.totalParticipants || 0}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-10 p-6 sm:p-10">
        {/* DRAFT STATE / LOBBY WITH QR CODE */}
        {session.status === 'DRAFT' && (
          <div className="m-auto max-w-2xl w-full text-center flex flex-col items-center">
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-bold tracking-wider mb-4">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                LOBBY OPEN FOR PLAYERS
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-2">
                Scan or Enter Code
              </h2>
              <p className="text-slate-400 text-lg">
                Point your phone camera at the QR code to join instantly.
              </p>
            </div>

            {/* QR Code Container */}
            {qrDataUrl && (
              <div className="bg-navy-900 p-5 clip-slanted rounded-none border-2 border-cyan-500/30 shadow-2xl shadow-cyan-500/10 mb-8 relative group">
                <img
                  src={qrDataUrl}
                  alt="Join QR Code"
                  className="w-56 h-56 sm:w-64 sm:h-64 clip-slanted rounded-none mx-auto"
                />
                <div className="mt-3 flex items-center justify-center gap-2 text-cyan-400 font-mono font-bold text-xs">
                  <QrIcon className="w-4 h-4" />
                  <span>{displayHost}</span>
                </div>
              </div>
            )}

            <button
              onClick={handleStart}
              disabled={isStarting || session.questions.length === 0}
              className="px-10 py-5 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 text-navy-950 font-black text-2xl clip-slanted rounded-none flex items-center gap-3 shadow-2xl shadow-cyan-500/30 transition-all transform hover:scale-105 active:scale-95"
            >
              <Play className="w-7 h-7 fill-current" /> {isStarting ? 'Starting Arena...' : 'Start Arena'}
            </button>
            {session.questions.length === 0 && (
              <p className="text-slate-500 text-sm mt-4">Add at least one question in session editor to start</p>
            )}
          </div>
        )}

        {/* ACTIVE STATE */}
        {session.status === 'ACTIVE' && activeQuestion && (
          <div className="flex flex-col h-full justify-between">
            {/* Top Question HUD with Countdown Bar */}
            <div className="text-center mb-4">
              <div className="flex items-center justify-between max-w-4xl mx-auto mb-3">
                <span className="text-cyan-400 font-bold tracking-widest uppercase text-xs font-mono">
                  QUESTION {activeQuestionIndex + 1} OF {session.questions.length} • {activeQuestion.type}
                </span>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setAutoAdvance(!autoAdvance)}
                    className={`flex items-center gap-1.5 px-3 py-1 clip-slanted rounded-none border font-mono text-xs font-bold transition-colors ${
                      autoAdvance
                        ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                        : 'bg-white/5 border-white/10 text-slate-500 hover:text-slate-400'
                    }`}
                    title={autoAdvance ? 'Auto-Advance is ON (timer end automatically advances)' : 'Auto-Advance is OFF (manual control)'}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Auto-Advance {autoAdvance ? 'ON' : 'OFF'}</span>
                  </button>

                  {isTimed ? (
                    <div className="flex items-center gap-2 bg-navy-900 px-3 py-1 clip-slanted rounded-none border border-white/10 font-mono text-sm font-bold text-cyan-400">
                      <Clock className="w-4 h-4" />
                      <span>{timeLeft}s</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 bg-navy-900 px-3 py-1 clip-slanted rounded-none border border-white/10 font-mono text-xs font-bold text-slate-400">
                      <span>♾️ Untimed</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Auto-Advance Countdown Banner */}
              {autoAdvanceSeconds !== null && (
                <div className="max-w-md mx-auto mb-4 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 px-4 py-2 clip-slanted rounded-none flex items-center justify-between font-mono text-xs font-bold animate-pulse shadow-lg">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>
                      {autoAdvanceReason === 'ALL_ANSWERED'
                        ? 'All players answered! Moving to next round in'
                        : session?.mode === 'COMPETITIVE' && activeQuestion.type === 'MCQ'
                        ? 'Next question in'
                        : 'Moving to next round in'}{' '}
                      {autoAdvanceSeconds}s...
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setAutoAdvanceSeconds(null);
                      setAutoAdvanceReason(null);
                      setAutoAdvance(false);
                    }}
                    className="px-2.5 py-0.5 bg-white/10 hover:bg-white/20 text-white rounded text-[10px] font-sans font-medium"
                  >
                    Pause
                  </button>
                </div>
              )}

              {/* Progress timer bar - only if isTimed */}
              {isTimed && (
                <div className="max-w-4xl mx-auto h-2 bg-navy-900 rounded-full overflow-hidden border border-white/5 mb-6">
                  <div
                    className={`h-full transition-all duration-300 ease-linear ${
                      timeLeft <= 5 ? 'bg-red-500' : timeLeft <= 10 ? 'bg-yellow-400' : 'bg-cyan-400'
                    }`}
                    style={{ width: `${Math.max(0, timeProgress)}%` }}
                  />
                </div>
              )}

              <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight drop-shadow-lg max-w-4xl mx-auto">
                {activeQuestion.text}
              </h2>

              <div className="inline-flex items-center gap-2 bg-navy-900/90 px-6 py-2 rounded-full border border-white/15 mt-4 shadow-lg">
                <span className="text-cyan-400 font-black font-mono text-lg">{liveStats?.activeQuestionResponsesCount || 0}</span>
                <span className="text-slate-400 text-sm">of</span>
                <span className="text-white font-bold font-mono text-lg">{liveStats?.totalParticipants || 0}</span>
                <span className="text-slate-400 text-sm">Submissions</span>
              </div>
            </div>

            {/* Arena Canvas / Visualizers */}
            <div className="flex-1 clip-slanted rounded-none overflow-hidden relative flex flex-col my-4">
              {/* POLL TYPE: Always render live distribution bars */}
              {activeQuestion.type === 'POLL' && (
                <div className="flex-1 clip-slanted rounded-none overflow-hidden border-2 border-white/10 relative bg-navy-900/30 backdrop-blur-sm h-full w-full flex flex-col items-center justify-center p-8 sm:p-12">
                  <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {activeQuestion.options?.map((opt: string, i: number) => {
                      const count = liveStats?.mcqDistribution?.[opt] || 0;
                      const maxCount = Math.max(1, liveStats?.activeQuestionResponsesCount || 1);
                      const heightPercentage = Math.max(8, (count / maxCount) * 100);

                      return (
                        <div key={i} className="flex flex-col gap-2">
                          <div className="w-full bg-navy-950 border border-white/10 clip-slanted rounded-none p-6 text-center shadow-xl relative overflow-hidden">
                            <div
                              className="absolute bottom-0 left-0 right-0 bg-cyan-500/25 transition-all duration-700 ease-out z-0"
                              style={{ height: `${heightPercentage}%` }}
                            />
                            <div className="relative z-10">
                              <h3 className="text-xl font-bold text-white mb-2">{opt}</h3>
                              <p className="text-4xl font-black text-cyan-400 font-mono">{count}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TEXT TYPE: Always render floating physics ResponseBoard */}
              {activeQuestion.type === 'TEXT' && (
                <div className="flex-1 clip-slanted rounded-none overflow-hidden border-2 border-white/10 relative bg-navy-900/30 backdrop-blur-sm">
                  <ResponseBoard key={activeQuestion.id} questionId={activeQuestion.id} />
                </div>
              )}

              {/* MCQ TYPE */}
              {activeQuestion.type === 'MCQ' && (
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                  {showAnswer ? (
                    <div className="w-full max-w-4xl flex flex-col items-center gap-6">
                      <div className="bg-green-500/10 border-2 border-green-500/40 p-8 clip-slanted rounded-none text-center w-full backdrop-blur-md shadow-2xl animate-in zoom-in-95 duration-300">
                        <p className="text-green-400 font-bold uppercase tracking-widest mb-2 text-xs font-mono">
                          OFFICIAL CORRECT ANSWER
                        </p>
                        <p className="text-3xl sm:text-5xl font-black text-white mb-3">
                          {activeQuestion.correctAnswer || 'All Answers Recorded'}
                        </p>
                        <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 px-4 py-1 rounded-full text-green-300 font-mono text-sm font-bold">
                          <Sparkles className="w-4 h-4" />
                          {liveStats?.correctCount || 0} / {liveStats?.activeQuestionResponsesCount || 0} Players Scored Points
                        </div>
                      </div>

                      {/* Option distribution breakdown */}
                      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {activeQuestion.options?.map((opt: string, i: number) => {
                          const count = liveStats?.mcqDistribution?.[opt] || 0;
                          const isCorrect = opt === activeQuestion.correctAnswer;
                          const maxCount = Math.max(1, liveStats?.activeQuestionResponsesCount || 1);
                          const pct = Math.round((count / maxCount) * 100);

                          return (
                            <div
                              key={i}
                              className={`p-4 clip-slanted rounded-none border flex items-center justify-between transition-all ${
                                isCorrect
                                  ? 'bg-green-500/20 border-green-500/50 text-green-200'
                                  : 'bg-navy-900/60 border-white/10 text-slate-300'
                              }`}
                            >
                              <div className="flex items-center gap-2 font-bold text-base">
                                <span>{opt}</span>
                                {isCorrect && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                              </div>
                              <span className="font-mono font-bold text-lg">
                                {count} <span className="text-xs text-slate-400 font-normal">({pct}%)</span>
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-64 h-64 flex items-center justify-center">
                      <div className="w-64 h-64 border-8 border-cyan-500/15 border-t-cyan-400 rounded-full animate-spin" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                        <span className="text-4xl font-black font-mono text-cyan-400 block mb-1">
                          {liveStats?.activeQuestionResponsesCount || 0}
                        </span>
                        <span className="text-slate-400 text-xs uppercase tracking-widest font-mono font-bold">RESPONSES</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Controls */}
            <div className="flex justify-between items-center px-4 pt-2">
              <div className="flex gap-3">
                {activeQuestion.type === 'MCQ' && !showAnswer && (
                  <button
                    onClick={handleReveal}
                    className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold clip-slanted rounded-none flex items-center gap-2.5 transition-all border border-white/10 text-base"
                  >
                    <Eye className="w-5 h-5" /> Reveal Answer
                  </button>
                )}
                <button
                  onClick={handleEndEarly}
                  className="px-6 py-3.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold clip-slanted rounded-none flex items-center transition-all border border-red-500/30 text-sm"
                >
                  End Early
                </button>
              </div>
              <button
                onClick={handleNext}
                disabled={isAdvancing}
                className="px-8 py-3.5 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-navy-950 font-black clip-slanted rounded-none flex items-center gap-2.5 transition-all shadow-xl shadow-cyan-500/20 text-base"
              >
                {activeQuestionIndex + 1 === session.questions.length ? 'Finish Arena' : 'Next Question'}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* ENDED STATE / FINAL LEADERBOARD */}
        {session.status === 'ENDED' && (
          <div className="max-w-4xl w-full mx-auto flex flex-col h-full justify-between py-6">
            <div className="text-center mb-8">
              <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-2">Arena Completed!</h2>
              <p className="text-slate-400 text-base">
                {session.mode === 'COMPETITIVE' 
                  ? 'Here are the final standings for this session.' 
                  : 'Thank you for hosting this collaborative session!'}
              </p>
            </div>

            {session.mode === 'COMPETITIVE' ? (
              <div className="bg-navy-900/90 border border-white/10 clip-slanted rounded-none p-6 sm:p-8 flex-1 overflow-y-auto backdrop-blur-md shadow-2xl max-h-[550px]">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center justify-center gap-2 font-mono">
                  🏆 TOP ARENA LEADERBOARD
                </h3>
                <div className="space-y-3">
                  {liveStats?.leaderboard?.map((p: any, i: number) => (
                    <div
                      key={p.id}
                      className={`flex items-center gap-4 sm:gap-6 p-4 clip-slanted rounded-none border transition-all ${
                        i === 0
                          ? 'bg-yellow-500/10 border-yellow-500/40 shadow-lg shadow-yellow-500/5'
                          : 'bg-white/5 border-white/5'
                      }`}
                    >
                      <div
                        className={`w-12 h-12 clip-slanted rounded-none flex items-center justify-center font-black text-xl shrink-0 font-mono shadow-inner ${
                          i === 0
                            ? 'bg-yellow-500 text-navy-950'
                            : i === 1
                            ? 'bg-slate-300 text-navy-950'
                            : i === 2
                            ? 'bg-amber-700 text-white'
                            : 'bg-navy-950 text-slate-400 border border-white/10'
                        }`}
                      >
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                          {p.name}
                          {i === 0 && <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-md font-mono">WINNER</span>}
                        </h4>
                        {p.streak > 1 && (
                          <p className="text-xs text-orange-400 font-bold flex items-center gap-1 mt-0.5">
                            <Flame className="w-3.5 h-3.5 fill-orange-400" />
                            {p.streak} Consecutive Correct
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">{p.score}</span>
                        <span className="text-slate-500 text-xs block font-mono">pts</span>
                      </div>
                    </div>
                  ))}
                  {(!liveStats?.leaderboard || liveStats.leaderboard.length === 0) && (
                    <div className="text-center py-12 text-slate-500">No participants recorded.</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-16 bg-navy-900/90 border border-white/10 clip-slanted rounded-none backdrop-blur-md">
                <p className="text-3xl font-bold text-white mb-2 font-mono">
                  {liveStats?.totalParticipants || 0} TOTAL PARTICIPANTS
                </p>
                <p className="text-slate-400">Collaborative non-competitive session ended.</p>
              </div>
            )}

                        <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/admin/dashboard"
                className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold clip-slanted rounded-none flex items-center gap-2 transition-colors border border-white/10"
              >
                <ArrowLeft className="w-5 h-5" /> Return to Host Dashboard
              </Link>
              <button
                onClick={handleRestart}
                className="px-8 py-3.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 font-bold clip-slanted rounded-none flex items-center gap-2 transition-colors border border-cyan-500/30"
              >
                Restart Session
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Decorative Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-navy-950 to-navy-950 pointer-events-none" />
    </div>
  );
}

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import useSWR from 'swr';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import QRCode from 'qrcode';
import * as Ably from 'ably';
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
  Trophy,
  XCircle,
  Crown,
  TrendingUp,
} from 'lucide-react';

const ResponseBoard = dynamic(() => import('./ResponseBoard'), { ssr: false });

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch');
  return data;
};

type GamePhase = 'lobby' | 'get-ready' | 'question' | 'reveal' | 'leaderboard' | 'ended';

export default function HostView() {
  const { id } = useParams();

  // Poll for overall session state (reduced to 5s as Ably handles real-time)
  const { data: session, mutate: mutateSession } = useSWR(`/api/admin/sessions/${id}`, fetcher, { refreshInterval: 5000 });

  // Poll for live stats (reduced to 5s fallback, Ably provides instant updates)
  const { data: liveStats, mutate: mutateLiveStats } = useSWR(`/api/admin/sessions/${id}/live-stats`, fetcher, { refreshInterval: 5000 });

  // Real-time stats from Ably (override SWR polling data)
  const [realtimeResponseCount, setRealtimeResponseCount] = useState<number | null>(null);
  const [realtimeCorrectCount, setRealtimeCorrectCount] = useState<number | null>(null);
  const [realtimeDistribution, setRealtimeDistribution] = useState<Record<string, number> | null>(null);
  const [realtimeParticipantCount, setRealtimeParticipantCount] = useState<number | null>(null);

  // Game phase state machine
  const [gamePhase, setGamePhase] = useState<GamePhase>('lobby');
  const [getReadyCountdown, setGetReadyCountdown] = useState<number>(3);

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
  const ablyClientRef = useRef<Ably.Realtime | null>(null);

  // Ably Realtime Connection for Host
  useEffect(() => {
    if (!id) return;

    const startAbly = async () => {
      try {
        const encodedSession = encodeURIComponent(id as string);
        const client = new Ably.Realtime({
          authUrl: `/api/ably/auth?clientId=host-${encodedSession}&sessionId=${encodedSession}&role=host`,
          autoConnect: true,
        });
        ablyClientRef.current = client;

        const channel = client.channels.get(`session:${id}`);

        // Listen for real-time answer submissions
        await channel.subscribe('answer-submitted', (message) => {
          const data = message.data;
          if (data) {
            setRealtimeResponseCount(data.totalResponses);
            setRealtimeCorrectCount(data.correctCount);
            if (data.mcqDistribution) {
              setRealtimeDistribution(data.mcqDistribution);
            }
          }
        });

        // Listen for participant joins
        await channel.subscribe('participant-joined', (message) => {
          const data = message.data;
          if (data?.totalParticipants) {
            setRealtimeParticipantCount(data.totalParticipants);
          }
        });

        // Listen for leaderboard updates
        await channel.subscribe('leaderboard-update', (message) => {
          // Trigger SWR revalidation to get fresh leaderboard
          mutateLiveStats();
        });
      } catch (err) {
        console.error('[Host] Ably connection failed, relying on SWR polling:', err);
      }
    };

    startAbly();

    return () => {
      if (ablyClientRef.current) {
        ablyClientRef.current.close();
        ablyClientRef.current = null;
      }
    };
  }, [id, mutateLiveStats]);

  // Effective counts: prefer realtime Ably data, fall back to SWR polling
  const effectiveResponseCount = realtimeResponseCount ?? liveStats?.activeQuestionResponsesCount ?? 0;
  const effectiveCorrectCount = realtimeCorrectCount ?? liveStats?.correctCount ?? 0;
  const effectiveDistribution = realtimeDistribution ?? liveStats?.mcqDistribution ?? {};
  const effectiveParticipantCount = realtimeParticipantCount ?? liveStats?.totalParticipants ?? 0;

  // Reset realtime counters when active question changes
  useEffect(() => {
    setRealtimeResponseCount(null);
    setRealtimeCorrectCount(null);
    setRealtimeDistribution(null);
  }, [session?.activeQuestionId]);

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

  const calculateRemaining = useCallback(() => {
    if (!activeQuestion || !isTimed || !session?.questionStartedAt || session?.status !== 'ACTIVE') {
      return activeQuestion?.timeLimit ?? 30;
    }
    const start = new Date(session.questionStartedAt).getTime();
    const synchronizedNow = Date.now() - serverOffset;
    const elapsed = Math.max(0, (synchronizedNow - start) / 1000);
    return Math.max(0, (activeQuestion.timeLimit || 30) - elapsed);
  }, [activeQuestion, isTimed, session?.questionStartedAt, session?.status, serverOffset]);

  // Manage game phase based on session status
  useEffect(() => {
    if (session?.status === 'DRAFT') {
      setGamePhase('lobby');
    } else if (session?.status === 'ENDED') {
      setGamePhase('ended');
    }
  }, [session?.status]);

  // Reset auto-advance countdown and initialize timer when active question changes
  useEffect(() => {
    setAutoAdvanceSeconds(null);
    setAutoAdvanceReason(null);
    hasAutoAdvancedRef.current = null;
    if (activeQuestion && session?.status === 'ACTIVE') {
      // Enter "Get Ready" phase for each new question
      setGamePhase('get-ready');
      setGetReadyCountdown(3);
      setTimeLeft(Math.ceil(calculateRemaining()));
    } else {
      setTimeLeft(activeQuestion?.timeLimit ?? 30);
    }
  }, [session?.activeQuestionId, session?.status]);

  // Get Ready countdown
  useEffect(() => {
    if (gamePhase !== 'get-ready') return;

    if (getReadyCountdown <= 0) {
      setGamePhase('question');
      // Broadcast 'question' phase to players
      fetch(`/api/admin/sessions/${id}/state`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phase: 'question' }),
      }).catch(() => {});
      return;
    }

    const timer = setTimeout(() => {
      setGetReadyCountdown(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [gamePhase, getReadyCountdown, id]);

  // Question countdown timer
  useEffect(() => {
    if (gamePhase !== 'question' || !activeQuestion || !isTimed || !session?.questionStartedAt || session?.status !== 'ACTIVE') {
      return;
    }

    const updateTimer = () => {
      const remaining = calculateRemaining();
      setTimeLeft(Math.ceil(remaining));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 250);

    return () => clearInterval(interval);
  }, [gamePhase, activeQuestion?.id, activeQuestion?.timeLimit, isTimed, session?.questionStartedAt, session?.status, serverOffset, calculateRemaining]);

  const handleReveal = useCallback(() => {
    if (activeQuestion) {
      setRevealedQuestions((prev) => new Set([...prev, activeQuestion.id]));
      setGamePhase('reveal');
      // Broadcast reveal phase to players
      fetch(`/api/admin/sessions/${id}/state`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phase: 'reveal' }),
      }).catch(() => {});
    }
  }, [activeQuestion, id]);

  const handleShowLeaderboard = useCallback(() => {
    setGamePhase('leaderboard');
    mutateLiveStats(); // Refresh leaderboard data
    // Broadcast leaderboard phase to players
    fetch(`/api/admin/sessions/${id}/state`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phase: 'leaderboard' }),
    }).catch(() => {});
  }, [id, mutateLiveStats]);

  const handleNext = useCallback(async () => {
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
        setGamePhase('get-ready');
        setGetReadyCountdown(3);
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
  }, [isAdvancing, activeQuestionIndex, session, id, mutateSession, mutateLiveStats]);

  // Trigger auto-advance when timer ends OR when all participants have answered
  useEffect(() => {
    if (gamePhase !== 'question' || !activeQuestion || session?.status !== 'ACTIVE' || !autoAdvance) return;
    if (autoAdvanceSeconds !== null) return; // already in countdown
    if (hasAutoAdvancedRef.current === activeQuestion.id) return; // already triggered for this question

    const totalPlayers = effectiveParticipantCount;
    const responseCount = effectiveResponseCount;
    const allAnswered = totalPlayers > 0 && responseCount >= totalPlayers;
    const timeExpired = isTimed && timeLeft <= 0;

    if (!allAnswered && !timeExpired) return;

    // Mark question as triggered so it cannot re-fire
    hasAutoAdvancedRef.current = activeQuestion.id;

    if (allAnswered) {
      setAutoAdvanceReason('ALL_ANSWERED');
      handleReveal();
      setAutoAdvanceSeconds(3); // 3s grace when everyone answered
    } else if (timeExpired) {
      setAutoAdvanceReason('TIME_UP');
      handleReveal();
      setAutoAdvanceSeconds(5);
    }
  }, [
    gamePhase,
    timeLeft,
    isTimed,
    autoAdvance,
    activeQuestion?.id,
    session?.status,
    autoAdvanceSeconds,
    effectiveParticipantCount,
    effectiveResponseCount,
    handleReveal,
  ]);

  // Handle auto-advance countdown tick
  useEffect(() => {
    if (autoAdvanceSeconds === null) return;

    if (autoAdvanceSeconds <= 0) {
      setAutoAdvanceSeconds(null);
      setAutoAdvanceReason(null);
      // Go to leaderboard before next question
      handleShowLeaderboard();
      // Auto-advance to next question after showing leaderboard for 4s
      setTimeout(() => {
        handleNext();
      }, 4000);
      return;
    }

    const timer = setTimeout(() => {
      setAutoAdvanceSeconds((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [autoAdvanceSeconds, handleShowLeaderboard, handleNext]);

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
      setGamePhase('get-ready');
      setGetReadyCountdown(3);
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
    setGamePhase('lobby');
    setRealtimeResponseCount(null);
    setRealtimeCorrectCount(null);
    setRealtimeDistribution(null);
    setRealtimeParticipantCount(null);
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
          {/* Persistent Join PIN badge */}
          <div className="text-right">
            <p className="text-[11px] text-slate-400 uppercase tracking-widest font-mono font-bold">JOIN AT {displayHost}</p>
            <div className="text-3xl font-black font-mono tracking-[0.25em] text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.6)]">
              {session.joinCode}
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-navy-900/90 px-4 py-2 clip-slanted rounded-none border border-white/10 shadow-lg">
            <Users className="w-5 h-5 text-cyan-400" />
            <span className="text-xl font-black text-white font-mono">{effectiveParticipantCount}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-10 p-6 sm:p-10">
        {/* DRAFT STATE / LOBBY WITH QR CODE */}
        {gamePhase === 'lobby' && session.status === 'DRAFT' && (
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

        {/* GET READY PHASE */}
        {gamePhase === 'get-ready' && activeQuestion && (
          <div className="m-auto text-center animate-in zoom-in-95 duration-500">
            <div className="mb-6">
              <span className="text-cyan-400 font-bold tracking-widest uppercase text-sm font-mono">
                QUESTION {activeQuestionIndex + 1} OF {session.questions.length}
              </span>
            </div>
            <div className="w-40 h-40 mx-auto mb-8 relative">
              <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-2xl animate-pulse" />
              <div className="relative w-40 h-40 bg-navy-900 border-4 border-cyan-400 rounded-full flex items-center justify-center shadow-2xl shadow-cyan-500/30">
                <span className="text-7xl font-black text-cyan-400 font-mono animate-bounce">
                  {getReadyCountdown || 'GO!'}
                </span>
              </div>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-3 tracking-tight">Get Ready!</h2>
            <p className="text-slate-400 text-lg">
              {activeQuestion.type === 'POLL' ? '📊 Live Poll' : activeQuestion.type === 'TEXT' ? '✏️ Open Response' : '🎯 Multiple Choice'}
            </p>
          </div>
        )}

        {/* ACTIVE QUESTION PHASE */}
        {gamePhase === 'question' && session.status === 'ACTIVE' && activeQuestion && (
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
                        ? 'All players answered! Showing results in'
                        : 'Time\'s up! Showing results in'}{' '}
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

              {/* Show MCQ options on host screen during countdown */}
              {activeQuestion.type === 'MCQ' && !showAnswer && (
                <div className="max-w-4xl mx-auto grid grid-cols-2 gap-3 mt-6">
                  {activeQuestion.options?.map((opt: string, i: number) => (
                    <div key={i} className="p-4 bg-navy-900/60 border border-white/10 clip-slanted rounded-none text-white font-bold text-lg text-center">
                      {opt}
                    </div>
                  ))}
                </div>
              )}

              <div className="inline-flex items-center gap-2 bg-navy-900/90 px-6 py-2 rounded-full border border-white/15 mt-4 shadow-lg">
                <span className="text-cyan-400 font-black font-mono text-lg">{effectiveResponseCount}</span>
                <span className="text-slate-400 text-sm">of</span>
                <span className="text-white font-bold font-mono text-lg">{effectiveParticipantCount}</span>
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
                      const count = effectiveDistribution[opt] || 0;
                      const maxCount = Math.max(1, effectiveResponseCount || 1);
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

              {/* MCQ TYPE: Spinner while collecting answers */}
              {activeQuestion.type === 'MCQ' && !showAnswer && (
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                  <div className="relative w-64 h-64 flex items-center justify-center">
                    <div className="w-64 h-64 border-8 border-cyan-500/15 border-t-cyan-400 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                      <span className="text-4xl font-black font-mono text-cyan-400 block mb-1">
                        {effectiveResponseCount}
                      </span>
                      <span className="text-slate-400 text-xs uppercase tracking-widest font-mono font-bold">RESPONSES</span>
                    </div>
                  </div>
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
                onClick={() => {
                  handleReveal();
                  // Short delay then show leaderboard
                  setTimeout(() => handleShowLeaderboard(), 3000);
                }}
                disabled={isAdvancing}
                className="px-8 py-3.5 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-navy-950 font-black clip-slanted rounded-none flex items-center gap-2.5 transition-all shadow-xl shadow-cyan-500/20 text-base"
              >
                {showAnswer ? 'Show Leaderboard' : 'Reveal & Continue'}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* REVEAL PHASE */}
        {gamePhase === 'reveal' && activeQuestion && (
          <div className="m-auto max-w-4xl w-full animate-in zoom-in-95 duration-300">
            <div className="text-center mb-8">
              <span className="text-cyan-400 font-bold tracking-widest uppercase text-xs font-mono">
                QUESTION {activeQuestionIndex + 1} OF {session.questions.length}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">{activeQuestion.text}</h2>
            </div>

            {activeQuestion.type === 'MCQ' && (
              <div className="w-full flex flex-col items-center gap-6">
                <div className="bg-green-500/10 border-2 border-green-500/40 p-8 clip-slanted rounded-none text-center w-full backdrop-blur-md shadow-2xl">
                  <p className="text-green-400 font-bold uppercase tracking-widest mb-2 text-xs font-mono">
                    CORRECT ANSWER
                  </p>
                  <p className="text-3xl sm:text-5xl font-black text-white mb-3">
                    {activeQuestion.correctAnswer || 'All Answers Recorded'}
                  </p>
                  <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 px-4 py-1 rounded-full text-green-300 font-mono text-sm font-bold">
                    <Sparkles className="w-4 h-4" />
                    {effectiveCorrectCount} / {effectiveResponseCount} Players Scored Points
                  </div>
                </div>

                {/* Option distribution breakdown */}
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeQuestion.options?.map((opt: string, i: number) => {
                    const count = effectiveDistribution[opt] || 0;
                    const isCorrect = opt === activeQuestion.correctAnswer;
                    const maxCount = Math.max(1, effectiveResponseCount || 1);
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
            )}

            {activeQuestion.type === 'POLL' && (
              <div className="w-full max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
                {activeQuestion.options?.map((opt: string, i: number) => {
                  const count = effectiveDistribution[opt] || 0;
                  const maxCount = Math.max(1, effectiveResponseCount || 1);
                  const heightPercentage = Math.max(8, (count / maxCount) * 100);
                  return (
                    <div key={i} className="w-full bg-navy-950 border border-white/10 clip-slanted rounded-none p-6 text-center shadow-xl relative overflow-hidden">
                      <div className="absolute bottom-0 left-0 right-0 bg-cyan-500/25 transition-all duration-700 ease-out z-0" style={{ height: `${heightPercentage}%` }} />
                      <div className="relative z-10">
                        <h3 className="text-xl font-bold text-white mb-2">{opt}</h3>
                        <p className="text-4xl font-black text-cyan-400 font-mono">{count}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeQuestion.type === 'TEXT' && (
              <div className="text-center py-8">
                <p className="text-2xl font-bold text-white mb-2">{effectiveResponseCount} Responses Collected</p>
                <p className="text-slate-400">Open-ended responses have been recorded.</p>
              </div>
            )}

            {/* Controls */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={handleShowLeaderboard}
                className="px-8 py-3.5 bg-cyan-400 hover:bg-cyan-300 text-navy-950 font-black clip-slanted rounded-none flex items-center gap-2.5 transition-all shadow-xl shadow-cyan-500/20 text-base"
              >
                <Trophy className="w-5 h-5" /> Show Leaderboard
              </button>
            </div>
          </div>
        )}

        {/* INTERMEDIATE LEADERBOARD PHASE */}
        {gamePhase === 'leaderboard' && session.status === 'ACTIVE' && (
          <div className="max-w-3xl w-full mx-auto animate-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
              <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-1">Leaderboard</h2>
              <p className="text-slate-400 text-sm">After Question {activeQuestionIndex + 1} of {session.questions.length}</p>
            </div>

            <div className="bg-navy-900/90 border border-white/10 clip-slanted rounded-none p-6 backdrop-blur-md shadow-2xl">
              <div className="space-y-3">
                {liveStats?.leaderboard?.slice(0, 5).map((p: any, i: number) => (
                  <div
                    key={p.id}
                    className={`flex items-center gap-4 p-4 clip-slanted rounded-none border transition-all animate-in slide-in-from-left duration-300 ${
                      i === 0
                        ? 'bg-yellow-500/10 border-yellow-500/40 shadow-lg shadow-yellow-500/5'
                        : 'bg-white/5 border-white/5'
                    }`}
                    style={{ animationDelay: `${i * 150}ms` }}
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
                      <h4 className="text-lg font-bold text-white flex items-center gap-2">
                        {p.name}
                        {i === 0 && <Crown className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
                      </h4>
                      {p.streak > 1 && (
                        <p className="text-xs text-orange-400 font-bold flex items-center gap-1 mt-0.5">
                          <Flame className="w-3.5 h-3.5 fill-orange-400" />
                          {p.streak} streak
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-cyan-400 font-mono">{p.score}</span>
                      <span className="text-slate-500 text-xs block font-mono">pts</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={handleNext}
                disabled={isAdvancing}
                className="px-10 py-4 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-navy-950 font-black text-lg clip-slanted rounded-none flex items-center gap-3 shadow-2xl shadow-cyan-500/30 transition-all transform hover:scale-105 active:scale-95"
              >
                {activeQuestionIndex + 1 === session.questions.length ? 'Finish Arena' : 'Next Question'}
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        {/* ENDED STATE / FINAL LEADERBOARD */}
        {(gamePhase === 'ended' || session.status === 'ENDED') && (
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
                  {effectiveParticipantCount} TOTAL PARTICIPANTS
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

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import useSWR from 'swr';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import QRCode from 'qrcode';
import * as Ably from 'ably';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  ChevronRight,
  Users,
  CheckCircle2,
  ArrowLeft,
  QrCode as QrIcon,
  Flame,
  Clock,
  Sparkles,
  Zap,
  Trophy,
  Crown,
  TrendingUp,
  RotateCcw,
} from 'lucide-react';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { useToast } from '@/components/ui/Toast';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch');
  return data;
};

type GamePhase = 'lobby' | 'question' | 'reveal' | 'ended';

const OPTION_COLORS = [
  { bg: 'bg-red-600/20', border: 'border-red-500/50', text: 'text-red-300', tagBg: 'bg-red-500', label: 'A' },
  { bg: 'bg-blue-600/20', border: 'border-blue-500/50', text: 'text-blue-300', tagBg: 'bg-blue-500', label: 'B' },
  { bg: 'bg-yellow-600/20', border: 'border-yellow-500/50', text: 'text-yellow-300', tagBg: 'bg-yellow-500', label: 'C' },
  { bg: 'bg-emerald-600/20', border: 'border-emerald-500/50', text: 'text-emerald-300', tagBg: 'bg-emerald-500', label: 'D' },
];

export default function HostView() {
  const { id } = useParams();
  const { toast } = useToast();

  // Passive reconciliation polling
  const { data: session, mutate: mutateSession } = useSWR(`/api/admin/sessions/${id}`, fetcher, { refreshInterval: 5000 });
  const { data: liveStats, mutate: mutateLiveStats } = useSWR(`/api/admin/sessions/${id}/live-stats`, fetcher, { refreshInterval: 4000 });

  // Real-time state from Ably
  const [realtimeResponseCount, setRealtimeResponseCount] = useState<number | null>(null);
  const [realtimeCorrectCount, setRealtimeCorrectCount] = useState<number | null>(null);
  const [realtimeDistribution, setRealtimeDistribution] = useState<Record<string, number> | null>(null);
  const [realtimeParticipantCount, setRealtimeParticipantCount] = useState<number | null>(null);
  const [realtimeLeaderboard, setRealtimeLeaderboard] = useState<any[] | null>(null);

  // Game phase
  const [gamePhase, setGamePhase] = useState<GamePhase>('lobby');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [displayHost, setDisplayHost] = useState<string>('nibmcodex.nibmieee.lk/play');

  // Auto-advance
  const [autoAdvance, setAutoAdvance] = useState<boolean>(true);
  const [revealCountdown, setRevealCountdown] = useState<number | null>(null);
  const [serverOffset, setServerOffset] = useState<number>(0);
  const [isStarting, setIsStarting] = useState<boolean>(false);
  const [isAdvancing, setIsAdvancing] = useState<boolean>(false);
  const hasTriggeredAdvanceRef = useRef<string | null>(null);
  const ablyClientRef = useRef<Ably.Realtime | null>(null);

  // Modals & loading states
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [showEndEarlyModal, setShowEndEarlyModal] = useState<boolean>(false);
  const [isEndingEarly, setIsEndingEarly] = useState<boolean>(false);

  const confirmResetAndPlayAgain = async () => {
    setIsResetting(true);
    try {
      const res = await fetch(`/api/admin/sessions/${id}/reset`, { method: 'POST' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to reset session');
      }
      await mutateSession();
      await mutateLiveStats();
      setGamePhase('lobby');
      setRealtimeResponseCount(0);
      setRealtimeCorrectCount(0);
      setRealtimeDistribution(null);
      setRealtimeParticipantCount(0);
      setRealtimeLeaderboard([]);
      setShowResetModal(false);
      toast.success('Arena reset successfully to lobby!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to restart arena');
    } finally {
      setIsResetting(false);
    }
  };

  const gameType = session?.gameType || 'QUIZ';

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

        // Live answer submissions: update count, distribution, and trigger leaderboard re-rank
        await channel.subscribe('answer-submitted', (message) => {
          const data = message.data;
          if (data) {
            setRealtimeResponseCount(data.totalResponses);
            setRealtimeCorrectCount(data.correctCount);
            if (data.mcqDistribution) {
              setRealtimeDistribution(data.mcqDistribution);
            }
          }
          mutateLiveStats();
        });

        // Attendee joined (supplementary — presence is primary for live count)
        await channel.subscribe('participant-joined', (message) => {
          const data = message.data;
          if (data?.totalParticipants) {
            setRealtimeParticipantCount(data.totalParticipants);
          }
          mutateLiveStats();
        });

        // Live Leaderboard rank updates
        await channel.subscribe('leaderboard-update', () => {
          mutateLiveStats();
        });

        // Ably Presence: track live participant count.
        // Players enter presence on connect; Ably auto-removes on disconnect/tab close.
        // This solves "user count doesn't decrease on exit".
        const updatePresenceCount = async () => {
          try {
            const members = await channel.presence.get();
            // Exclude the host's own presence and deduplicate by clientId
            const uniqueParticipants = new Set(
              members
                .map(m => m.clientId)
                .filter(cid => cid && !cid.startsWith('host-'))
            );
            setRealtimeParticipantCount(uniqueParticipants.size);
          } catch (err) {
            console.warn('[Host] Presence count failed:', err);
          }
        };
        await channel.presence.subscribe(updatePresenceCount);
        updatePresenceCount(); // Fetch initial count
      } catch (err) {
        console.error('[Host] Ably connection failed, falling back to polling:', err);
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

  // Sync serverOffset from session.serverTime
  useEffect(() => {
    if (session?.serverTime) {
      setServerOffset(Date.now() - new Date(session.serverTime).getTime());
    }
  }, [session?.serverTime]);

  // Sync leaderboard from SWR — FROZEN during active question phase.
  // Scores are written to DB immediately on submit, but showing live
  // re-ranking during a question leaks competitive information.
  // The leaderboard only updates during reveal, lobby, or ended phases.
  useEffect(() => {
    if (liveStats?.leaderboard) {
      if (gamePhase !== 'question' || !realtimeLeaderboard) {
        setRealtimeLeaderboard(liveStats.leaderboard);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveStats?.leaderboard, gamePhase]);

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
          light: '#0a0f1d', // Dark Navy
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('QR code error', err));
    }
  }, [session?.joinCode]);

  const activeQuestionIndex = session?.questions?.findIndex((q: any) => q.id === session.activeQuestionId) ?? -1;
  const activeQuestion = activeQuestionIndex !== -1 ? session.questions[activeQuestionIndex] : null;
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
    } else if (session?.status === 'ACTIVE') {
      setGamePhase('question');
    }
  }, [session?.status]);

  // Reset counters & flags on activeQuestion change
  useEffect(() => {
    setRevealCountdown(null);
    hasTriggeredAdvanceRef.current = null;
    setRealtimeResponseCount(null);
    setRealtimeCorrectCount(null);
    setRealtimeDistribution(null);

    if (activeQuestion && session?.status === 'ACTIVE') {
      setGamePhase('question');
      setTimeLeft(Math.ceil(calculateRemaining()));
    }
  }, [session?.activeQuestionId, session?.status, calculateRemaining, activeQuestion]);

  // Question countdown interval
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
  }, [gamePhase, activeQuestion?.id, activeQuestion?.timeLimit, isTimed, session?.questionStartedAt, session?.status, calculateRemaining]);

  const effectiveResponseCount = realtimeResponseCount ?? liveStats?.activeQuestionResponsesCount ?? 0;
  const effectiveParticipantCount = realtimeParticipantCount ?? liveStats?.totalParticipants ?? 0;
  const effectiveDistribution = realtimeDistribution ?? liveStats?.mcqDistribution ?? {};
  const currentLeaderboard = realtimeLeaderboard || liveStats?.leaderboard || [];

  const handleAdvanceNext = useCallback(async () => {
    if (isAdvancing) return;
    setIsAdvancing(true);
    setRevealCountdown(null);

    try {
      const nextIdx = activeQuestionIndex + 1;
      if (nextIdx >= session.questions.length) {
        // Last question finished: End arena
        await fetch(`/api/admin/sessions/${id}/state`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'ENDED' }),
        });
      } else {
        // Transition to next question
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

  // Auto-advance detector: timer expired or everyone answered
  useEffect(() => {
    if (gamePhase !== 'question' || !activeQuestion || session?.status !== 'ACTIVE' || !autoAdvance) return;
    if (revealCountdown !== null) return; // already counting down reveal
    if (hasTriggeredAdvanceRef.current === activeQuestion.id) return;

    const totalPlayers = effectiveParticipantCount;
    const responseCount = effectiveResponseCount;
    const allAnswered = totalPlayers > 0 && responseCount >= totalPlayers;
    const timeExpired = isTimed && timeLeft <= 0;

    if (!allAnswered && !timeExpired) return;

    hasTriggeredAdvanceRef.current = activeQuestion.id;
    setGamePhase('reveal');

    // Broadcast reveal phase to player devices
    fetch(`/api/admin/sessions/${id}/state`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phase: 'reveal' }),
    }).catch(() => {});

    // 3 seconds reveal countdown, then auto-advance
    setRevealCountdown(3);
  }, [gamePhase, timeLeft, isTimed, autoAdvance, activeQuestion?.id, session?.status, revealCountdown, effectiveParticipantCount, effectiveResponseCount, id]);

  // Reveal countdown tick
  useEffect(() => {
    if (revealCountdown === null) return;

    if (revealCountdown <= 0) {
      setRevealCountdown(null);
      handleAdvanceNext();
      return;
    }

    const timer = setTimeout(() => {
      setRevealCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [revealCountdown, handleAdvanceNext]);

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

  const handleEndEarly = () => {
    setShowEndEarlyModal(true);
  };

  const confirmEndEarly = async () => {
    setIsEndingEarly(true);
    try {
      await fetch(`/api/admin/sessions/${id}/state`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ENDED' }),
      });
      await mutateSession();
      await mutateLiveStats();
      setShowEndEarlyModal(false);
      toast.info('Arena ended.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to end arena');
    } finally {
      setIsEndingEarly(false);
    }
  };

  const timeProgress = activeQuestion?.timeLimit ? (timeLeft / activeQuestion.timeLimit) * 100 : 100;

  if (!session) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center text-cyan-400 font-bold gap-3">
        <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
        <span className="tracking-widest font-mono text-sm">INITIALIZING PULSE ARENA...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950 text-white flex flex-col relative overflow-hidden select-none">
      {/* Top Universal HUD */}
      <header className="px-6 py-4 flex justify-between items-center z-10 border-b border-white/10 bg-navy-900/70 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard"
            className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 clip-slanted rounded-none text-slate-300 transition-colors"
            title="Back to dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              Pulse Mini{' '}
              <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-md">
                {gameType === 'AI_VS_HUMAN' ? 'AI VS HUMAN' : 'LIVE ARENA'}
              </span>
            </h1>
            <p className="text-slate-400 text-xs font-mono">{session.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono font-bold">JOIN AT {displayHost}</p>
            <div className="text-2xl font-black font-mono tracking-[0.2em] text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
              {session.joinCode}
            </div>
          </div>

          <div className="flex items-center gap-2 bg-navy-900/90 px-3.5 py-1.5 clip-slanted rounded-none border border-white/10 shadow-lg">
            <Users className="w-4 h-4 text-cyan-400" />
            <span className="text-lg font-black text-white font-mono">{effectiveParticipantCount}</span>
          </div>
        </div>
      </header>

      {/* Main Screen Layout */}
      <main className="flex-1 flex flex-col relative z-10 p-6">
        {/* 1. LOBBY STATE */}
        {gamePhase === 'lobby' && session.status === 'DRAFT' && (
          <div className="m-auto max-w-2xl w-full text-center flex flex-col items-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-bold tracking-wider mb-4">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              LOBBY OPEN FOR PLAYERS
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-2">
              Scan or Enter Code
            </h2>
            <p className="text-slate-400 text-base mb-6">
              Connect your phone to enter the live arena competition!
            </p>

            {qrDataUrl && (
              <div className="bg-navy-900 p-5 clip-slanted rounded-none border-2 border-cyan-500/30 shadow-2xl shadow-cyan-500/10 mb-8">
                <img src={qrDataUrl} alt="Join QR Code" className="w-56 h-56 clip-slanted rounded-none mx-auto" />
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
              <p className="text-slate-500 text-xs mt-4">Add at least one question in session editor to start</p>
            )}
          </div>
        )}

        {/* 2. ACTIVE ARENA: SPLIT VIEW (QUESTION HUD + PERSISTENT LIVE LEADERBOARD) */}
        {(gamePhase === 'question' || gamePhase === 'reveal') && session.status === 'ACTIVE' && activeQuestion && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full flex-1">
            {/* LEFT PANEL (5 Cols): Question Text, Timer, Candidates/Options */}
            <div className="lg:col-span-6 flex flex-col justify-between bg-navy-900/60 border border-white/10 p-6 clip-slanted rounded-none backdrop-blur-md">
              <div>
                {/* Question Progress & Timer Bar */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-cyan-400 font-bold tracking-widest uppercase text-xs font-mono">
                    QUESTION {activeQuestionIndex + 1} OF {session.questions.length}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setAutoAdvance(!autoAdvance)}
                      className={`flex items-center gap-1 px-2.5 py-1 clip-slanted rounded-none border font-mono text-[11px] font-bold ${
                        autoAdvance ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300' : 'bg-white/5 text-slate-500'
                      }`}
                    >
                      <Zap className="w-3 h-3" /> Auto-Advance {autoAdvance ? 'ON' : 'OFF'}
                    </button>

                    {isTimed && (
                      <div
                        className={`flex items-center gap-1.5 px-3 py-1 clip-slanted rounded-none font-mono text-sm font-black border ${
                          timeLeft <= 5 ? 'bg-red-500/20 border-red-500/40 text-red-400 animate-bounce' : 'bg-navy-950 text-cyan-400 border-white/10'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>{timeLeft}s</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                {isTimed && (
                  <div className="w-full h-2 bg-navy-950 rounded-full overflow-hidden border border-white/5 mb-4">
                    <div
                      className={`h-full transition-all duration-300 ease-linear ${
                        timeLeft <= 5 ? 'bg-red-500' : timeLeft <= 10 ? 'bg-yellow-400' : 'bg-cyan-400'
                      }`}
                      style={{ width: `${Math.max(0, timeProgress)}%` }}
                    />
                  </div>
                )}

                {/* Reveal Alert */}
                {gamePhase === 'reveal' && (
                  <div className="bg-green-500/20 border border-green-500/40 text-green-300 px-4 py-2 clip-slanted rounded-none font-mono text-xs font-bold flex items-center justify-between mb-4 animate-pulse">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-green-400" />
                      <span>Round Concluded! Next question in {revealCountdown}s...</span>
                    </div>
                  </div>
                )}

                {/* Question Prompt */}
                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-6">
                  {activeQuestion.text}
                </h2>

                {/* GAME 2: AI VS HUMAN IMAGE CANDIDATES */}
                {(gameType === 'AI_VS_HUMAN' || activeQuestion.type === 'IMAGE_SELECT') && (() => {
                  const rawImgs = activeQuestion.images;
                  const candidateImages: any[] = Array.isArray(rawImgs)
                    ? rawImgs
                    : typeof rawImgs === 'string'
                    ? (() => { try { return JSON.parse(rawImgs); } catch { return []; } })()
                    : [];

                  if (candidateImages.length === 0) return null;

                  return (
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {candidateImages.map((img: any, idx: number) => {
                        const isCorrect = img.isTarget || img.id === activeQuestion.correctAnswer;
                        const showHighlight = gamePhase === 'reveal' && isCorrect;

                        return (
                          <div
                            key={img.id || idx}
                            className={`relative rounded-xl overflow-hidden border-2 transition-all group ${
                              showHighlight
                                ? 'border-green-400 shadow-2xl shadow-green-500/30 scale-[1.02]'
                                : gamePhase === 'reveal'
                                ? 'border-white/10 opacity-40'
                                : 'border-white/15 hover:border-cyan-400'
                            }`}
                          >
                            <img src={img.url} alt={img.label} className="w-full h-44 object-cover" />
                            <div className="absolute top-2 left-2 bg-navy-950/80 px-2.5 py-1 rounded text-xs font-mono font-bold text-white border border-white/20">
                              {OPTION_COLORS[idx]?.label || idx + 1}
                            </div>

                            {showHighlight && (
                              <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center backdrop-blur-[2px]">
                                <span className="bg-green-500 text-navy-950 px-3 py-1 font-mono font-black text-xs rounded-full flex items-center gap-1 shadow-lg">
                                  <CheckCircle2 className="w-4 h-4" /> OFFICIAL TARGET
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}

                {/* GAME 1: CLASSIC MCQ OPTION TILES — Never reveal right answer during question, illuminate on reveal phase (ADM-01) */}
                {gameType !== 'AI_VS_HUMAN' && activeQuestion.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {activeQuestion.options.map((opt: string, idx: number) => {
                      const color = OPTION_COLORS[idx % OPTION_COLORS.length];
                      const count = effectiveDistribution[opt] || 0;
                      const pct = Math.round((count / Math.max(1, effectiveResponseCount)) * 100);
                      const isWinningAnswer = Boolean(
                        activeQuestion.correctAnswer &&
                        opt.trim().toLowerCase() === activeQuestion.correctAnswer.trim().toLowerCase()
                      );
                      const showWinningHighlight = gamePhase === 'reveal' && isWinningAnswer;

                      return (
                        <div
                          key={idx}
                          className={`p-4 border-2 clip-slanted rounded-none flex items-center justify-between transition-all ${
                            showWinningHighlight
                              ? 'bg-emerald-500/20 border-emerald-400 ring-2 ring-emerald-400/80 shadow-lg shadow-emerald-500/20 text-white'
                              : `${color.bg} ${color.border} text-white`
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-7 h-7 rounded flex items-center justify-center font-mono font-black text-sm ${
                              showWinningHighlight ? 'bg-emerald-400 text-navy-950 font-bold' : `${color.tagBg} text-navy-950`
                            }`}>
                              {showWinningHighlight ? '✓' : color.label}
                            </span>
                            <span className="font-bold text-base">{opt}</span>
                            {showWinningHighlight && (
                              <span className="text-[10px] font-mono font-black uppercase tracking-wider bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 px-2 py-0.5 rounded">
                                CORRECT ANSWER
                              </span>
                            )}
                          </div>

                          {gamePhase === 'reveal' && (
                            <span className="font-mono text-xs font-bold text-slate-200 bg-navy-950/70 px-2.5 py-1 rounded border border-white/10">
                              {count} ({pct}%)
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Submissions Badge & Controls */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2 bg-navy-950 px-4 py-2 clip-slanted rounded-none border border-white/10">
                  <span className="text-cyan-400 font-mono font-black text-lg">{effectiveResponseCount}</span>
                  <span className="text-slate-500 text-xs">/</span>
                  <span className="text-white font-mono font-bold text-lg">{effectiveParticipantCount}</span>
                  <span className="text-slate-400 text-xs font-mono ml-1">Answered</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleEndEarly}
                    className="px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-mono font-bold clip-slanted rounded-none"
                  >
                    End Arena
                  </button>
                  <button
                    onClick={handleAdvanceNext}
                    disabled={isAdvancing}
                    className="px-5 py-2 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-navy-950 font-black text-xs font-mono clip-slanted rounded-none flex items-center gap-1.5"
                  >
                    <span>{activeQuestionIndex + 1 === session.questions.length ? 'Finish' : 'Next Question'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT PANEL (7 Cols): PERSISTENT LIVE LEADERBOARD WITH REALTIME POSITION REORDERING */}
            <div className="lg:col-span-6 flex flex-col bg-navy-900/80 border border-white/10 p-6 clip-slanted rounded-none backdrop-blur-md shadow-2xl h-full max-h-[750px] overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <h2 className="text-base font-black text-white font-mono tracking-wider">
                    LIVE ARENA LEADERBOARD
                  </h2>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>REAL-TIME SCORING</span>
                </div>
              </div>

              {/* Animated Leaderboard Cards */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                <AnimatePresence>
                  {currentLeaderboard.map((p: any, idx: number) => {
                    const isFirst = idx === 0;
                    const isSecond = idx === 1;
                    const isThird = idx === 2;

                    return (
                      <motion.div
                        key={p.id}
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                        className={`flex items-center justify-between p-3.5 clip-slanted rounded-none border transition-colors ${
                          isFirst
                            ? 'bg-yellow-500/15 border-yellow-500/50 shadow-lg shadow-yellow-500/5'
                            : isSecond
                            ? 'bg-slate-300/10 border-slate-300/40'
                            : isThird
                            ? 'bg-amber-700/15 border-amber-700/40'
                            : 'bg-navy-950 border-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          {/* Rank Pill */}
                          <div
                            className={`w-8 h-8 clip-slanted rounded-none flex items-center justify-center font-mono font-black text-sm shrink-0 ${
                              isFirst
                                ? 'bg-yellow-500 text-navy-950'
                                : isSecond
                                ? 'bg-slate-300 text-navy-950'
                                : isThird
                                ? 'bg-amber-700 text-white'
                                : 'bg-white/5 text-slate-400'
                            }`}
                          >
                            {idx + 1}
                          </div>

                          <div>
                            <div className="flex items-center gap-2 font-bold text-white text-base">
                              <span>{p.name}</span>
                              {isFirst && <Crown className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
                            </div>

                            {p.streak > 1 && (
                              <span className="text-[11px] text-orange-400 font-mono font-bold flex items-center gap-1">
                                <Flame className="w-3 h-3 fill-orange-400" />
                                {p.streak} in a row
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-2xl font-black font-mono text-cyan-400">{p.score}</span>
                          <span className="text-slate-500 text-[10px] font-mono block">pts</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {currentLeaderboard.length === 0 && (
                  <div className="text-center py-24 text-slate-500 font-mono text-sm">
                    No participants yet. Connect with Game PIN to join!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 3. FINAL ENDED PODIUM CELEBRATION */}
        {gamePhase === 'ended' && (
          <div className="max-w-4xl w-full mx-auto flex flex-col h-full justify-between py-6 animate-in zoom-in-95 duration-500">
            <div className="text-center mb-6">
              <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-3 animate-bounce" />
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-2">Arena Completed!</h2>
              <p className="text-slate-400 font-mono text-sm">Official Final Standings</p>
            </div>

            {/* Podium */}
            <div className="bg-navy-900/90 border border-white/10 p-6 clip-slanted rounded-none backdrop-blur-md shadow-2xl mb-6">
              <div className="grid grid-cols-3 gap-4 text-center items-end pt-4">
                {/* 2nd Place */}
                <div className="bg-white/5 border border-white/10 p-5 clip-slanted rounded-none order-1">
                  <div className="w-12 h-12 bg-slate-300 text-navy-950 font-black text-xl rounded-full flex items-center justify-center mx-auto mb-2 font-mono">
                    2
                  </div>
                  <h3 className="font-bold text-white text-lg truncate">{currentLeaderboard[1]?.name || '---'}</h3>
                  <p className="text-cyan-400 font-mono font-black text-2xl">{currentLeaderboard[1]?.score || 0}</p>
                  <span className="text-xs text-slate-500 font-mono">points</span>
                </div>

                {/* 1st Place Champion */}
                <div className="bg-yellow-500/10 border-2 border-yellow-500/50 p-8 clip-slanted rounded-none order-2 shadow-2xl shadow-yellow-500/20 relative -top-4">
                  <div className="w-16 h-16 bg-yellow-500 text-navy-950 font-black text-2xl rounded-full flex items-center justify-center mx-auto mb-3 font-mono shadow-lg">
                    1
                  </div>
                  <h3 className="font-bold text-white text-2xl truncate flex items-center justify-center gap-1.5">
                    {currentLeaderboard[0]?.name || '---'}
                    <Crown className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  </h3>
                  <p className="text-yellow-400 font-mono font-black text-4xl mt-1">{currentLeaderboard[0]?.score || 0}</p>
                  <span className="text-xs text-yellow-300 font-mono font-bold">CHAMPION</span>
                </div>

                {/* 3rd Place */}
                <div className="bg-white/5 border border-white/10 p-5 clip-slanted rounded-none order-3">
                  <div className="w-12 h-12 bg-amber-700 text-white font-black text-xl rounded-full flex items-center justify-center mx-auto mb-2 font-mono">
                    3
                  </div>
                  <h3 className="font-bold text-white text-lg truncate">{currentLeaderboard[2]?.name || '---'}</h3>
                  <p className="text-cyan-400 font-mono font-black text-2xl">{currentLeaderboard[2]?.score || 0}</p>
                  <span className="text-xs text-slate-500 font-mono">points</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Link
                href="/admin/dashboard"
                className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold clip-slanted rounded-none flex items-center gap-2 font-mono text-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
              </Link>
              <button
                onClick={() => setShowResetModal(true)}
                disabled={isResetting}
                className="px-8 py-3.5 bg-cyan-400 hover:bg-cyan-300 active:bg-cyan-500 disabled:opacity-50 text-navy-950 font-black clip-slanted rounded-none flex items-center gap-2 font-mono text-sm transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                <RotateCcw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
                <span>{isResetting ? 'Resetting Arena...' : 'Reset & Play Again'}</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Custom Confirm Modals */}
      <ConfirmModal
        isOpen={showEndEarlyModal}
        title="End Arena Early?"
        description="Are you sure you want to end this arena early? The current round will conclude and the game will move directly to the final podium standings."
        confirmText="End Arena"
        cancelText="Keep Playing"
        variant="danger"
        isLoading={isEndingEarly}
        onConfirm={confirmEndEarly}
        onCancel={() => setShowEndEarlyModal(false)}
      />

      <ConfirmModal
        isOpen={showResetModal}
        title="Reset & Restart Arena?"
        description="All participant responses, scores, and registrations will be cleared. The arena will return to the lobby in DRAFT mode so attendees can join fresh."
        confirmText="Reset & Restart"
        cancelText="Cancel"
        variant="danger"
        isLoading={isResetting}
        onConfirm={confirmResetAndPlayAgain}
        onCancel={() => setShowResetModal(false)}
      />

      {/* Decorative Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/15 via-navy-950 to-navy-950 pointer-events-none" />
    </div>
  );
}

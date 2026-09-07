'use client';

import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import useSWR from 'swr';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, CheckCircle2, Gamepad2, Flame, Trophy, AlertTriangle, Clock, Zap, XCircle } from 'lucide-react';
import * as Ably from 'ably';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch');
  return data;
};

export default function AttendeeLivePlay() {
  const { id } = useParams();
  const router = useRouter();

  const [participantId, setParticipantId] = useState<string | null>(null);
  const [submittedQuestionId, setSubmittedQuestionId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [answerText, setAnswerText] = useState('');
  const [tabSwitchWarning, setTabSwitchWarning] = useState(false);

  // SSE Stream state with SWR fallback
  const [sseState, setSseState] = useState<any>(null);
  const [sseConnected, setSseConnected] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<any>(null);
  const [questionStartedAt, setQuestionStartedAt] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(30);

  // Game flow phase: get-ready | question | reveal | leaderboard | null
  const [phase, setPhase] = useState<string | null>(null);
  const [getReadyCountdown, setGetReadyCountdown] = useState<number>(3);

  // Participant live stats from feedback
  const [feedback, setFeedback] = useState<{
    hasSubmitted: boolean;
    submittedCount: number;
    isCorrect: boolean;
    scoreEarned: number;
    currentScore: number;
    currentStreak: number;
    rank: number;
  } | null>(null);

  // Refs for connection cleanup
  const ablyClientRef = useRef<Ably.Realtime | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const isAblyActiveRef = useRef(false);

  // SWR Fallback Polling (only active if SSE is disconnected)
  const { data: swrState, error: swrError } = useSWR(
    !sseConnected ? `/api/play/${id}/state${activeQuestion?.id ? `?qId=${activeQuestion.id}` : ''}` : null,
    fetcher,
    { refreshInterval: 1200 }
  );

  // Check login
  useEffect(() => {
    const pId = localStorage.getItem(`pulse_mini_${id}`);
    if (!pId) {
      router.push(`/play?code=${id}`);
    } else {
      setParticipantId(pId);
    }
  }, [id, router]);

  // Tab switch detection (soft warning)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setTabSwitchWarning(true);
        clearTimeout(timer);
        timer = setTimeout(() => setTabSwitchWarning(false), 4000);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearTimeout(timer);
    };
  }, []);

  const [serverOffset, setServerOffset] = useState<number>(0);

  // Close SSE connection helper
  const closeSSE = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  }, []);

  // Realtime Connection (Ably WebSockets with SSE fallback)
  useEffect(() => {
    if (!id) return;

    const fallbackToSSE = () => {
      if (isAblyActiveRef.current || eventSourceRef.current) return;
      try {
        const es = new EventSource(`/api/play/${id}/stream`);
        eventSourceRef.current = es;

        es.onopen = () => {
          setSseConnected(true);
        };

        es.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data && !data.error) {
              setSseState(data);
              setSseConnected(true);
              if (data.serverTime) {
                setServerOffset(Date.now() - new Date(data.serverTime).getTime());
              }
            }
          } catch (e) {
            console.error('SSE JSON parse error', e);
          }
        };

        es.onerror = () => {
          setSseConnected(false);
        };
      } catch {
        setSseConnected(false);
      }
    };

    const startAbly = async () => {
      try {
        const encodedClient = encodeURIComponent(participantId || 'anon');
        const encodedSession = encodeURIComponent(id as string);
        const client = new Ably.Realtime({
          authUrl: `/api/ably/auth?clientId=${encodedClient}&sessionId=${encodedSession}`,
          autoConnect: true,
        });
        ablyClientRef.current = client;

        client.connection.on('connected', () => {
          isAblyActiveRef.current = true;
          setSseConnected(true);
          // Tear down SSE if Ably reconnects (fixes dual connection leak)
          closeSSE();
        });

        client.connection.on('disconnected', () => {
          isAblyActiveRef.current = false;
        });

        client.connection.on('failed', () => {
          if (ablyClientRef.current) {
            ablyClientRef.current.close();
            ablyClientRef.current = null;
          }
          isAblyActiveRef.current = false;
          fallbackToSSE();
        });

        const channel = client.channels.get(`session:${id}`);
        await channel.subscribe('state-change', (message) => {
          const data = message.data;
          if (data && !data.error) {
            setSseState(data);
            setSseConnected(true);
            if (data.serverTime) {
              setServerOffset(Date.now() - new Date(data.serverTime).getTime());
            }
          }
        });
      } catch {
        fallbackToSSE();
      }
    };

    startAbly();

    return () => {
      if (ablyClientRef.current) {
        ablyClientRef.current.close();
        ablyClientRef.current = null;
      }
      closeSSE();
      isAblyActiveRef.current = false;
    };
  }, [id, participantId, closeSSE]);

  // Sync serverOffset from SWR poll as well
  useEffect(() => {
    if (swrState?.serverTime) {
      setServerOffset(Date.now() - new Date(swrState.serverTime).getTime());
    }
  }, [swrState?.serverTime]);

  // Keep latest available state between SSE and SWR
  const sessionState = sseState || swrState;

  useEffect(() => {
    const incomingQ = sessionState?.activeQuestion;
    if (incomingQ) {
      if (!incomingQ.unchanged) {
        setActiveQuestion((prev: any) => {
          if (prev?.id === incomingQ.id && prev?.text === incomingQ.text) return prev;
          // New question arrived: reset answer input, submission lock and feedback
          setAnswerText('');
          setSubmittedQuestionId(null);
          setFeedback(null);
          if (participantId && incomingQ.id) {
            fetchFeedback(incomingQ.id);
          }
          return incomingQ;
        });
      }
    } else {
      setActiveQuestion((prev: any) => (prev ? null : prev));
    }

    if (sessionState?.questionStartedAt !== undefined) {
      setQuestionStartedAt((prev) => (prev === sessionState?.questionStartedAt ? prev : sessionState.questionStartedAt));
    }

    // Handle game flow phases
    if (sessionState?.phase) {
      setPhase(sessionState.phase);
      if (sessionState.phase === 'get-ready') {
        setGetReadyCountdown(3);
      }
    }
  }, [sessionState?.status, sessionState?.activeQuestion?.id, sessionState?.activeQuestion?.unchanged, sessionState?.questionStartedAt, sessionState?.phase, participantId]);

  // Get Ready countdown timer
  useEffect(() => {
    if (phase !== 'get-ready') return;

    if (getReadyCountdown <= 0) {
      setPhase('question');
      return;
    }

    const timer = setTimeout(() => {
      setGetReadyCountdown(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [phase, getReadyCountdown]);

  const isTimed = (activeQuestion?.timeLimit ?? 30) > 0;

  // Timer countdown loop with server time clock-skew compensation
  useEffect(() => {
    if (!activeQuestion || !isTimed || !questionStartedAt) {
      setTimeLeft(activeQuestion?.timeLimit || 0);
      return;
    }

    const updateTimer = () => {
      const start = new Date(questionStartedAt).getTime();
      const synchronizedNow = Date.now() - serverOffset;
      const elapsed = Math.max(0, (synchronizedNow - start) / 1000);
      const remaining = Math.max(0, (activeQuestion.timeLimit || 30) - elapsed);
      setTimeLeft(Math.ceil(remaining));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 250);

    return () => clearInterval(interval);
  }, [activeQuestion?.id, activeQuestion?.timeLimit, isTimed, questionStartedAt, serverOffset]);

  // Fetch feedback when submitting or when question changes
  const fetchFeedback = async (qId: string) => {
    if (!participantId || !qId) return;
    try {
      const res = await fetch(`/api/play/${id}/feedback?participantId=${participantId}&questionId=${qId}`);
      if (res.ok) {
        const data = await res.json();
        setFeedback(data);
      }
    } catch (e) {
      console.error('Failed to load feedback', e);
    }
  };

  const handleSubmit = async (answer: string) => {
    if (!activeQuestion || !participantId || submitting || (isTimed && timeLeft <= 0)) return;

    // Haptic feedback on tap
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate(40); } catch (_) {}
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/play/${id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantId,
          questionId: activeQuestion.id,
          answer,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setAnswerText(''); // Clear input for next submission
        // Optimistically increment submittedCount
        setFeedback(prev => prev ? { ...prev, submittedCount: prev.submittedCount + 1 } : null);
        await fetchFeedback(activeQuestion.id);
      } else {
        console.error('Submit failed:', data.error);
      }
    } catch (err) {
      console.error('Submit error', err);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (activeQuestion?.id) {
      fetchFeedback(activeQuestion.id);
    }
  }, [activeQuestion?.id]);

  // Deterministically shuffle MCQ options using participantId as seed
  const shuffledOptions = useMemo(() => {
    if (!activeQuestion?.options || !Array.isArray(activeQuestion.options)) return [];
    const opts = [...activeQuestion.options];
    if (!participantId) return opts;

    // Simple deterministic shuffle using participantId hash as seed
    let seed = 0;
    for (let i = 0; i < participantId.length; i++) {
      seed = ((seed << 5) - seed + participantId.charCodeAt(i)) | 0;
    }

    // Fisher-Yates shuffle with seeded PRNG
    const seededRandom = () => {
      seed = (seed * 1664525 + 1013904223) & 0x7fffffff;
      return seed / 0x7fffffff;
    };

    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom() * (i + 1));
      [opts[i], opts[j]] = [opts[j], opts[i]];
    }

    return opts;
  }, [activeQuestion, participantId]);

  if (swrError && !sseConnected) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col justify-center items-center text-red-400 font-bold p-6 text-center">
        <p className="text-xl mb-4">Unable to connect to session.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-white/10 hover:bg-white/20 clip-slanted rounded-none text-white font-medium"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  if (!sessionState || !participantId) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-4" />
        <p className="text-white font-bold animate-pulse">Syncing with Live Session...</p>
      </div>
    );
  }

  if (sessionState.status === 'DRAFT') {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col justify-between items-center text-center p-6 select-none">
        <div className="pt-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-bold tracking-wider">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            LOBBY CONNECTED
          </div>
        </div>

        <div className="max-w-sm">
          <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <div className="absolute inset-0 bg-cyan-500/20 clip-slanted rounded-none blur-xl animate-pulse" />
            <div className="relative w-20 h-20 bg-navy-900 border border-cyan-500/30 clip-slanted rounded-none flex items-center justify-center shadow-2xl">
              <Gamepad2 className="w-10 h-10 text-cyan-400 animate-bounce" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-white mb-3 tracking-tight">You're In!</h1>
          <p className="text-slate-400 text-base leading-relaxed">
            Keep your eyes on the host screen.<br />The game is starting soon.
          </p>
        </div>

        <div className="pb-4 text-center">
          <p className="text-slate-600 text-xs font-mono">POWERED BY PULSE MINI</p>
        </div>
      </div>
    );
  }

  if (sessionState.status === 'ENDED') {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col justify-between items-center text-center p-6">
        <div className="pt-8">
          <span className="text-xs font-mono uppercase tracking-widest text-slate-500">Session Completed</span>
        </div>

        <div className="max-w-md w-full bg-navy-900/60 border border-white/10 clip-slanted rounded-none p-8 backdrop-blur-md">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-bounce" />
          <h1 className="text-3xl font-black text-white mb-2">Game Over!</h1>
          <p className="text-slate-400 mb-6">Thanks for playing with us today!</p>

          {feedback && sessionState.mode === 'COMPETITIVE' && (
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div className="bg-navy-950/80 p-4 clip-slanted rounded-none border border-white/5">
                <span className="text-xs text-slate-400 uppercase font-bold block mb-1">Final Score</span>
                <span className="text-3xl font-black text-cyan-400">{feedback.currentScore}</span>
                <span className="text-xs text-slate-500 block mt-1">points</span>
              </div>
              <div className="bg-navy-950/80 p-4 clip-slanted rounded-none border border-white/5">
                <span className="text-xs text-slate-400 uppercase font-bold block mb-1">Your Rank</span>
                <span className="text-3xl font-black text-yellow-400">#{feedback.rank}</span>
                <span className="text-xs text-slate-500 block mt-1">on leaderboard</span>
              </div>
            </div>
          )}
        </div>

        <div className="pb-4 text-center">
          <p className="text-slate-600 text-xs font-mono">POWERED BY PULSE MINI</p>
        </div>
      </div>
    );
  }

  // === GET READY PHASE ===
  if (phase === 'get-ready' && activeQuestion) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-6 select-none">
        <div className="text-center animate-in zoom-in-95 duration-500">
          <div className="w-32 h-32 mx-auto mb-8 relative">
            <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-2xl animate-pulse" />
            <div className="relative w-32 h-32 bg-navy-900 border-4 border-cyan-400 rounded-full flex items-center justify-center shadow-2xl shadow-cyan-500/20">
              <span className="text-6xl font-black text-cyan-400 font-mono animate-bounce">
                {getReadyCountdown || 'GO!'}
              </span>
            </div>
          </div>
          <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Get Ready!</h2>
          <p className="text-cyan-400 font-mono text-sm font-bold uppercase tracking-widest">
            {activeQuestion.type === 'POLL' ? 'Live Poll' : activeQuestion.type === 'TEXT' ? 'Open Response' : 'Multiple Choice'}
          </p>
        </div>
      </div>
    );
  }

  // === REVEAL PHASE ===
  if (phase === 'reveal' && feedback) {
    const isCorrectAnswer = feedback.isCorrect;
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 select-none transition-colors duration-500 ${
        isCorrectAnswer ? 'bg-green-950' : 'bg-red-950'
      }`}>
        <div className="text-center animate-in zoom-in-95 duration-300">
          {isCorrectAnswer ? (
            <>
              <CheckCircle2 className="w-20 h-20 text-green-400 mx-auto mb-4 animate-bounce" />
              <h2 className="text-4xl font-black text-green-300 mb-2">Correct!</h2>
              {feedback.scoreEarned > 0 && (
                <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/40 text-green-300 px-6 py-3 clip-slanted rounded-none font-mono text-xl font-black mt-4 animate-bounce">
                  +{feedback.scoreEarned} PTS
                </div>
              )}
            </>
          ) : (
            <>
              <XCircle className="w-20 h-20 text-red-400 mx-auto mb-4" />
              <h2 className="text-4xl font-black text-red-300 mb-2">Incorrect</h2>
              <p className="text-red-400/80 text-sm">Better luck on the next one!</p>
            </>
          )}

          {feedback.currentStreak > 1 && (
            <div className="mt-4 flex items-center justify-center gap-2 text-orange-400 font-mono font-bold">
              <Flame className="w-5 h-5 fill-orange-400" />
              <span>{feedback.currentStreak} streak!</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // === LEADERBOARD PHASE ===
  if (phase === 'leaderboard' && feedback) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-6 select-none">
        <div className="text-center animate-in slide-in-from-bottom-4 duration-500">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-4 block">YOUR STANDING</span>
          <div className="w-24 h-24 mx-auto mb-4 bg-navy-900 border-2 border-cyan-400 clip-slanted rounded-none flex items-center justify-center shadow-xl">
            <span className="text-4xl font-black text-cyan-400 font-mono">#{feedback.rank}</span>
          </div>
          <p className="text-2xl font-black text-white mb-1">{feedback.currentScore} pts</p>
          {feedback.currentStreak > 1 && (
            <p className="text-orange-400 font-bold text-sm flex items-center justify-center gap-1 mt-2">
              <Flame className="w-4 h-4 fill-orange-400" />
              {feedback.currentStreak} in a row!
            </p>
          )}
          <div className="mt-6 flex items-center justify-center gap-2 text-slate-400 text-xs font-mono animate-pulse">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> NEXT QUESTION COMING UP...
          </div>
        </div>
      </div>
    );
  }

  const activeQ = activeQuestion;
  const maxAnswers = activeQ?.maxAnswers ?? 1;
  const isLockedOut = (feedback?.submittedCount ?? 0) >= maxAnswers;
  const timeProgress = activeQ?.timeLimit ? (timeLeft / activeQ.timeLimit) * 100 : 100;

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-between p-4 sm:p-6 max-w-lg mx-auto relative overflow-hidden select-none">
      {/* Soft Tab-switch Warning Toast */}
      {tabSwitchWarning && (
        <div className="fixed top-4 left-4 right-4 max-w-sm mx-auto z-50 bg-amber-500/90 text-navy-950 px-4 py-3 clip-slanted rounded-none shadow-2xl flex items-center gap-3 backdrop-blur-md animate-in slide-in-from-top-4 duration-300">
          <AlertTriangle className="w-6 h-6 shrink-0" />
          <p className="text-xs font-bold leading-snug">
            Welcome back! Stay on this tab for the best speed bonuses!
          </p>
        </div>
      )}

      {/* Top HUD: Score, Streak, Timer */}
      <div className="w-full">
        <div className="flex items-center justify-between gap-2 mb-3">
          {/* Live Score & Streak */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-navy-900/90 border border-white/10 px-3 py-1.5 clip-slanted rounded-none">
              <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-black text-white font-mono">{feedback?.currentScore || 0}</span>
            </div>

            {(feedback?.currentStreak || 0) > 1 && (
              <div className="flex items-center gap-1 bg-orange-500/20 border border-orange-500/40 px-2.5 py-1.5 clip-slanted rounded-none animate-pulse">
                <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
                <span className="text-xs font-black text-orange-400 font-mono">{feedback?.currentStreak}x</span>
              </div>
            )}
          </div>

          {/* Live Timer badge - only if isTimed */}
          {isTimed ? (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 clip-slanted rounded-none font-mono text-sm font-black border transition-colors ${
              timeLeft <= 5
                ? 'bg-red-500/20 border-red-500/40 text-red-400 animate-bounce'
                : 'bg-navy-900/90 border-white/10 text-cyan-400'
            }`}>
              <Clock className="w-4 h-4" />
              <span>{timeLeft}s</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 clip-slanted rounded-none font-mono text-xs font-bold border bg-navy-900/90 border-white/10 text-slate-400">
              <span>♾️ Live</span>
            </div>
          )}
        </div>

        {/* Linear progress bar for timer - only if isTimed */}
        {isTimed && (
          <div className="w-full h-1.5 bg-navy-900 rounded-full overflow-hidden border border-white/5">
            <div
              className={`h-full transition-all duration-300 ease-linear ${
                timeLeft <= 5 ? 'bg-red-500' : timeLeft <= 10 ? 'bg-yellow-400' : 'bg-cyan-400'
              }`}
              style={{ width: `${Math.max(0, timeProgress)}%` }}
            />
          </div>
        )}
      </div>

      {/* Main Question Display */}
      <div className="my-auto py-6 flex flex-col justify-center">
        <div className="mb-6 text-center">
          <span className="inline-block text-[11px] font-mono font-bold tracking-widest text-cyan-400/80 uppercase bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 mb-3">
            {activeQ?.type === 'IMAGE_SELECT' ? 'Spot AI / Human' : 'Multiple Choice'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug tracking-tight">
            {activeQ?.text || 'Waiting for the next question...'}
          </h2>
        </div>

        {/* Input Form / MCQ Buttons / Image Tiles */}
        {isLockedOut ? (
          <div className="bg-navy-900/90 border border-cyan-500/30 clip-slanted rounded-none p-8 text-center backdrop-blur-md shadow-2xl flex flex-col items-center justify-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-cyan-400" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">Answer Locked In!</h3>
            <p className="text-slate-400 text-sm">
              Waiting for the host to reveal the results...
            </p>

            {feedback && feedback.scoreEarned > 0 && (
              <div className="mt-4 inline-flex items-center gap-2 bg-green-500/20 border border-green-500/40 text-green-300 px-4 py-2 clip-slanted rounded-none font-mono text-sm font-black animate-bounce">
                +{feedback.scoreEarned} PTS EARNED!
              </div>
            )}
          </div>
        ) : isTimed && timeLeft <= 0 ? (
          <div className="bg-navy-900/90 border border-red-500/30 clip-slanted rounded-none p-8 text-center backdrop-blur-md shadow-2xl flex flex-col items-center justify-center animate-in zoom-in-95 duration-300">
            <Clock className="w-12 h-12 text-red-400 mb-3" />
            <h3 className="text-2xl font-black text-white mb-1">Time's Up!</h3>
            <p className="text-slate-400 text-sm mb-4">Get ready for the next round.</p>
            <div className="flex items-center justify-center gap-2 text-cyan-400 text-xs font-mono animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> WAITING FOR HOST...
            </div>
          </div>
        ) : (
          <div className="w-full">
            {activeQ?.type === 'IMAGE_SELECT' || activeQ?.images ? (
              <div className="grid grid-cols-2 gap-3.5">
                {activeQ?.images?.map((img: any, i: number) => {
                  const labels = ['A', 'B', 'C', 'D'];
                  return (
                    <button
                      key={img.id || i}
                      onClick={() => handleSubmit(img.id)}
                      disabled={submitting}
                      className="w-full relative bg-navy-900 hover:border-cyan-400 border-2 border-white/15 clip-slanted rounded-none p-2.5 transition-all transform active:scale-95 shadow-lg group overflow-hidden flex flex-col items-center"
                    >
                      <img src={img.url} alt={img.label} className="w-full h-36 sm:h-44 object-cover rounded-lg mb-2" />
                      <span className="font-mono font-black text-sm text-white group-hover:text-cyan-300">
                        {labels[i] || img.label || `Option ${i + 1}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {shuffledOptions.map((opt: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => handleSubmit(opt)}
                    disabled={submitting}
                    className="w-full text-left bg-navy-900 hover:bg-cyan-500/15 active:bg-cyan-500/30 border-2 border-white/10 hover:border-cyan-400 clip-slanted rounded-none p-5 sm:p-6 text-lg sm:text-xl font-bold text-white transition-all transform active:scale-[0.98] shadow-lg flex items-center justify-between group"
                  >
                    <span className="leading-tight group-hover:text-cyan-200">{opt}</span>
                    <span className="w-3 h-3 rounded-full border-2 border-white/20 group-hover:border-cyan-400 group-hover:bg-cyan-400 shrink-0 ml-3 transition-colors" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <div className="pt-4 pb-2 text-center">
        <p className="text-slate-600 text-[11px] font-mono font-semibold tracking-wider">
          PULSE MINI • NIBMCODEX 2.0
        </p>
      </div>
    </div>
  );
}

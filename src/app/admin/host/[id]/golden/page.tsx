'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useSWR from 'swr';
import Link from 'next/link';
import * as Ably from 'ably';
import {
  Trophy,
  Download,
  Users,
  AlertTriangle,
  Flame,
  ArrowLeft,
  Sparkles,
  QrCode,
  CheckCircle2,
  StopCircle,
  Plus,
} from 'lucide-react';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch');
  return data;
};

interface ScanActivity {
  id: string;
  participantName: string;
  ticketNumber: number;
  isWinning: boolean;
  pointsEarned: number;
  timestamp: string;
  isCorrect?: boolean;
  speedBonus?: number;
}

export default function GoldenTicketHostView() {
  const { id } = useParams();
  const router = useRouter();

  const { data: session, mutate: mutateSession } = useSWR(`/api/admin/sessions/${id}`, fetcher, { refreshInterval: 5000 });
  const { data: liveStats, mutate: mutateLiveStats } = useSWR(`/api/admin/sessions/${id}/live-stats`, fetcher, { refreshInterval: 5000 });
  const { data: tickets, mutate: mutateTickets } = useSWR(`/api/admin/sessions/${id}/golden-ticket/generate`, fetcher, { refreshInterval: 5000 });

  const [activities, setActivities] = useState<ScanActivity[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenModal, setShowGenModal] = useState(false);
  const [genCount, setGenCount] = useState(15);
  const [genWinning, setGenWinning] = useState(3);
  const [genMaxScans, setGenMaxScans] = useState<string>('');

  const ablyClientRef = useRef<Ably.Realtime | null>(null);

  // Subscribe to Ably events for real-time ticket scans & leaderboard
  useEffect(() => {
    if (!id) return;

    const startAbly = async () => {
      try {
        const client = new Ably.Realtime({
          authUrl: `/api/ably/auth?clientId=host-golden-${id}&sessionId=${id}&role=host`,
          autoConnect: true,
        });
        ablyClientRef.current = client;

        const channel = client.channels.get(`session:${id}`);

        await channel.subscribe('ticket-scanned', (message) => {
          const data = message.data;
          if (data) {
            setActivities((prev) => [
              {
                id: `${Date.now()}-${Math.random()}`,
                participantName: data.participantName,
                ticketNumber: data.ticketNumber,
                isWinning: data.isWinning,
                pointsEarned: data.pointsEarned,
                isCorrect: data.isCorrect,
                speedBonus: data.speedBonus,
                timestamp: new Date().toLocaleTimeString(),
              },
              ...prev.slice(0, 29), // keep last 30 activities
            ]);
            mutateLiveStats();
            mutateTickets();
          }
        });

        await channel.subscribe('leaderboard-update', () => {
          mutateLiveStats();
        });
      } catch (err) {
        console.error('Ably connection failed in Golden Ticket view', err);
      }
    };

    startAbly();

    return () => {
      if (ablyClientRef.current) {
        ablyClientRef.current.close();
        ablyClientRef.current = null;
      }
    };
  }, [id, mutateLiveStats, mutateTickets]);

  const handleEndHunt = async () => {
    if (!confirm('Are you sure you want to end this Golden Ticket hunt? ALL QR codes will immediately expire.')) return;

    try {
      await fetch(`/api/admin/sessions/${id}/state`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ENDED' }),
      });
      await mutateSession();
    } catch (err) {
      alert('Failed to end hunt');
    }
  };

  const handleGenerateMore = async () => {
    setIsGenerating(true);
    try {
      await fetch(`/api/admin/sessions/${id}/golden-ticket/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalTickets: genCount,
          winningCount: genWinning,
          maxScans: genMaxScans ? parseInt(genMaxScans, 10) : null,
        }),
      });
      setShowGenModal(false);
      await mutateTickets();
    } catch (err) {
      alert('Failed to generate tickets');
    } finally {
      setIsGenerating(false);
    }
  };

  const totalGenerated = tickets?.length || 0;
  const totalWinning = tickets?.filter((t: any) => t.isWinning).length || 0;
  const totalScans = tickets?.reduce((acc: number, t: any) => acc + (t.scanCount || 0), 0) || 0;
  const leaderboard = liveStats?.leaderboard || [];

  return (
    <div className="min-h-screen bg-navy-950 text-white flex flex-col relative overflow-hidden select-none">
      {/* Top Header */}
      <header className="p-6 flex justify-between items-center border-b border-white/10 bg-navy-900/60 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/dashboard"
            className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 clip-slanted rounded-none text-slate-300 transition-colors"
            title="Back to dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-black text-white tracking-tight">Golden Ticket Arena</h1>
              <span className="text-xs font-mono bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded-md font-bold">
                PHYSICAL HUNT
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                session?.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {session?.status || 'LOADING'}
              </span>
            </div>
            <p className="text-slate-400 text-xs mt-1 font-mono">
              Session: {session?.name} • Join PIN: <span className="text-cyan-400 font-bold">{session?.joinCode}</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <a
            href={`/api/admin/sessions/${id}/golden-ticket/pdf`}
            download
            className="px-4 py-2.5 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold clip-slanted rounded-none flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/10"
          >
            <Download className="w-4 h-4" /> Download PDF for Print
          </a>

          <button
            onClick={() => setShowGenModal(true)}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-mono text-xs font-bold clip-slanted rounded-none flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" /> Generate Tickets
          </button>

          {session?.status === 'ACTIVE' && (
            <button
              onClick={handleEndHunt}
              className="px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400 font-mono text-xs font-bold clip-slanted rounded-none flex items-center gap-2 transition-all"
            >
              <StopCircle className="w-4 h-4" /> End Hunt
            </button>
          )}
        </div>
      </header>

      {/* Main Screen Layout */}
      <main className="flex-1 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10 max-w-7xl w-full mx-auto">
        {/* Left 2 Columns: Live Podium & Leaderboard */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Key Metrics HUD */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-navy-900/80 border border-white/10 p-5 clip-slanted rounded-none">
              <span className="text-xs text-slate-400 font-mono uppercase block">Total QR Tickets</span>
              <p className="text-3xl font-black text-white font-mono mt-1">{totalGenerated}</p>
              <span className="text-[11px] text-yellow-400 font-mono block mt-1">{totalWinning} Golden Winners</span>
            </div>
            <div className="bg-navy-900/80 border border-white/10 p-5 clip-slanted rounded-none">
              <span className="text-xs text-slate-400 font-mono uppercase block">Total Scans Claimed</span>
              <p className="text-3xl font-black text-cyan-400 font-mono mt-1">{totalScans}</p>
              <span className="text-[11px] text-slate-500 font-mono block mt-1">Across all attendees</span>
            </div>
            <div className="bg-navy-900/80 border border-white/10 p-5 clip-slanted rounded-none">
              <span className="text-xs text-slate-400 font-mono uppercase block">Active Participants</span>
              <p className="text-3xl font-black text-white font-mono mt-1">{liveStats?.totalParticipants || 0}</p>
              <span className="text-[11px] text-green-400 font-mono block mt-1">Live in Arena</span>
            </div>
          </div>

          {/* Top 3 Podium */}
          <div className="bg-navy-900/90 border border-white/10 p-6 clip-slanted rounded-none backdrop-blur-md">
            <h2 className="text-base font-bold text-white font-mono flex items-center gap-2 mb-6">
              <Trophy className="w-5 h-5 text-yellow-400" />
              TOP 3 SCAVENGER PODIUM
            </h2>

            <div className="grid grid-cols-3 gap-4 text-center items-end pt-4">
              {/* #2 Silver */}
              <div className="bg-white/5 border border-white/10 p-4 clip-slanted rounded-none order-1">
                <div className="w-10 h-10 bg-slate-300 text-navy-950 font-black text-lg rounded-full flex items-center justify-center mx-auto mb-2 font-mono">
                  2
                </div>
                <h3 className="font-bold text-white text-base truncate">{leaderboard[1]?.name || '---'}</h3>
                <p className="text-cyan-400 font-mono font-black text-xl">{leaderboard[1]?.score || 0}</p>
                <span className="text-[10px] text-slate-400 font-mono">points</span>
              </div>

              {/* #1 Gold */}
              <div className="bg-yellow-500/10 border-2 border-yellow-500/40 p-6 clip-slanted rounded-none order-2 shadow-2xl shadow-yellow-500/10 relative -top-3">
                <div className="w-12 h-12 bg-yellow-500 text-navy-950 font-black text-xl rounded-full flex items-center justify-center mx-auto mb-2 font-mono shadow-lg">
                  1
                </div>
                <h3 className="font-bold text-white text-lg truncate flex items-center justify-center gap-1">
                  {leaderboard[0]?.name || '---'}
                </h3>
                <p className="text-yellow-400 font-mono font-black text-3xl">{leaderboard[0]?.score || 0}</p>
                <span className="text-xs text-yellow-300/80 font-mono font-bold">LEADING CHAMPION</span>
              </div>

              {/* #3 Bronze */}
              <div className="bg-white/5 border border-white/10 p-4 clip-slanted rounded-none order-3">
                <div className="w-10 h-10 bg-amber-700 text-white font-black text-lg rounded-full flex items-center justify-center mx-auto mb-2 font-mono">
                  3
                </div>
                <h3 className="font-bold text-white text-base truncate">{leaderboard[2]?.name || '---'}</h3>
                <p className="text-cyan-400 font-mono font-black text-xl">{leaderboard[2]?.score || 0}</p>
                <span className="text-[10px] text-slate-400 font-mono">points</span>
              </div>
            </div>
          </div>

          {/* Full Leaderboard Table */}
          <div className="bg-navy-900/90 border border-white/10 p-6 clip-slanted rounded-none flex-1 overflow-y-auto max-h-[350px]">
            <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-4 font-bold">
              FULL ARENA STANDINGS ({leaderboard.length})
            </h3>
            <div className="space-y-2">
              {leaderboard.map((p: any, idx: number) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 bg-navy-950 border border-white/5 clip-slanted rounded-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 flex items-center justify-center text-xs font-mono font-bold text-slate-400 bg-white/5">
                      #{idx + 1}
                    </span>
                    <span className="font-bold text-white text-sm">{p.name}</span>
                  </div>
                  <div className="font-mono text-cyan-400 font-bold text-base">
                    {p.score} <span className="text-xs text-slate-500">pts</span>
                  </div>
                </div>
              ))}
              {leaderboard.length === 0 && (
                <p className="text-center text-slate-500 py-8 text-sm font-mono">No scans recorded yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Live Scan Activity Feed */}
        <div className="bg-navy-900/90 border border-white/10 p-6 clip-slanted rounded-none flex flex-col backdrop-blur-md">
          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
            <h2 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              LIVE SCAN FEED
            </h2>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[600px]">
            {activities.map((act) => (
              <div
                key={act.id}
                className={`p-3 border clip-slanted rounded-none animate-in slide-in-from-top-2 duration-300 ${
                  act.isWinning
                    ? 'bg-yellow-500/10 border-yellow-500/40'
                    : 'bg-navy-950 border-white/10'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    {act.isWinning && <Trophy className="w-3.5 h-3.5 text-yellow-400" />}
                    {act.participantName}
                  </span>
                  <span className="text-slate-500 font-mono text-[10px]">{act.timestamp}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono flex items-center gap-1.5">
                    Ticket #{String(act.ticketNumber).padStart(2, '0')}
                    {act.isCorrect !== undefined && (
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          act.isCorrect
                            ? 'text-emerald-400 bg-emerald-500/15 border border-emerald-500/30'
                            : 'text-amber-400 bg-amber-500/15 border border-amber-500/30'
                        }`}
                      >
                        {act.isCorrect ? 'SOLVED' : 'MISSED'}
                      </span>
                    )}
                  </span>
                  <div className="text-right flex items-center gap-1.5">
                    {Boolean(act.speedBonus && act.speedBonus > 0) && (
                      <span className="text-[10px] text-emerald-400 font-mono font-bold">
                        +{act.speedBonus}⚡
                      </span>
                    )}
                    <span className={`font-mono font-black ${act.isWinning ? 'text-yellow-400' : 'text-cyan-400'}`}>
                      +{act.pointsEarned} pts
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {activities.length === 0 && (
              <div className="text-center py-16 text-slate-500 text-xs font-mono">
                <QrCode className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                Waiting for attendees to scan tickets in the venue...
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Generate Tickets Modal */}
      {showGenModal && (
        <div className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-navy-900 border border-white/15 p-6 max-w-md w-full clip-slanted rounded-none shadow-2xl">
            <h3 className="text-xl font-black text-white mb-4">Generate Physical QR Tickets</h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Total Tickets to Add
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={genCount}
                  onChange={(e) => setGenCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-navy-950 border border-white/15 p-3 text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Number of Winning ("Golden") Tickets
                </label>
                <input
                  type="number"
                  min="0"
                  max={genCount}
                  value={genWinning}
                  onChange={(e) => setGenWinning(Math.min(genCount, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="w-full bg-navy-950 border border-white/15 p-3 text-yellow-400 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Max Scans Per Ticket <span className="text-slate-500 lowercase">(leave blank for unlimited)</span>
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="Unlimited"
                  value={genMaxScans}
                  onChange={(e) => setGenMaxScans(e.target.value)}
                  className="w-full bg-navy-950 border border-white/15 p-3 text-white font-mono font-bold"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowGenModal(false)}
                className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-sm clip-slanted rounded-none"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateMore}
                disabled={isGenerating}
                className="flex-1 py-3 bg-cyan-400 hover:bg-cyan-300 text-navy-950 font-black text-sm clip-slanted rounded-none"
              >
                {isGenerating ? 'Generating...' : 'Create Tickets'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Plus, Play, Trash2, Edit3, Loader2, X, Trophy, Image as ImageIcon, QrCode } from 'lucide-react';
import Link from 'next/link';
import useSWR from 'swr';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch');
  return data;
};

export default function DashboardPage() {
  const { data: sessions, error, isLoading, mutate } = useSWR('/api/admin/sessions', fetcher);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSessionName, setNewSessionName] = useState('');
  const [newGameType, setNewGameType] = useState<'QUIZ' | 'AI_VS_HUMAN' | 'GOLDEN_TICKET'>('QUIZ');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreateSession = async () => {
    if (!newSessionName.trim()) return;

    setIsCreating(true);
    try {
      await fetch('/api/admin/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newSessionName, gameType: newGameType, mode: 'COMPETITIVE' }),
      });
      setShowCreateModal(false);
      setNewSessionName('');
      setNewGameType('QUIZ');
      mutate();
    } catch (err) {
      alert('Failed to create session');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this session?')) return;
    
    setDeletingId(id);
    try {
      await fetch(`/api/admin/sessions/${id}`, { method: 'DELETE' });
      mutate();
    } catch (err) {
      alert('Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            Pulse Mini Arenas
            <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2.5 py-1 rounded-full uppercase tracking-wider font-bold">3-Game Suite</span>
          </h1>
          <p className="text-slate-400 mt-1">Manage MCQ Arenas, AI vs Human Image games, and Golden Ticket hunts.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" /> New Arena Session
        </button>
      </div>

      {isLoading && (
        <div className="text-cyan-400 flex items-center gap-2 mb-6 font-mono text-sm">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading sessions...
        </div>
      )}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="text-red-400 text-sm">
            <strong>Failed to load sessions:</strong> {error.message || 'An unexpected error occurred.'}
          </div>
          <button
            onClick={() => mutate()}
            className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold rounded-lg transition-colors shrink-0 ml-4"
          >
            Retry
          </button>
        </div>
      )}

      {sessions && sessions.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-xl">
          <p className="text-slate-400 mb-4">No arena sessions found.</p>
          <button onClick={() => setShowCreateModal(true)} className="text-cyan-400 hover:underline">Create your first arena session</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions?.map((session: any) => {
          const gameType = session.gameType || 'QUIZ';
          const hostUrl = gameType === 'GOLDEN_TICKET' ? `/admin/host/${session.id}/golden` : `/admin/host/${session.id}`;

          return (
            <div key={session.id} className="bg-navy-900 border border-white/10 rounded-xl p-6 flex flex-col hover:border-cyan-500/30 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs font-bold rounded-md ${session.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 text-slate-400'}`}>
                    {session.status}
                  </span>
                  <span className={`px-2 py-1 text-xs font-mono font-bold rounded-md ${
                    gameType === 'GOLDEN_TICKET'
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      : gameType === 'AI_VS_HUMAN'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  }`}>
                    {gameType === 'GOLDEN_TICKET' ? 'GOLDEN TICKET' : gameType === 'AI_VS_HUMAN' ? 'AI VS HUMAN' : 'MCQ ARENA'}
                  </span>
                </div>
                <span className="font-mono text-sm text-slate-500">PIN: <span className="text-cyan-400 font-bold">{session.joinCode}</span></span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 flex-grow">{session.name}</h3>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-mono font-bold mb-6">COMPETITIVE SPEED ARENA</p>

              <div className="flex items-center gap-2 mt-auto pt-4 border-t border-white/5">
                <Link href={`/admin/dashboard/session/${session.id}`} className="flex-1 flex justify-center items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors text-slate-300">
                  <Edit3 className="w-4 h-4" /> Manage
                </Link>
                <Link href={hostUrl} className="flex-1 flex justify-center items-center gap-2 px-3 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg text-sm font-bold transition-colors">
                  <Play className="w-4 h-4" /> Host
                </Link>
                <button 
                  onClick={() => handleDelete(session.id)} 
                  disabled={deletingId === session.id}
                  className="p-2 bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors disabled:opacity-50"
                  title="Delete arena"
                >
                  {deletingId === session.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-navy-900 border border-white/10 rounded-2xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Create Arena Session</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="space-y-5 mb-6">
              <div>
                <label className="block text-xs uppercase tracking-widest font-mono font-bold text-slate-400 mb-2">Session Name</label>
                <input 
                  type="text" 
                  value={newSessionName}
                  onChange={(e) => setNewSessionName(e.target.value)}
                  placeholder="e.g. CodeX Grand Interactive Final"
                  className="w-full bg-navy-950 border border-white/10 rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest font-mono font-bold text-slate-400 mb-2">Game Type</label>
                <div className="grid grid-cols-1 gap-3">
                  <button 
                    type="button"
                    onClick={() => setNewGameType('QUIZ')}
                    className={`p-4 rounded-xl border text-left flex items-center gap-3.5 transition-all ${newGameType === 'QUIZ' ? 'bg-cyan-500/20 border-cyan-500 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-base text-white">Classic MCQ Arena</div>
                      <div className="text-xs text-slate-400 mt-0.5">Speed-scored multiple choice with persistent live leaderboard & CSV import</div>
                    </div>
                  </button>

                  <button 
                    type="button"
                    onClick={() => setNewGameType('AI_VS_HUMAN')}
                    className={`p-4 rounded-xl border text-left flex items-center gap-3.5 transition-all ${newGameType === 'AI_VS_HUMAN' ? 'bg-purple-500/20 border-purple-500 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-300 shrink-0">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-base text-white">AI vs Human Image Spotter</div>
                      <div className="text-xs text-slate-400 mt-0.5">Guess AI-generated vs Human artwork via Cloudinary (&lt;10MB auto-optimized)</div>
                    </div>
                  </button>

                  <button 
                    type="button"
                    onClick={() => setNewGameType('GOLDEN_TICKET')}
                    className={`p-4 rounded-xl border text-left flex items-center gap-3.5 transition-all ${newGameType === 'GOLDEN_TICKET' ? 'bg-yellow-500/20 border-yellow-500 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center text-yellow-400 shrink-0">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-base text-white">Golden Ticket Scavenger Hunt</div>
                      <div className="text-xs text-slate-400 mt-0.5">Physical QR codes plastered in venue, score decay, printable multi-page PDF</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <button 
              onClick={handleCreateSession}
              disabled={isCreating || !newSessionName.trim()}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-cyan-400 hover:bg-cyan-300 active:bg-cyan-500 disabled:opacity-50 text-navy-950 font-black rounded-xl transition-all shadow-lg shadow-cyan-500/20 text-base"
            >
              {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Arena Session'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

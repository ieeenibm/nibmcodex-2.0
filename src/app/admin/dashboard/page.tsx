'use client';

import { useState } from 'react';
import { Plus, Play, Trash2, Edit3, Loader2, X } from 'lucide-react';
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
  const [newSessionMode, setNewSessionMode] = useState('COMPETITIVE');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreateSession = async () => {
    if (!newSessionName.trim()) return;

    setIsCreating(true);
    try {
      await fetch('/api/admin/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newSessionName, mode: newSessionMode }),
      });
      setShowCreateModal(false);
      setNewSessionName('');
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
            Your Sessions
            <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full uppercase tracking-wider font-bold">Pulse Mini</span>
          </h1>
          <p className="text-slate-400 mt-1">Manage all your interactive games here.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" /> New Session
        </button>
      </div>

      {isLoading && <div className="text-cyan-400 flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Loading sessions...</div>}
      {error && <div className="text-red-400">Failed to load sessions.</div>}

      {sessions && sessions.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-xl">
          <p className="text-slate-400 mb-4">No sessions found.</p>
          <button onClick={() => setShowCreateModal(true)} className="text-cyan-400 hover:underline">Create your first Pulse Mini session</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions?.map((session: any) => (
          <div key={session.id} className="bg-navy-900 border border-white/10 rounded-xl p-6 flex flex-col hover:border-cyan-500/30 transition-colors">
            
            <div className="flex justify-between items-start mb-4">
              <span className={`px-2 py-1 text-xs font-bold rounded-md ${session.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 text-slate-400'}`}>
                {session.status}
              </span>
              <span className="font-mono text-sm text-slate-500">Code: <span className="text-cyan-400 font-bold">{session.joinCode}</span></span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2 flex-grow">{session.name}</h3>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-6">{session.mode}</p>

            <div className="flex items-center gap-2 mt-auto pt-4 border-t border-white/5">
              <Link href={`/admin/dashboard/session/${session.id}`} className="flex-1 flex justify-center items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors">
                <Edit3 className="w-4 h-4" /> Edit
              </Link>
              <Link href={`/admin/host/${session.id}`} className="flex-1 flex justify-center items-center gap-2 px-3 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg text-sm font-bold transition-colors">
                <Play className="w-4 h-4" /> Host
              </Link>
              <button 
                onClick={() => handleDelete(session.id)} 
                disabled={deletingId === session.id}
                className="p-2 bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors disabled:opacity-50"
              >
                {deletingId === session.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-navy-900 border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Create New Session</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Session Name</label>
                <input 
                  type="text" 
                  value={newSessionName}
                  onChange={(e) => setNewSessionName(e.target.value)}
                  placeholder="e.g., Friday Hackathon Quiz"
                  className="w-full bg-navy-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Game Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setNewSessionMode('COMPETITIVE')}
                    className={`p-3 rounded-xl border text-sm font-bold transition-all ${newSessionMode === 'COMPETITIVE' ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                  >
                    Competitive
                    <span className="block text-xs font-normal opacity-70 mt-1">Scores & Leaderboard</span>
                  </button>
                  <button 
                    onClick={() => setNewSessionMode('NON_COMPETITIVE')}
                    className={`p-3 rounded-xl border text-sm font-bold transition-all ${newSessionMode === 'NON_COMPETITIVE' ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                  >
                    Non-Competitive
                    <span className="block text-xs font-normal opacity-70 mt-1">Live Floating Responses</span>
                  </button>
                </div>
              </div>
            </div>

            <button 
              onClick={handleCreateSession}
              disabled={isCreating || !newSessionName.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-navy-950 font-bold rounded-xl transition-colors"
            >
              {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

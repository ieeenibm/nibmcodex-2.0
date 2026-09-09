'use client';

import { useState } from 'react';
import { Plus, Play, Trash2, Edit3, Loader2, X, Trophy, Image as ImageIcon, QrCode, RotateCcw, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import useSWR from 'swr';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { useToast } from '@/components/ui/Toast';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch');
  return data;
};

export default function DashboardPage() {
  const { data: sessions, error, isLoading, mutate } = useSWR('/api/admin/sessions', fetcher);
  const { data: currentUser } = useSWR('/api/admin/me', fetcher);

  const isAdmin = currentUser?.role === 'ADMIN';
  const { toast } = useToast();

  const [isCreating, setIsCreating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSessionName, setNewSessionName] = useState('');
  const [newGameType, setNewGameType] = useState<'QUIZ' | 'AI_VS_HUMAN' | 'GOLDEN_TICKET'>('QUIZ');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [resettingId, setResettingId] = useState<string | null>(null);

  // Confirm modals state
  const [sessionToDelete, setSessionToDelete] = useState<{ id: string; name: string } | null>(null);
  const [sessionToReset, setSessionToReset] = useState<{ id: string; name: string } | null>(null);

  // Full Database Reset Modal state (Admin only)
  const [showDbResetModal, setShowDbResetModal] = useState(false);
  const [confirmResetText, setConfirmResetText] = useState('');
  const [wipeHosts, setWipeHosts] = useState(false);
  const [isResettingDb, setIsResettingDb] = useState(false);
  const [dbResetResult, setDbResetResult] = useState<any | null>(null);

  const handleCreateSession = async () => {
    if (!newSessionName.trim()) return;

    setIsCreating(true);
    try {
      const res = await fetch('/api/admin/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newSessionName, gameType: newGameType, mode: 'COMPETITIVE' }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create session');
      }
      setShowCreateModal(false);
      setNewSessionName('');
      setNewGameType('QUIZ');
      mutate();
      toast.success('Arena session created successfully!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create session');
    } finally {
      setIsCreating(false);
    }
  };

  const confirmDeleteSession = async () => {
    if (!sessionToDelete) return;

    setDeletingId(sessionToDelete.id);
    try {
      const res = await fetch(`/api/admin/sessions/${sessionToDelete.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete');
      }
      mutate();
      toast.success(`Arena "${sessionToDelete.name}" deleted.`);
      setSessionToDelete(null);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete session');
    } finally {
      setDeletingId(null);
    }
  };

  const confirmResetSession = async () => {
    if (!sessionToReset) return;

    setResettingId(sessionToReset.id);
    try {
      const res = await fetch(`/api/admin/sessions/${sessionToReset.id}/reset`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to reset session');
      }
      mutate();
      toast.success(`Arena "${sessionToReset.name}" reset to DRAFT mode!`);
      setSessionToReset(null);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to reset session');
    } finally {
      setResettingId(null);
    }
  };

  const handleResetDatabase = async () => {
    if (confirmResetText !== 'RESET') return;

    setIsResettingDb(true);
    try {
      const res = await fetch('/api/admin/reset-database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmText: 'RESET', wipeHosts }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to reset database');
      }

      setShowDbResetModal(false);
      setConfirmResetText('');
      setWipeHosts(false);
      mutate();
      setDbResetResult(data);
      toast.success('Database wipe completed successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to perform database reset');
    } finally {
      setIsResettingDb(false);
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

        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              onClick={() => {
                setConfirmResetText('');
                setWipeHosts(false);
                setShowDbResetModal(true);
              }}
              className="flex items-center justify-center gap-2 px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold rounded-lg transition-colors text-sm"
              title="Wipe all database sessions, questions, responses and participants"
            >
              <AlertTriangle className="w-4 h-4" /> Reset Database
            </button>
          )}

          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" /> New Arena Session
          </button>
        </div>
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
                  <span className={`px-2 py-1 text-xs font-bold rounded-md ${session.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' : session.status === 'ENDED' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>
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
                  onClick={() => setSessionToReset({ id: session.id, name: session.name })} 
                  disabled={resettingId === session.id}
                  className="p-2 bg-white/5 hover:bg-yellow-500/20 text-slate-400 hover:text-yellow-400 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                  title="Reset session (clears responses & participants, returns to DRAFT)"
                >
                  {resettingId === session.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => setSessionToDelete({ id: session.id, name: session.name })} 
                  disabled={deletingId === session.id}
                  className="p-2 bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                  title="Delete arena"
                >
                  {deletingId === session.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Arena Modal */}
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

      {/* Admin Full Database Reset Modal */}
      {showDbResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-navy-900 border border-red-500/40 rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl shadow-red-950/50">
            <div className="flex items-center gap-3 text-red-400 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center shrink-0 border border-red-500/30">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">Reset Full Database</h2>
                <p className="text-xs font-mono text-red-400 uppercase font-bold tracking-wider">Super Admin Action</p>
              </div>
            </div>

            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-xs text-slate-300 space-y-2 mb-6">
              <p className="font-bold text-red-300">This action will permanently wipe:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li>All Arena Sessions (MCQ, AI vs Human, Golden Ticket)</li>
                <li>All Questions, candidate images, and options</li>
                <li>All Attendee registrations, scores, and streaks</li>
                <li>All Responses, QR Tickets, and Scans</li>
              </ul>
              <p className="text-slate-400 pt-1 text-[11px]">
                Note: The Master Administrator account will always be preserved.
              </p>
            </div>

            <div className="mb-5">
              <label className="flex items-center gap-2.5 text-xs text-slate-300 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={wipeHosts}
                  onChange={(e) => setWipeHosts(e.target.checked)}
                  className="w-4 h-4 rounded accent-red-500 cursor-pointer"
                />
                <span>Also delete created Host accounts</span>
              </label>
            </div>

            <div className="mb-6">
              <label className="block text-xs uppercase tracking-widest font-mono font-bold text-slate-400 mb-2">
                Type <span className="text-red-400 font-black">RESET</span> to confirm:
              </label>
              <input
                type="text"
                placeholder="Type RESET"
                value={confirmResetText}
                onChange={(e) => setConfirmResetText(e.target.value)}
                className="w-full bg-navy-950 border border-white/20 focus:border-red-500 rounded-xl px-4 py-3 text-white font-mono text-center font-bold tracking-widest focus:outline-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowDbResetModal(false)}
                disabled={isResettingDb}
                className="py-3 px-5 bg-white/5 hover:bg-white/10 text-slate-300 font-bold rounded-xl text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetDatabase}
                disabled={confirmResetText !== 'RESET' || isResettingDb}
                className="flex-1 py-3 bg-red-600 hover:bg-red-500 active:bg-red-700 disabled:opacity-30 disabled:cursor-not-allowed text-white font-black rounded-xl text-sm transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
              >
                {isResettingDb ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Purging Database...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Permanently Wipe Database</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Session Confirm Modal */}
      <ConfirmModal
        isOpen={!!sessionToDelete}
        title="Delete Arena Session?"
        description={
          sessionToDelete ? (
            <span>
              Are you sure you want to delete <strong className="text-white">"{sessionToDelete.name}"</strong>? All associated questions, participant registrations, scores, and responses will be permanently removed.
            </span>
          ) : ''
        }
        confirmText="Delete Arena"
        cancelText="Cancel"
        variant="danger"
        isLoading={!!deletingId}
        onConfirm={confirmDeleteSession}
        onCancel={() => setSessionToDelete(null)}
      />

      {/* Reset Session Confirm Modal */}
      <ConfirmModal
        isOpen={!!sessionToReset}
        title="Reset Arena Session?"
        description={
          sessionToReset ? (
            <div className="space-y-2">
              <p>
                Are you sure you want to reset <strong className="text-white">"{sessionToReset.name}"</strong>?
              </p>
              <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                <li>All participant responses and scores will be deleted.</li>
                <li>The room will return to <span className="text-cyan-400 font-bold">DRAFT</span> mode.</li>
                <li>Questions and QR ticket codes remain safe and reusable.</li>
              </ul>
            </div>
          ) : ''
        }
        confirmText="Reset Arena"
        cancelText="Cancel"
        variant="danger"
        isLoading={!!resettingId}
        onConfirm={confirmResetSession}
        onCancel={() => setSessionToReset(null)}
      />

      {/* DB Reset Success Summary Modal */}
      {dbResetResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-navy-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl shadow-emerald-950/50">
            <div className="flex items-center gap-3 text-emerald-400 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">Database Wiped</h2>
                <p className="text-xs font-mono text-emerald-400 uppercase font-bold tracking-wider">Reset Completed</p>
              </div>
            </div>

            <div className="bg-navy-950 border border-white/10 rounded-2xl p-4 text-xs font-mono space-y-2 mb-6 text-slate-300">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Sessions wiped:</span>
                <span className="font-bold text-white">{dbResetResult.wipedCounts?.sessions ?? 0}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Questions wiped:</span>
                <span className="font-bold text-white">{dbResetResult.wipedCounts?.questions ?? 0}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Participants wiped:</span>
                <span className="font-bold text-white">{dbResetResult.wipedCounts?.participants ?? 0}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Responses wiped:</span>
                <span className="font-bold text-white">{dbResetResult.wipedCounts?.responses ?? 0}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">QR Scans wiped:</span>
                <span className="font-bold text-white">{dbResetResult.wipedCounts?.qrScans ?? 0}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-400">
                <span>Host accounts:</span>
                <span className="font-bold text-white">
                  {wipeHosts ? `${dbResetResult.wipedCounts?.hosts ?? 0} accounts wiped` : 'Preserved'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setDbResetResult(null)}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-black rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              Acknowledge & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

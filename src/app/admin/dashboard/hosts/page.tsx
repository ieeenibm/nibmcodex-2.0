'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { Users, UserPlus, Trash2, Key, Loader2, CheckCircle2, ShieldAlert } from 'lucide-react';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { useToast } from '@/components/ui/Toast';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to load hosts');
  return data;
};

export default function HostsManagementPage() {
  const { data: hosts, error, mutate } = useSWR('/api/admin/hosts', fetcher);
  const { toast } = useToast();

  const [username, setUsername] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [hostToDelete, setHostToDelete] = useState<{ id: string; username: string } | null>(null);
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleCreateHost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !tempPassword.trim()) return;

    setCreating(true);
    setFormError('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/admin/hosts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), tempPassword: tempPassword.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create host');

      setSuccessMsg(`Host "${username}" created! They must change their password upon first login.`);
      toast.success(`Host "${username}" created!`);
      setUsername('');
      setTempPassword('');
      mutate();
    } catch (err: any) {
      setFormError(err.message);
      toast.error(err.message || 'Failed to create host');
    } finally {
      setCreating(false);
    }
  };

  const confirmDeleteHost = async () => {
    if (!hostToDelete) return;

    setDeletingId(hostToDelete.id);
    try {
      const res = await fetch(`/api/admin/hosts/${hostToDelete.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete');
      }
      mutate();
      toast.success(`Host account "${hostToDelete.username}" deleted.`);
      setHostToDelete(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete host');
    } finally {
      setDeletingId(null);
    }
  };

  if (error) {
    return (
      <div className="bg-navy-900 border border-red-500/20 rounded-3xl p-8 text-center max-w-lg mx-auto">
        <ShieldAlert className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-white mb-2">Access Restricted</h2>
        <p className="text-slate-400 text-sm">
          Only the Master Admin can access host account management.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <Users className="w-8 h-8 text-cyan-400" />
          Host Accounts
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Create and manage host credentials for running Pulse Mini sessions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Host Form */}
        <div className="lg:col-span-1 bg-navy-900/80 border border-white/10 rounded-3xl p-6 backdrop-blur-sm h-fit">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-cyan-400" />
            Create Host
          </h2>

          <form onSubmit={handleCreateHost} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest font-bold text-slate-400 mb-1.5">
                Username
              </label>
              <input
                required
                type="text"
                placeholder="e.g. host_john"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-navy-950 border border-white/10 rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest font-bold text-slate-400 mb-1.5">
                Temporary Password
              </label>
              <input
                required
                type="text"
                placeholder="Temporary initial password"
                value={tempPassword}
                onChange={(e) => setTempPassword(e.target.value)}
                className="w-full px-4 py-3 bg-navy-950 border border-white/10 rounded-xl text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                The host will be forced to change this immediately on their first sign-in.
              </p>
            </div>

            {formError && (
              <p className="text-xs text-red-400 font-bold">{formError}</p>
            )}

            {successMsg && (
              <div className="flex items-start gap-2 bg-green-500/10 border border-green-500/30 text-green-300 p-3 rounded-xl text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={creating || !username.trim() || !tempPassword.trim()}
              className="w-full py-3.5 bg-cyan-400 hover:bg-cyan-300 active:bg-cyan-500 disabled:opacity-40 text-navy-950 font-black rounded-xl text-sm transition-all flex items-center justify-center gap-2"
            >
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account'}
            </button>
          </form>
        </div>

        {/* Existing Hosts List */}
        <div className="lg:col-span-2 bg-navy-900/80 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Key className="w-5 h-5 text-cyan-400" />
            Active Hosts ({hosts?.length || 0})
          </h2>

          {!hosts ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            </div>
          ) : hosts.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              No host accounts created yet. Use the form on the left to add one.
            </div>
          ) : (
            <div className="space-y-3">
              {hosts.map((host: any) => (
                <div
                  key={host.id}
                  className="flex items-center justify-between p-4 bg-navy-950/70 border border-white/5 rounded-2xl hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center font-bold text-cyan-400">
                      {host.username[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{host.username}</p>
                      <span className={`inline-block text-[10px] font-mono px-2 py-0.5 rounded-full mt-0.5 ${
                        host.mustChangePass
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-green-500/10 text-green-400 border border-green-500/20'
                      }`}>
                        {host.mustChangePass ? 'Pending 1st Login Password Change' : 'Password Activated'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setHostToDelete({ id: host.id, username: host.username })}
                    disabled={deletingId === host.id}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
                    title="Delete Host"
                  >
                    {deletingId === host.id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Host Confirm Modal */}
      <ConfirmModal
        isOpen={!!hostToDelete}
        title="Delete Host Account?"
        description={
          hostToDelete ? (
            <span>
              Are you sure you want to delete host account <strong className="text-white">"{hostToDelete.username}"</strong>? All arena sessions managed by this host will also be permanently removed.
            </span>
          ) : ''
        }
        confirmText="Delete Host"
        cancelText="Cancel"
        variant="danger"
        isLoading={!!deletingId}
        onConfirm={confirmDeleteHost}
        onCancel={() => setHostToDelete(null)}
      />
    </div>
  );
}

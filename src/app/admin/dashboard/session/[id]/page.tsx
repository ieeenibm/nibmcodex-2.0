'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Plus,
  Save,
  Trash2,
  ListOrdered,
  Type,
  BarChart2,
  Loader2,
  Clock,
  Infinity as InfinityIcon,
} from 'lucide-react';
import Link from 'next/link';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch');
  return data;
};

const TIME_LIMIT_OPTIONS = [
  { label: '♾️ Untimed (No Timer)', value: 0 },
  { label: '10 Seconds', value: 10 },
  { label: '15 Seconds', value: 15 },
  { label: '20 Seconds', value: 20 },
  { label: '30 Seconds (Standard)', value: 30 },
  { label: '45 Seconds', value: 45 },
  { label: '60 Seconds (1 Min)', value: 60 },
  { label: '90 Seconds (1.5 Min)', value: 90 },
  { label: '120 Seconds (2 Min)', value: 120 },
];

export default function SessionEditorPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: session, isLoading, mutate, error } = useSWR(`/api/admin/sessions/${id}`, fetcher);

  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionType, setNewQuestionType] = useState('MCQ');
  const [newTimeLimit, setNewTimeLimit] = useState<number>(0);
  const [newQuestionMaxAnswers, setNewQuestionMaxAnswers] = useState<number>(1);
  const [newOptions, setNewOptions] = useState(['', '', '', '']);
  const [correctOptionIndex, setCorrectOptionIndex] = useState(0);

  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Set default time limit based on session mode once loaded
  useEffect(() => {
    if (session?.mode) {
      setNewTimeLimit(session.mode === 'NON_COMPETITIVE' ? 0 : 30);
    }
  }, [session?.mode]);

  const handleAddQuestion = async () => {
    if (!newQuestionText.trim()) return;

    setIsSaving(true);
    try {
      await fetch(`/api/admin/sessions/${id}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: newQuestionText.trim(),
          type: newQuestionType,
          options: newQuestionType === 'MCQ' || newQuestionType === 'POLL' ? newOptions : null,
          correctAnswer: newQuestionType === 'MCQ' ? newOptions[correctOptionIndex] : '',
          timeLimit: newTimeLimit,
          maxAnswers: newQuestionMaxAnswers,
        }),
      });
      setNewQuestionText('');
      setNewOptions(['', '', '', '']);
      setCorrectOptionIndex(0);
      mutate();
    } catch (error) {
      alert('Failed to save question');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteQuestion = async (qId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    setDeletingId(qId);
    try {
      await fetch(`/api/admin/questions/${qId}`, { method: 'DELETE' });
      mutate();
    } catch (error) {
      alert('Failed to delete question');
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="text-cyan-400 flex items-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading session...
      </div>
    );
  }
  if (error) return <div className="text-red-400">Error: {error.message || 'Failed to load'}</div>;
  if (!session) return <div className="text-red-400">Session not found.</div>;

  return (
    <div>
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Sessions
      </Link>

      <div className="bg-navy-900 border border-white/10 rounded-2xl p-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{session.name}</h1>
          <p className="text-slate-400 font-mono text-sm">
            Join Code: <span className="text-cyan-400 font-bold text-lg">{session.joinCode}</span>
          </p>
        </div>
        <div className="bg-navy-950 border border-white/10 px-4 py-2 rounded-xl text-center">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Game Mode</p>
          <p className="text-cyan-400 font-bold">
            {session.mode === 'COMPETITIVE' ? 'Competitive Arena' : 'Non-Competitive / Collaborative'}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Questions ({session.questions?.length || 0})</h2>
      </div>

      <div className="space-y-4 mb-12">
        {session.questions?.map((q: any, i: number) => (
          <div
            key={q.id}
            className="p-6 bg-navy-900 border border-white/5 rounded-xl flex gap-4 items-start relative group"
          >
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold shrink-0">
              {i + 1}
            </div>
            <div className="flex-grow">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xs px-2.5 py-0.5 rounded-md bg-white/10 text-slate-300 font-bold">
                  {q.type}
                </span>

                {q.timeLimit > 0 ? (
                  <span className="text-xs px-2.5 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-mono font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {q.timeLimit}s
                  </span>
                ) : (
                  <span className="text-xs px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-400 font-mono font-medium flex items-center gap-1">
                    <InfinityIcon className="w-3 h-3" /> Untimed
                  </span>
                )}

                <h3 className="text-lg font-bold text-white ml-2">{q.text}</h3>
              </div>

              {(q.type === 'MCQ' || q.type === 'POLL') && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                  {q.options?.map((opt: string, idx: number) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg text-sm ${
                        q.type === 'MCQ' && opt === q.correctAnswer
                          ? 'bg-green-500/20 border border-green-500/50 text-green-300 font-bold'
                          : 'bg-white/5 border border-white/5 text-slate-400'
                      }`}
                    >
                      {opt} {q.type === 'MCQ' && opt === q.correctAnswer && <span className="ml-2">✓</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => handleDeleteQuestion(q.id)}
              disabled={deletingId === q.id}
              className="text-slate-500 hover:text-red-400 transition-colors p-2 disabled:opacity-50"
              title="Delete question"
            >
              {deletingId === q.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
            </button>
          </div>
        ))}
        {(!session.questions || session.questions.length === 0) && (
          <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-xl text-slate-500">
            No questions yet. Add one below!
          </div>
        )}
      </div>

      <div className="bg-navy-900 border border-cyan-500/30 rounded-2xl p-6 sm:p-8 shadow-[0_0_30px_rgba(34,211,238,0.05)]">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <Plus className="w-5 h-5 text-cyan-400" /> Add New Question
        </h3>

        <input
          type="text"
          value={newQuestionText}
          onChange={(e) => setNewQuestionText(e.target.value)}
          placeholder="Type your question here..."
          className="w-full bg-navy-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 mb-6"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Question Type Selection */}
          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-slate-400 mb-2">
              Question Format
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setNewQuestionType('MCQ')}
                className={`flex-1 flex justify-center items-center gap-2 py-3 rounded-xl border text-sm font-semibold transition-all ${
                  newQuestionType === 'MCQ'
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                <ListOrdered className="w-4 h-4" /> MCQ
              </button>
              <button
                type="button"
                onClick={() => setNewQuestionType('POLL')}
                className={`flex-1 flex justify-center items-center gap-2 py-3 rounded-xl border text-sm font-semibold transition-all ${
                  newQuestionType === 'POLL'
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                <BarChart2 className="w-4 h-4" /> Poll
              </button>
              <button
                type="button"
                onClick={() => setNewQuestionType('TEXT')}
                className={`flex-1 flex justify-center items-center gap-2 py-3 rounded-xl border text-sm font-semibold transition-all ${
                  newQuestionType === 'TEXT'
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                <Type className="w-4 h-4" /> Open Text
              </button>
            </div>
          </div>

          {/* Time Limit Selection */}
          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-slate-400 mb-2">
              Time Limit
            </label>
            <select
              value={newTimeLimit}
              onChange={(e) => setNewTimeLimit(Number(e.target.value))}
              className="w-full bg-navy-950 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-cyan-500"
            >
              {TIME_LIMIT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-navy-950 text-white">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {newQuestionType === 'TEXT' && (
          <div className="mb-6">
            <label className="block text-xs uppercase tracking-widest font-bold text-slate-400 mb-2">
              Max Answers Per Participant
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={newQuestionMaxAnswers}
              onChange={(e) => setNewQuestionMaxAnswers(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full bg-navy-950 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-cyan-500"
            />
          </div>
        )}

        {(newQuestionType === 'MCQ' || newQuestionType === 'POLL') && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {newOptions.map((opt, i) => (
              <div key={i} className="flex items-center gap-3">
                {newQuestionType === 'MCQ' && (
                  <input
                    type="radio"
                    name="correct_answer"
                    checked={correctOptionIndex === i}
                    onChange={() => setCorrectOptionIndex(i)}
                    className="w-5 h-5 accent-cyan-500 cursor-pointer"
                    title="Mark as correct answer"
                  />
                )}
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => {
                    const no = [...newOptions];
                    no[i] = e.target.value;
                    setNewOptions(no);
                  }}
                  placeholder={`Option ${i + 1}`}
                  className={`w-full bg-navy-950 border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors ${
                    newQuestionType === 'MCQ' && correctOptionIndex === i
                      ? 'border-cyan-500'
                      : 'border-white/10 focus:border-cyan-500/50'
                  }`}
                />
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleAddQuestion}
          disabled={!newQuestionText.trim() || isSaving}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-cyan-400 hover:bg-cyan-300 active:bg-cyan-500 disabled:opacity-50 text-navy-950 font-black rounded-xl transition-all shadow-lg shadow-cyan-500/20"
        >
          {isSaving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Save className="w-5 h-5" /> Save Question
            </>
          )}
        </button>
      </div>
    </div>
  );
}

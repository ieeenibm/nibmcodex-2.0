'use client';

import { useState, useEffect, useRef } from 'react';
import useSWR from 'swr';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Plus,
  Save,
  Trash2,
  ListOrdered,
  Loader2,
  Clock,
  Infinity as InfinityIcon,
  Pencil,
  X,
  Upload,
  FileSpreadsheet,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  QrCode,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import Link from 'next/link';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { useToast } from '@/components/ui/Toast';

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
];

interface ImageOption {
  id: string;
  url: string;
  isTarget: boolean;
  label: string;
}

export default function SessionEditorPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const { data: session, isLoading, mutate, error } = useSWR(`/api/admin/sessions/${id}`, fetcher);

  const gameType = session?.gameType || 'QUIZ';

  // Question form state
  const [questionText, setQuestionText] = useState('');
  const [timeLimit, setTimeLimit] = useState<number>(30);
  const [options, setOptions] = useState<string[]>(['', '']);
  const [correctOptionIndex, setCorrectOptionIndex] = useState(0);

  // AI vs Human Image state (1 to 4 images)
  const [imageCandidates, setImageCandidates] = useState<ImageOption[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<{ id: string; text: string } | null>(null);

  const confirmResetSession = async () => {
    setIsResetting(true);
    try {
      const res = await fetch(`/api/admin/sessions/${id}/reset`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to reset session');
      }
      mutate();
      setShowResetModal(false);
      toast.success('Session successfully reset to DRAFT mode!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to reset session');
    } finally {
      setIsResetting(false);
    }
  };

  // CSV Import Modal state
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<string>('');
  const [csvImporting, setCsvImporting] = useState(false);
  const [csvError, setCsvError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.gameType === 'AI_VS_HUMAN' && !questionText) {
      setQuestionText('Which image is AI generated?');
    }
  }, [session?.gameType]);

  const handleStartEdit = (q: any) => {
    setEditingQuestionId(q.id);
    setQuestionText(q.text || '');
    setTimeLimit(q.timeLimit ?? 30);

    if (gameType === 'AI_VS_HUMAN') {
      if (Array.isArray(q.images)) {
        setImageCandidates(q.images);
      }
    } else {
      const opts = Array.isArray(q.options) && q.options.length >= 2 ? [...q.options] : ['', ''];
      setOptions(opts);
      const correctIdx = opts.indexOf(q.correctAnswer);
      setCorrectOptionIndex(correctIdx !== -1 ? correctIdx : 0);
    }

    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingQuestionId(null);
    setQuestionText(gameType === 'AI_VS_HUMAN' ? 'Which image is AI generated?' : '');
    setOptions(['', '']);
    setCorrectOptionIndex(0);
    setImageCandidates([]);
    setTimeLimit(30);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (imageCandidates.length >= 4) {
      toast.warning('Maximum 4 images per question.');
      return;
    }

    setUploadingImage(true);
    setUploadError(null);

    try {
      const result = await uploadImageToCloudinary(file);
      const labels = ['A', 'B', 'C', 'D'];
      const nextIndex = imageCandidates.length;

      const newCandidate: ImageOption = {
        id: result.publicId || `${Date.now()}`,
        url: result.url,
        isTarget: imageCandidates.length === 0, // default first one to target
        label: `Image ${labels[nextIndex] || nextIndex + 1}`,
      };

      setImageCandidates([...imageCandidates, newCandidate]);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload image to Cloudinary');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleSaveQuestion = async () => {
    if (!questionText.trim()) return;

    if (gameType === 'AI_VS_HUMAN') {
      if (imageCandidates.length < 1) {
        toast.warning('Please upload at least 1 image.');
        return;
      }
      const hasTarget = imageCandidates.some((img) => img.isTarget);
      if (!hasTarget) {
        toast.warning('Please select which image is the target correct answer.');
        return;
      }
    } else {
      const filledOptions = options.filter((o) => o.trim() !== '');
      if (filledOptions.length < 2) {
        toast.warning('Please provide at least 2 options for this MCQ question.');
        return;
      }
    }

    setIsSaving(true);
    try {
      const filledOptions = gameType === 'AI_VS_HUMAN' ? null : options.filter((o) => o.trim() !== '');
      const selectedOptionText = options[correctOptionIndex]?.trim();
      const resolvedCorrectAnswer = gameType === 'AI_VS_HUMAN'
        ? imageCandidates.find((img) => img.isTarget)?.id || null
        : (filledOptions && selectedOptionText && filledOptions.includes(selectedOptionText)
            ? selectedOptionText
            : filledOptions?.[0] || null);

      const payload = {
        text: questionText.trim(),
        type: gameType === 'AI_VS_HUMAN' ? 'IMAGE_SELECT' : 'MCQ',
        options: filledOptions,
        images: gameType === 'AI_VS_HUMAN' ? imageCandidates : null,
        correctAnswer: resolvedCorrectAnswer,
        timeLimit,
        maxAnswers: 1,
      };

      if (editingQuestionId) {
        const res = await fetch(`/api/admin/questions/${editingQuestionId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to update question');
        }
        toast.success('Question updated successfully!');
      } else {
        const res = await fetch(`/api/admin/sessions/${id}/questions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to save question');
        }
        toast.success('Question added successfully!');
      }

      handleCancelEdit();
      mutate();
    } catch (error: any) {
      toast.error(error?.message || (editingQuestionId ? 'Failed to update question' : 'Failed to save question'));
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDeleteQuestion = async () => {
    if (!questionToDelete) return;
    setDeletingId(questionToDelete.id);
    try {
      const res = await fetch(`/api/admin/questions/${questionToDelete.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete question');
      }
      mutate();
      toast.success('Question deleted.');
      setQuestionToDelete(null);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete question');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownloadSampleCsv = () => {
    const csvContent =
      'Question,Option 1,Option 2,Option 3,Option 4,Correct Answer\n' +
      '"Which protocol is used for real-time WebSocket communication in Pulse Mini?","HTTP/1.1","Ably WebSockets","FTP","SMTP","2"\n' +
      '"What is the primary language used for styling in Next.js?","Tailwind CSS","C++","Assembly","Java","1"\n' +
      '"Which year is NIBM CodeX celebrating in this edition?","2024","2025","2026","2027","3"\n' +
      '"What is 8 * 9?","70","72","74","76","2"\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'codex_mcq_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvPreview(content);
    };
    reader.readAsText(file);
  };

  const handleImportCsv = async () => {
    if (!csvPreview.trim()) {
      setCsvError('Please select a CSV file first.');
      return;
    }

    setCsvImporting(true);
    setCsvError(null);

    try {
      const res = await fetch(`/api/admin/sessions/${id}/import-csv`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvText: csvPreview }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to import CSV');
      }

      setShowCsvModal(false);
      setCsvFile(null);
      setCsvPreview('');
      mutate();
      toast.success(`Successfully imported ${data.importedCount} questions!`);
    } catch (err: any) {
      setCsvError(err.message || 'Error parsing CSV file');
    } finally {
      setCsvImporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-cyan-400 flex items-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading session editor...
      </div>
    );
  }
  if (error) return <div className="text-red-400">Error: {error.message || 'Failed to load'}</div>;
  if (!session) return <div className="text-red-400">Session not found.</div>;

  return (
    <div className="max-w-5xl mx-auto pb-16">
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 mb-6 transition-colors font-mono text-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Arenas
      </Link>

      {/* Session Metadata Banner */}
      <div className="bg-navy-900 border border-white/10 rounded-2xl p-6 sm:p-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-black text-white">{session.name}</h1>
            <span
              className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md ${
                gameType === 'GOLDEN_TICKET'
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  : gameType === 'AI_VS_HUMAN'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              }`}
            >
              {gameType === 'GOLDEN_TICKET' ? 'GOLDEN TICKET' : gameType === 'AI_VS_HUMAN' ? 'AI VS HUMAN' : 'MCQ ARENA'}
            </span>
          </div>
          <p className="text-slate-400 font-mono text-sm">
            Join PIN: <span className="text-cyan-400 font-black text-xl tracking-wider">{session.joinCode}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowResetModal(true)}
            disabled={isResetting}
            className="px-4 py-3 bg-white/5 hover:bg-yellow-500/20 border border-white/10 hover:border-yellow-500/40 text-slate-300 hover:text-yellow-300 font-bold rounded-xl flex items-center gap-2 transition-all text-sm font-mono disabled:opacity-50 cursor-pointer"
            title="Reset arena: clears responses and participants, returns to DRAFT"
          >
            {isResetting ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
            <span>Reset Arena</span>
          </button>

          {gameType === 'GOLDEN_TICKET' ? (
            <Link
              href={`/admin/host/${id}/golden`}
              className="px-5 py-3 bg-yellow-500 hover:bg-yellow-400 text-navy-950 font-black rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-yellow-500/20 text-sm font-mono"
            >
              <QrCode className="w-4 h-4" /> Open Golden Ticket Arena
            </Link>
          ) : (
            <Link
              href={`/admin/host/${id}`}
              className="px-5 py-3 bg-cyan-400 hover:bg-cyan-300 text-navy-950 font-black rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20 text-sm font-mono"
            >
              <ExternalLink className="w-4 h-4" /> Launch Host Arena
            </Link>
          )}
        </div>
      </div>

      {/* Special View for Golden Ticket */}
      {gameType === 'GOLDEN_TICKET' ? (
        <div className="bg-navy-900 border border-yellow-500/30 rounded-2xl p-8 text-center backdrop-blur-md">
          <QrCode className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white mb-2">Golden Ticket Physical Scavenger Hunt</h2>
          <p className="text-slate-400 max-w-lg mx-auto text-sm mb-6 leading-relaxed">
            This arena does not use multiple choice questions. Instead, physical QR codes are generated, printed, and hidden around the venue for attendees to discover and scan.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href={`/admin/host/${id}/golden`}
              className="px-8 py-3.5 bg-yellow-500 hover:bg-yellow-400 text-navy-950 font-black rounded-xl transition-all shadow-xl shadow-yellow-500/20 font-mono text-sm flex items-center gap-2"
            >
              <span>Manage & Print QR Tickets</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Questions Header with Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Questions ({session.questions?.length || 0})
            </h2>

            {gameType === 'QUIZ' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadSampleCsv}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-slate-300 font-mono flex items-center gap-1.5 transition-colors"
                  title="Download CSV template"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" /> Download Sample CSV
                </button>
                <button
                  onClick={() => setShowCsvModal(true)}
                  className="px-4 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors shadow-lg shadow-cyan-500/10"
                >
                  <Upload className="w-3.5 h-3.5" /> Import CSV
                </button>
              </div>
            )}
          </div>

          {/* Question List */}
          <div className="space-y-4 mb-12">
            {session.questions?.map((q: any, i: number) => (
              <div
                key={q.id}
                className="p-6 bg-navy-900 border border-white/5 rounded-xl flex gap-4 items-start relative group"
              >
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold shrink-0 font-mono">
                  {i + 1}
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs px-2.5 py-0.5 rounded-md bg-white/10 text-slate-300 font-bold font-mono">
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

                  {/* MCQ Options Rendering */}
                  {q.type === 'MCQ' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                      {q.options?.map((opt: string, idx: number) => (
                        <div
                          key={idx}
                          className={`p-2.5 rounded-lg text-sm ${
                            opt === q.correctAnswer
                              ? 'bg-green-500/20 border border-green-500/50 text-green-300 font-bold'
                              : 'bg-white/5 border border-white/5 text-slate-400'
                          }`}
                        >
                          <span className="font-mono text-xs opacity-60 mr-1.5">{String.fromCharCode(65 + idx)}.</span>
                          {opt} {opt === q.correctAnswer && <span className="ml-2">✓</span>}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* AI vs Human Images Rendering */}
                  {q.type === 'IMAGE_SELECT' && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                      {q.images?.map((img: any, idx: number) => (
                        <div
                          key={idx}
                          className={`p-2 rounded-xl border relative overflow-hidden flex flex-col items-center ${
                            img.isTarget || img.id === q.correctAnswer
                              ? 'border-green-500 bg-green-500/10'
                              : 'border-white/10 bg-navy-950'
                          }`}
                        >
                          <img src={img.url} alt={img.label} className="w-full h-28 object-cover rounded-lg mb-2" />
                          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white">
                            <span>{img.label || `Image ${idx + 1}`}</span>
                            {(img.isTarget || img.id === q.correctAnswer) && (
                              <span className="text-green-400 text-[10px] bg-green-500/20 px-1.5 py-0.5 rounded">
                                TARGET
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleStartEdit(q)}
                    className="text-slate-500 hover:text-cyan-400 transition-colors p-2"
                    title="Edit question"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setQuestionToDelete({ id: q.id, text: q.text })}
                    disabled={deletingId === q.id}
                    className="text-slate-500 hover:text-red-400 transition-colors p-2 disabled:opacity-50 cursor-pointer"
                    title="Delete question"
                  >
                    {deletingId === q.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            ))}

            {(!session.questions || session.questions.length === 0) && (
              <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-xl text-slate-500">
                No questions yet. Add one below or import from CSV!
              </div>
            )}
          </div>

          {/* Question Creator Form */}
          <div className="bg-navy-900 border border-cyan-500/30 rounded-2xl p-6 sm:p-8 shadow-[0_0_30px_rgba(34,211,238,0.05)]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {editingQuestionId ? (
                  <>
                    <Pencil className="w-5 h-5 text-cyan-400" /> Edit Question
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 text-cyan-400" /> Add New Question
                  </>
                )}
              </h3>
              {editingQuestionId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center gap-1 font-medium transition-colors"
                >
                  <X className="w-3.5 h-3.5" /> Cancel Edit
                </button>
              )}
            </div>

            {/* Question Text */}
            <input
              type="text"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder={gameType === 'AI_VS_HUMAN' ? 'e.g. Which artwork is generated by AI?' : 'Type your question here...'}
              className="w-full bg-navy-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 mb-6 font-bold"
            />

            {/* Time Limit Selector */}
            <div className="mb-6">
              <label className="block text-xs uppercase tracking-widest font-mono font-bold text-slate-400 mb-2">
                Time Limit
              </label>
              <select
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                className="w-full bg-navy-950 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-cyan-500"
              >
                {TIME_LIMIT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-navy-950 text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* AI VS HUMAN: Cloudinary Image Uploads (1 to 4 Images) */}
            {gameType === 'AI_VS_HUMAN' ? (
              <div className="mb-6">
                <label className="block text-xs uppercase tracking-widest font-mono font-bold text-slate-400 mb-2">
                  Candidate Images (Min 1, Max 4) — Cloudinary Auto-Optimized
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  {imageCandidates.map((img, i) => (
                    <div
                      key={img.id}
                      className={`p-3 rounded-xl border relative flex flex-col items-center group transition-all ${
                        img.isTarget ? 'border-green-500 bg-green-500/10' : 'border-white/10 bg-navy-950'
                      }`}
                    >
                      <img src={img.url} alt={img.label} className="w-full h-32 object-cover rounded-lg mb-3 shadow" />

                      <div className="w-full flex items-center justify-between">
                        <label className="flex items-center gap-1.5 text-xs text-slate-300 font-mono cursor-pointer">
                          <input
                            type="radio"
                            name="target_image"
                            checked={img.isTarget}
                            onChange={() => {
                              setImageCandidates(
                                imageCandidates.map((candidate, idx) => ({
                                  ...candidate,
                                  isTarget: idx === i,
                                }))
                              );
                            }}
                            className="accent-green-500"
                          />
                          <span>Target Answer</span>
                        </label>

                        <button
                          type="button"
                          onClick={() => {
                            setImageCandidates(imageCandidates.filter((_, idx) => idx !== i));
                          }}
                          className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                          title="Remove image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Upload Tile */}
                  {imageCandidates.length < 4 && (
                    <label className="border-2 border-dashed border-white/20 hover:border-cyan-400/50 rounded-xl flex flex-col items-center justify-center p-4 cursor-pointer bg-navy-950/50 hover:bg-cyan-500/5 transition-all min-h-[160px]">
                      {uploadingImage ? (
                        <div className="text-center text-cyan-400 text-xs font-mono">
                          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                          <span>Uploading & Optimizing...</span>
                        </div>
                      ) : (
                        <>
                          <ImageIcon className="w-8 h-8 text-cyan-400 mb-2" />
                          <span className="text-xs font-bold text-white text-center">Add Image</span>
                          <span className="text-[10px] text-slate-500 font-mono text-center mt-1">&lt; 10MB Cloudinary</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingImage}
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {uploadError && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 p-2 font-mono">{uploadError}</p>}
              </div>
            ) : (
              /* CLASSIC MCQ: 2 to 6 Options */
              <div className="mb-6">
                <label className="block text-xs uppercase tracking-widest font-mono font-bold text-slate-400 mb-2">
                  Multiple Choice Options (Mark radio for Correct Answer)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                  {options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="correct_answer"
                        checked={correctOptionIndex === i}
                        onChange={() => setCorrectOptionIndex(i)}
                        className="w-5 h-5 accent-cyan-500 cursor-pointer"
                        title="Mark as correct answer"
                      />
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const no = [...options];
                          no[i] = e.target.value;
                          setOptions(no);
                        }}
                        placeholder={`Option ${String.fromCharCode(65 + i)}`}
                        className={`w-full bg-navy-950 border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors ${
                          correctOptionIndex === i ? 'border-cyan-500' : 'border-white/10 focus:border-cyan-500/50'
                        }`}
                      />
                      {options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => {
                            const no = options.filter((_, idx) => idx !== i);
                            setOptions(no);
                            if (correctOptionIndex >= no.length) setCorrectOptionIndex(Math.max(0, no.length - 1));
                          }}
                          className="text-slate-500 hover:text-red-400 transition-colors p-1 shrink-0"
                          title="Remove option"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {options.length < 6 && (
                  <button
                    type="button"
                    onClick={() => setOptions([...options, ''])}
                    className="flex items-center gap-1.5 text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors font-mono"
                  >
                    <Plus className="w-4 h-4" /> Add Option
                  </button>
                )}
              </div>
            )}

            <button
              onClick={handleSaveQuestion}
              disabled={!questionText.trim() || isSaving}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-cyan-400 hover:bg-cyan-300 active:bg-cyan-500 disabled:opacity-50 text-navy-950 font-black rounded-xl transition-all shadow-lg shadow-cyan-500/20 text-base"
            >
              {isSaving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : editingQuestionId ? (
                <>
                  <Save className="w-5 h-5" /> Update Question
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" /> Save Question
                </>
              )}
            </button>
          </div>
        </>
      )}

      {/* CSV Import Modal */}
      {showCsvModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-navy-900 border border-white/15 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-cyan-400" />
                <h3 className="text-xl font-bold text-white">Import Questions via CSV</h3>
              </div>
              <button onClick={() => setShowCsvModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Upload a standard spreadsheet or CSV file. The format should contain:
              <br />
              <code className="text-cyan-300 font-mono text-[11px] block mt-1 bg-navy-950 p-2 rounded">
                Question, Option 1, Option 2, Option 3, Option 4, Correct Answer (1-4)
              </code>
            </p>

            <div className="mb-4">
              <label className="border-2 border-dashed border-white/20 hover:border-cyan-400/50 rounded-xl flex flex-col items-center justify-center p-6 cursor-pointer bg-navy-950/50 transition-all">
                <Upload className="w-8 h-8 text-cyan-400 mb-2" />
                <span className="text-sm font-bold text-white">
                  {csvFile ? csvFile.name : 'Select CSV file from computer'}
                </span>
                <span className="text-xs text-slate-500 mt-1">.csv UTF-8 format</span>
                <input type="file" accept=".csv,text/csv" onChange={handleCsvFileChange} className="hidden" />
              </label>
            </div>

            {csvError && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 p-2.5 rounded-lg mb-4 font-mono">
                {csvError}
              </p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleDownloadSampleCsv}
                className="py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-mono text-xs rounded-xl transition-colors"
              >
                Sample CSV
              </button>
              <button
                type="button"
                onClick={handleImportCsv}
                disabled={csvImporting || !csvPreview}
                className="flex-1 py-3 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-navy-950 font-black rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
              >
                {csvImporting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Importing...</span>
                  </>
                ) : (
                  <span>Import Questions</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Confirm Modals */}
      <ConfirmModal
        isOpen={!!questionToDelete}
        title="Delete Question?"
        description={
          questionToDelete ? (
            <span>
              Are you sure you want to delete this question: <strong className="text-white">"{questionToDelete.text}"</strong>? This action cannot be undone.
            </span>
          ) : ''
        }
        confirmText="Delete Question"
        cancelText="Cancel"
        variant="danger"
        isLoading={!!deletingId}
        onConfirm={confirmDeleteQuestion}
        onCancel={() => setQuestionToDelete(null)}
      />

      <ConfirmModal
        isOpen={showResetModal}
        title={`Reset "${session?.name}"?`}
        description={
          <div className="space-y-2">
            <p>
              Are you sure you want to reset <strong className="text-white">"{session?.name}"</strong>?
            </p>
            <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
              <li>All participant responses and scores will be deleted.</li>
              <li>The room will return to <span className="text-cyan-400 font-bold">DRAFT</span> mode.</li>
              <li>All questions and candidate images remain intact.</li>
            </ul>
          </div>
        }
        confirmText="Reset Arena"
        cancelText="Cancel"
        variant="danger"
        isLoading={isResetting}
        onConfirm={confirmResetSession}
        onCancel={() => setShowResetModal(false)}
      />
    </div>
  );
}

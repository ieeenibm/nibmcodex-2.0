'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md">
        <div className="font-mono text-red-400 text-sm tracking-widest uppercase mb-6">System Error</div>
        <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter">
          Something <span className="text-red-400">Broke</span>
        </h1>
        <p className="text-slate-400 text-lg mb-10 leading-relaxed">
          An unexpected error occurred. Our grid is recalibrating.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center justify-center px-8 py-4 bg-cyan-500 text-navy-950 font-bold uppercase tracking-widest clip-slanted transition-transform active:scale-95 hover:bg-cyan-400"
        >
          Try Again
        </button>
      </div>
    </main>
  );
}

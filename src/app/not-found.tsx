import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md">
        <div className="font-mono text-cyan-400 text-sm tracking-widest uppercase mb-6">Error 404</div>
        <h1 className="text-6xl md:text-8xl font-black text-white mb-4 tracking-tighter">
          <span className="text-gradient-cyan">Lost</span> in the Grid
        </h1>
        <p className="text-slate-400 text-lg mb-10 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-8 py-4 bg-cyan-500 text-navy-950 font-bold uppercase tracking-widest clip-slanted transition-transform active:scale-95 hover:bg-cyan-400"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}

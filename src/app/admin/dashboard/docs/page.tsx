import { BookOpen, Gamepad2, Settings, Users, Zap, AlertTriangle } from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      <header className="border-b border-white/10 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-bold tracking-wider mb-4">
          <BookOpen className="w-4 h-4" />
          OFFICIAL DOCUMENTATION
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight">Pulse Mini Guide</h1>
        <p className="text-slate-400 mt-2 text-lg">
          Everything you need to know to create, manage, and host live interactive sessions.
        </p>
      </header>

      <section className="bg-navy-900/40 border border-white/5 rounded-2xl p-6 md:p-8 space-y-6 clip-slanted">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Settings className="text-cyan-400 w-6 h-6" /> 1. Creating a Session
        </h2>
        <div className="space-y-4 text-slate-300">
          <p>
            To start a game, you must first create a <strong>Session</strong>. Sessions act as lobbies where players gather before the game begins.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Name:</strong> The title of the session (e.g., "AI Workshop Quiz").</li>
            <li><strong>Mode:</strong> 
              <br/>- <em>Competitive:</em> Players score points for correct answers based on speed and streaks. A leaderboard is generated at the end.
              <br/>- <em>Non-Competitive:</em> A relaxed mode for polling and gathering feedback. No points or leaderboards.
            </li>
          </ul>
        </div>
      </section>

      <section className="bg-navy-900/40 border border-white/5 rounded-2xl p-6 md:p-8 space-y-6 clip-slanted">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Gamepad2 className="text-cyan-400 w-6 h-6" /> 2. Adding Questions
        </h2>
        <div className="space-y-4 text-slate-300">
          <p>
            Once a session is created, click on it in the dashboard to open the <strong>Session Editor</strong>. Here you can add questions.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Multiple Choice (MCQ):</strong> Up to 4 options. In competitive mode, you must select exactly one correct answer.</li>
            <li><strong>Open Text (TEXT):</strong> Participants type their answers. Cannot be scored automatically.</li>
            <li><strong>Live Poll (POLL):</strong> Like MCQ, but there is no "correct" answer. Used for voting.</li>
          </ul>
          <div className="bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-xl mt-4">
            <strong>Time Limits:</strong> You can set a time limit (10s to 120s) for each question. If you set it to <strong>0s (Untimed)</strong>, the question will stay open until you manually proceed. Non-competitive questions default to untimed.
          </div>
        </div>
      </section>

      <section className="bg-navy-900/40 border border-white/5 rounded-2xl p-6 md:p-8 space-y-6 clip-slanted">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Users className="text-cyan-400 w-6 h-6" /> 3. Hosting the Arena
        </h2>
        <div className="space-y-4 text-slate-300">
          <p>
            When you are ready, click <strong>"Open Host Arena"</strong>.
          </p>
          <ol className="list-decimal pl-6 space-y-3">
            <li><strong>Lobby State:</strong> The arena opens in a Draft state. A large QR code and Join Code are displayed. Tell the audience to scan the QR code to join.</li>
            <li><strong>Start Arena:</strong> Once enough players have joined (indicated by the live counter), click Start Arena.</li>
            <li><strong>Live Gameplay:</strong> The first question appears. If it is timed, the countdown begins immediately. If untimed, it stays open.</li>
            <li><strong>Reveal Answer:</strong> In competitive mode, click "Reveal Answer" to show the correct option before moving to the next question.</li>
            <li><strong>Next Question:</strong> Moves the arena to the next question. The game ends automatically after the final question.</li>
          </ol>
        </div>
      </section>

      <section className="bg-navy-900/40 border border-white/5 rounded-2xl p-6 md:p-8 space-y-6 clip-slanted">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Zap className="text-cyan-400 w-6 h-6" /> 4. Scoring & Gamification
        </h2>
        <div className="space-y-4 text-slate-300">
          <p>
            Pulse Mini utilizes an advanced Server-Sent Events (SSE) scoring engine to calculate points dynamically in Competitive mode.
          </p>
          <ul className="list-none space-y-4">
            <li className="bg-navy-950 p-4 rounded-xl border border-white/5">
              <strong className="text-white block mb-1">Base Score</strong>
              Correct answers award a flat 1000 points.
            </li>
            <li className="bg-navy-950 p-4 rounded-xl border border-white/5">
              <strong className="text-white block mb-1">Speed Bonus</strong>
              The faster a participant answers, the more bonus points they get. The bonus scales linearly based on the remaining time, up to an extra 1000 points.
            </li>
            <li className="bg-navy-950 p-4 rounded-xl border border-white/5">
              <strong className="text-white block mb-1">Streak Multiplier</strong>
              Consecutive correct answers build a streak. The multiplier caps at <strong>2.5x</strong>. Answering incorrectly resets the streak to 0.
              <br/>
              <em>Formula: Total Points = (Base Score + Speed Bonus) × Streak Multiplier</em>
            </li>
          </ul>
        </div>
      </section>

      <section className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-6 md:p-8 space-y-4 clip-slanted">
        <h2 className="text-xl font-bold text-orange-400 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" /> Host Best Practices
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-orange-200/80 text-sm">
          <li><strong>DO NOT</strong> refresh the host screen during an active countdown timer, as it may cause slight desyncs in the host's visual timer.</li>
          <li><strong>Ensure a stable internet connection.</strong> Pulse Mini relies on real-time SSE streams. If the connection drops, it will automatically fallback to SWR polling, which is slower.</li>
          <li><strong>Use Untimed mode</strong> if you expect your audience to have poor cellular connections, ensuring everyone gets a chance to vote.</li>
        </ul>
      </section>

    </div>
  );
}

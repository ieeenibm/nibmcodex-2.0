'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  Download,
  ExternalLink,
  Printer,
  Copy,
  Check,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  BookOpen,
  FileText,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  CheckSquare,
  Square,
  Coffee,
  Laptop,
  Wifi,
  Award,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';

const RULEBOOK_PAGES = [
  { id: 1, title: 'Event at a Glance & Eligibility', image: '/rulebook/page-1.webp' },
  { id: 2, title: 'Registration & Credentials', image: '/rulebook/page-2.webp' },
  { id: 3, title: 'Competition Rules & Conduct', image: '/rulebook/page-3.webp' },
  { id: 4, title: 'At the NIBM Venue & Amenities', image: '/rulebook/page-4.webp' },
  { id: 5, title: 'Quick Reference & Checklist', image: '/rulebook/page-5.webp' },
];

const AMBASSADOR_CODE = 'IEEEXTREME20SB10274';
const PROCTOR_NAME = 'Mr. Yohan Weerasinghe';

const PRE_ARRIVAL_ITEMS = [
  { id: 'item-1', text: 'Bring your laptop suitable for programming' },
  { id: 'item-2', text: 'Bring your laptop adapter / charger and personal essentials' },
  { id: 'item-3', text: 'Have your IEEE membership and registration details available' },
  { id: 'item-4', text: 'Arrive on time and complete venue check-in' },
  { id: 'item-5', text: 'Keep your workspace and shared areas organized' },
  { id: 'item-6', text: 'Pack everything needed before the 6:00 PM departure restriction' },
];

const AMENITIES = [
  { label: 'Breakfast', desc: 'Day 1 morning' },
  { label: 'Lunch', desc: 'Afternoon fuel' },
  { label: 'Dinner', desc: 'Evening meal' },
  { label: 'Midnight Snacks', desc: 'Late night coding boost' },
  { label: 'Next Day Breakfast', desc: 'Closing morning' },
  { label: 'Coffee Machine', desc: 'Continuous access' },
  { label: 'Resting Area', desc: 'Designated chill zone' },
  { label: 'Official Swags', desc: 'Exclusive participant pack' },
];

const OFFICIAL_RESOURCES = [
  { title: 'Official Competition Rules', url: 'https://ieeextreme.org/rules/' },
  { title: 'Student & Team Eligibility', url: 'https://ieeextreme.org/eligibility/' },
  { title: 'Registration Tips & FAQs', url: 'https://ieeextreme.org/registration-tips/' },
  { title: 'Proctor Requirements', url: 'https://ieeextreme.org/proctor-eligibility-and-requirements/' },
];

export default function RulebookView() {
  const [activeTab, setActiveTab] = useState<'interactive' | 'document'>('interactive');
  const [currentPage, setCurrentPage] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [copiedAmbassador, setCopiedAmbassador] = useState(false);
  const [copiedProctor, setCopiedProctor] = useState(false);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem('nibmcodex_rulebook_checklist');
      if (saved) setChecklist(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  const toggleChecklistItem = (id: string) => {
    const next = { ...checklist, [id]: !checklist[id] };
    setChecklist(next);
    try {
      localStorage.setItem('nibmcodex_rulebook_checklist', JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const copyToClipboard = async (text: string, type: 'ambassador' | 'proctor') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'ambassador') {
        setCopiedAmbassador(true);
        setTimeout(() => setCopiedAmbassador(false), 2000);
      } else {
        setCopiedProctor(true);
        setTimeout(() => setCopiedProctor(false), 2000);
      }
    } catch {
      if (type === 'ambassador') setCopiedAmbassador(true);
      else setCopiedProctor(true);
    }
  };

  const completedCount = PRE_ARRIVAL_ITEMS.filter((item) => checklist[item.id]).length;
  const progressPercent = Math.round((completedCount / PRE_ARRIVAL_ITEMS.length) * 100);

  return (
    <div className="w-full space-y-12">
      {/* Top Header Block - Native NIBMCodeX Style */}
      <div className="relative">
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[650px] h-[300px] bg-cyan-500/10 blur-[130px] pointer-events-none rounded-full" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-white/10">
          <div className="space-y-4 max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 border border-white/10 text-cyan-400 text-xs font-mono uppercase tracking-[0.2em] rounded-full glass-panel-light">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              NIBMCodeX 2.0 • IEEEXtreme 20.0
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tighter leading-tight">
              Physical Participation <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-200">
                Official Rulebook
              </span>
            </h1>

            <p className="text-slate-400 text-base md:text-lg max-w-2xl font-light leading-relaxed">
              Official on-site guidelines, competition regulations, registration credentials, and venue checklist for the 24-hour challenge at the NIBM Auditorium Colombo.
            </p>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="text-cyan-400 font-semibold">THINK. CODE. COMPETE. CONQUER.</span>
              <span className="text-slate-600">•</span>
              <span>October 31 – November 1, 2026</span>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="/api/rulebook/download"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-400 hover:bg-cyan-300 text-navy-950 font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.25)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] group cursor-pointer"
            >
              <Download className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
              <span>Download PDF</span>
              <span className="text-[10px] font-mono opacity-70 bg-navy-950/20 px-1.5 py-0.5 rounded-full">2.5 MB</span>
            </a>

            <a
              href="/rulebook.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full glass-panel-light text-slate-300 hover:text-white hover:bg-white/10 text-xs font-mono uppercase tracking-wider transition-all duration-300 border border-white/10 hover:border-cyan-400/30"
            >
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              <span>Open in Tab</span>
            </a>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-full glass-panel-light text-slate-300 hover:text-white hover:bg-white/10 text-xs font-mono uppercase tracking-wider transition-all duration-300 border border-white/10 hover:border-cyan-400/30 cursor-pointer"
              title="Print Rulebook"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs - Exactly matching GalleryHub */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('interactive')}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                activeTab === 'interactive'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.15)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
              }`}
            >
              <BookOpen size={15} />
              <span>Interactive Rulebook</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('document')}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                activeTab === 'document'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.15)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
              }`}
            >
              <FileText size={15} />
              <span>Official Document (5 Pages)</span>
            </button>
          </div>

          <span className="text-xs font-mono text-slate-500">
            Document: <span className="text-slate-300 font-medium">NIBMCodex2.0_Rulebook_VF.pdf</span>
          </span>
        </div>
      </div>

      {/* Mode 1: Interactive Rulebook */}
      {activeTab === 'interactive' && (
        <div className="space-y-12">
          {/* Section 05: Registration Credentials Spotlight */}
          <div className="relative glass-panel rounded-2xl border border-cyan-400/30 p-6 sm:p-8 overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              <div className="space-y-1.5">
                <span className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles size={14} className="text-cyan-400" />
                  Section 05 • Keep Handy During Registration
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Official NIBM Registration Credentials
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 font-light max-w-xl">
                  Use these credentials strictly when requested during official IEEEXtreme / vTools platform registration.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 shrink-0">
                {/* Ambassador ID */}
                <div className="p-3.5 rounded-xl bg-navy-950/80 border border-white/10 flex items-center justify-between gap-4 min-w-[240px]">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                      Ambassador ID
                    </span>
                    <span className="text-xs font-mono font-bold text-cyan-300 tracking-wider block mt-0.5">
                      {AMBASSADOR_CODE}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(AMBASSADOR_CODE, 'ambassador')}
                    className="p-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 transition-colors cursor-pointer border border-cyan-400/20"
                    title="Copy Ambassador ID"
                  >
                    {copiedAmbassador ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                </div>

                {/* Proctor Name */}
                <div className="p-3.5 rounded-xl bg-navy-950/80 border border-white/10 flex items-center justify-between gap-4 min-w-[240px]">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                      Confirmed Proctor
                    </span>
                    <span className="text-xs font-bold text-white tracking-wide block mt-0.5">
                      {PROCTOR_NAME}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(PROCTOR_NAME, 'proctor')}
                    className="p-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 transition-colors cursor-pointer border border-cyan-400/20"
                    title="Copy Proctor Name"
                  >
                    {copiedProctor ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 01 & 02: Overview & Eligibility */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 01 Event at a Glance */}
            <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                <span className="font-mono text-xs font-bold text-cyan-400">01 /</span>
                <h2 className="text-lg font-bold text-white tracking-tight">Event at a Glance</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center shrink-0 text-cyan-400 mt-0.5">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-500 block">Date</span>
                    <span className="text-sm font-semibold text-white">31 October 2026</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center shrink-0 text-cyan-400 mt-0.5">
                    <Clock size={16} />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-500 block">Competition Window (24 Hours)</span>
                    <span className="text-sm font-semibold text-white">
                      5:30 AM on 31 October 2026 to 5:30 AM on 1 November 2026
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center shrink-0 text-cyan-400 mt-0.5">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-500 block">Physical Venue</span>
                    <span className="text-sm font-semibold text-white">NIBM Auditorium, Colombo 07</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 font-light leading-relaxed pt-2 border-t border-white/5">
                  IEEEXtreme is a global 24-hour virtual programming challenge for eligible IEEE Student and Graduate Student members hosted on-site at NIBM.
                </p>
              </div>
            </div>

            {/* 02 Eligibility & Team Size */}
            <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                <span className="font-mono text-xs font-bold text-cyan-400">02 /</span>
                <h2 className="text-lg font-bold text-white tracking-tight">Eligibility & Team Size</h2>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-navy-950/80 border border-white/5">
                <div className="text-3xl font-black font-mono text-cyan-400 tracking-tighter">
                  1–3
                </div>
                <div className="text-xs text-slate-300 leading-tight">
                  <strong className="text-white block font-semibold mb-0.5">Members per Team</strong>
                  Form your squad of up to 3 active IEEE student members.
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-400 font-light">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span>All members must be IEEE Student or Graduate Student members.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span>Maximum 2 Graduate Student members permitted per team.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span>All team members must be over 18 at registration.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span>Valid IEEE membership numbers are mandatory for all participants.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span>Universities and colleges may register multiple teams.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 03 & 04: Registration Requirements & Process */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-2">
              <div>
                <span className="font-mono text-xs font-bold text-cyan-400">03 & 04 /</span>
                <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
                  Registration Requirements & Process
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400">Official vTools / IEEEXtreme Platform</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  Key Requirements
                </h3>
                <ul className="space-y-2 text-xs text-slate-400 font-light">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span>Only registered team members may participate.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                    <span className="text-red-300">Substituting an unregistered person is prohibited and leads to disqualification.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span>A proctor must be selected during registration.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span>A confirmed Proctor of Record is required for official ranking, prizes, and certificates.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span>The team leader should verify proctor confirmation prior to competition day.</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  What to Have Ready
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['Team Name', 'School / University', 'Country', 'Member Details', 'IEEE Numbers', 'Proctor Selection'].map((item) => (
                    <span key={item} className="px-3 py-1.5 rounded-full glass-panel-light text-xs font-mono text-cyan-300 border border-white/5">
                      {item}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-slate-400 font-light leading-relaxed pt-2">
                  After selecting your school on the registration portal, the form displays a proctor list for that school when available.
                  Official guidance also allows teams to enter the proctor&apos;s IEEE membership number directly.
                </p>
              </div>
            </div>
          </div>

          {/* Section 06, 07, 08, 09: Competition Rules & Integrity */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                <span className="font-mono text-xs font-bold text-cyan-400">06 /</span>
                <h3 className="text-sm font-bold text-white tracking-tight">Core Competition Rules</h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-400 font-light">
                <li>• 24-hour continuous contest following the official UTC schedule.</li>
                <li>• Teams must be proctored throughout the entire competition.</li>
                <li>• Only registered team members may work on submissions.</li>
                <li>• Problems must be solved independently without outside assistance.</li>
                <li>• Proctors may help with the platform interface, but not with problem-solving.</li>
              </ul>
            </div>

            <div className="glass-panel rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                <span className="font-mono text-xs font-bold text-cyan-400">07 /</span>
                <h3 className="text-sm font-bold text-white tracking-tight">Plagiarism & Collaboration</h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-400 font-light">
                <li>• Do not share your submission, in whole or in part, with another team.</li>
                <li>• Do not receive assistance from other teams or outside persons.</li>
                <li>• Inappropriate collaboration during the contest is prohibited.</li>
                <li>• Properly cite and reference external fixed libraries or algorithms.</li>
              </ul>
            </div>

            <div className="glass-panel rounded-2xl p-6 space-y-3 border-red-500/20">
              <div className="flex items-center gap-2 pb-2 border-b border-red-500/20">
                <span className="font-mono text-xs font-bold text-red-400">08 & 09 /</span>
                <h3 className="text-sm font-bold text-white tracking-tight">Disqualification & Issues</h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-400 font-light">
                <li>• Automated plagiarism checks are run on all code submissions.</li>
                <li>• Code reuse without proper referencing leads to disqualification.</li>
                <li>• Sharing code between teams is strictly prohibited.</li>
                <li className="pt-2 text-amber-300 font-medium border-t border-white/5">
                  ⚠️ If laptop, Wi-Fi, browser, or contest platform malfunctions, notify NIBMCodeX 2.0 staff/proctor immediately.
                </li>
              </ul>
            </div>
          </div>

          {/* Section 10, 11, 12, 13, 14: At the NIBM Venue */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-2">
              <div>
                <span className="font-mono text-xs font-bold text-cyan-400">10, 11, 12, 13 & 14 /</span>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
                  At the NIBM Venue
                </h2>
              </div>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-400/20 px-3 py-1 rounded-full">
                Physical Event Rules & Amenities
              </span>
            </div>

            {/* 3 Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-4 rounded-xl bg-navy-950/80 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider">
                  <MapPin size={15} />
                  <span>Arrival & Venue</span>
                </div>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  Arrive on time, complete check-in, remain within the designated competition area, and follow organizer/proctor instructions.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-navy-950/80 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider">
                  <Laptop size={15} />
                  <span>What to Bring</span>
                </div>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  Laptop suitable for programming, original laptop charger/adapter, extension cord, and personal essentials for 24 hours.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-navy-950/80 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider">
                  <Wifi size={15} />
                  <span>Connectivity</span>
                </div>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  Dedicated Institute Wi-Fi access will be provided for all participants throughout the competition venue.
                </p>
              </div>
            </div>

            {/* Amenities Grid */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Coffee size={15} className="text-cyan-400" />
                <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  What Participants Will Get
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {AMENITIES.map((item) => (
                  <div
                    key={item.label}
                    className="p-3.5 rounded-xl glass-panel-light border border-white/5 hover:border-cyan-400/30 transition-all"
                  >
                    <span className="text-xs font-semibold text-white block">{item.label}</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Critical 6 PM Notice */}
            <div className="p-4 sm:p-5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3.5">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <strong className="text-amber-300 font-bold block uppercase tracking-wide">
                  CRITICAL VENUE RESTRICTION: 6:00 PM DEPARTURE POLICY
                </strong>
                <p className="text-slate-300 font-light leading-relaxed">
                  Leaving premises after <strong className="text-white font-medium">6:00 PM</strong> is strictly not acceptable.
                  Ensure you bring all necessary adapters, essentials, and clothing before venue doors close at 6:00 PM.
                </p>
              </div>
            </div>
          </div>

          {/* Section 15: Certificates & Interactive Checklist */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Certificates */}
            <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                <Award size={16} className="text-cyan-400" />
                <h3 className="text-lg font-bold text-white tracking-tight">Certificates & Active Status</h3>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-navy-950/80 border border-white/5 space-y-1.5">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                    1. IEEE Global E-Certificate
                  </span>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">
                    Participants will be eligible to get an official E-Certificate from IEEE if obtained more than 0 marks in the competition.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-navy-950/80 border border-white/5 space-y-1.5">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                    2. Physical NIBM Certificate
                  </span>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">
                    A physical certificate of active participation will be officially issued by NIBM to active participants completing the on-site event.
                  </p>
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <CheckSquare size={16} className="text-cyan-400" />
                  <h3 className="text-lg font-bold text-white tracking-tight">Before You Arrive Checklist</h3>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-400">
                  {completedCount}/{PRE_ARRIVAL_ITEMS.length} ({progressPercent}%)
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 rounded-full bg-navy-950 overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-sky-400 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="space-y-2">
                {PRE_ARRIVAL_ITEMS.map((item) => {
                  const isChecked = Boolean(checklist[item.id]);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleChecklistItem(item.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                        isChecked
                          ? 'bg-cyan-500/10 border-cyan-400/30 text-white'
                          : 'bg-navy-950/60 border-white/5 text-slate-400 hover:border-white/20'
                      }`}
                    >
                      <span className="mt-0.5 shrink-0 text-cyan-400">
                        {isChecked ? <CheckSquare size={15} /> : <Square size={15} />}
                      </span>
                      <span className={`text-xs ${isChecked ? 'line-through text-slate-500' : 'font-light'}`}>
                        {item.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Official IEEE Sources */}
          <div className="glass-panel rounded-2xl p-6">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-4">
              Official IEEE Competition Sources
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {OFFICIAL_RESOURCES.map((res) => (
                <a
                  key={res.title}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl glass-panel-light border border-white/5 hover:border-cyan-400/30 text-xs text-slate-300 hover:text-white transition-all flex items-center justify-between group"
                >
                  <span className="font-light pr-2">{res.title}</span>
                  <ArrowUpRight size={14} className="text-cyan-400 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Official Document Viewer */}
      {activeTab === 'document' && (
        <div className="space-y-6">
          {/* Stepper matching GalleryHub sub-filter style */}
          <div className="flex flex-wrap items-center justify-between glass-panel p-3.5 rounded-2xl gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {RULEBOOK_PAGES.map((page) => (
                <button
                  key={page.id}
                  type="button"
                  onClick={() => setCurrentPage(page.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                    currentPage === page.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_12px_rgba(34,211,238,0.2)]'
                      : 'glass-panel-light text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  Page {page.id}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-2 rounded-full glass-panel-light text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:text-white cursor-pointer"
                title="Previous page"
              >
                <ChevronLeft size={16} />
              </button>

              <span className="text-xs font-mono text-slate-400 px-2">
                {currentPage} / {RULEBOOK_PAGES.length}
              </span>

              <button
                type="button"
                disabled={currentPage === RULEBOOK_PAGES.length}
                onClick={() => setCurrentPage((p) => Math.min(RULEBOOK_PAGES.length, p + 1))}
                className="p-2 rounded-full glass-panel-light text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:text-white cursor-pointer"
                title="Next page"
              >
                <ChevronRight size={16} />
              </button>

              <button
                type="button"
                onClick={() => setIsZoomed(true)}
                className="p-2 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 hover:text-white cursor-pointer"
                title="Fullscreen zoom"
              >
                <Maximize2 size={16} />
              </button>
            </div>
          </div>

          {/* Document Preview Canvas */}
          <div className="relative glass-panel rounded-2xl p-4 sm:p-8 flex flex-col items-center justify-center">
            <div
              className="relative max-w-4xl w-full aspect-[819/1024] rounded-xl overflow-hidden border border-white/10 shadow-2xl cursor-pointer group"
              onClick={() => setIsZoomed(true)}
            >
              <Image
                src={RULEBOOK_PAGES[currentPage - 1].image}
                alt={`IEEEXtreme 20.0 Rulebook - ${RULEBOOK_PAGES[currentPage - 1].title}`}
                fill
                priority
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 850px"
              />

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="px-4 py-2 rounded-full bg-navy-950/90 border border-cyan-400/40 text-cyan-400 font-mono text-xs flex items-center gap-2">
                  <Maximize2 size={14} /> Click to expand fullscreen
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between w-full max-w-4xl text-xs font-mono text-slate-500">
              <span>{RULEBOOK_PAGES[currentPage - 1].title}</span>
              <span>Official 5-Page Participation Document</span>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox / Zoom Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col p-4 sm:p-6"
            onClick={() => setIsZoomed(false)}
          >
            <div className="flex items-center justify-between pb-3 text-white">
              <span className="font-mono text-xs uppercase tracking-wider text-cyan-400">
                Page {currentPage} of {RULEBOOK_PAGES.length} • {RULEBOOK_PAGES[currentPage - 1].title}
              </span>

              <button
                type="button"
                onClick={() => setIsZoomed(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div
              className="relative flex-1 w-full flex items-center justify-center p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full max-w-5xl">
                <Image
                  src={RULEBOOK_PAGES[currentPage - 1].image}
                  alt={`Enlarged page ${currentPage}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 pt-3 text-white font-mono text-xs">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentPage((p) => Math.max(1, p - 1));
                }}
                className="px-4 py-1.5 rounded-full glass-panel-light disabled:opacity-30 cursor-pointer"
              >
                Previous
              </button>
              <span className="text-slate-400">{currentPage} / {RULEBOOK_PAGES.length}</span>
              <button
                type="button"
                disabled={currentPage === RULEBOOK_PAGES.length}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentPage((p) => Math.min(RULEBOOK_PAGES.length, p + 1));
                }}
                className="px-4 py-1.5 rounded-full glass-panel-light disabled:opacity-30 cursor-pointer"
              >
                Next
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

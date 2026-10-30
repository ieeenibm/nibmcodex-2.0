'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  Download,
  ExternalLink,
  Printer,
  Copy,
  Check,
  Calendar,
  Clock,
  MapPin,
  Users,
  ShieldAlert,
  Coffee,
  Wifi,
  Laptop,
  Award,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  FileText,
  BookOpen,
  Sparkles,
  CheckSquare,
  Square,
  HelpCircle
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
  { id: 'item-1', text: 'Bring your laptop suitable for programming.' },
  { id: 'item-2', text: 'Bring your laptop adapter / charger and personal essentials.' },
  { id: 'item-3', text: 'Have your IEEE membership and registration details available.' },
  { id: 'item-4', text: 'Arrive on time and complete venue check-in.' },
  { id: 'item-5', text: 'Keep workspace and shared areas organized.' },
  { id: 'item-6', text: 'Pack everything needed before the 6:00 PM departure restriction.' },
];

const AMENITIES = [
  { label: 'Breakfast', desc: 'Day 1 morning' },
  { label: 'Lunch', desc: 'Afternoon fuel' },
  { label: 'Dinner', desc: 'Evening meal' },
  { label: 'Midnight Snacks', desc: 'Late night coding boost' },
  { label: 'Next Day Breakfast', desc: 'Closing morning' },
  { label: 'Coffee Machine', desc: 'Continuous caffeine access' },
  { label: 'Resting Area', desc: 'Designated chill zone' },
  { label: 'Official Swags', desc: 'Exclusive participant pack' },
];

const OFFICIAL_RESOURCES = [
  { title: 'Official Competition Rules', url: 'https://ieeextreme.org/rules/' },
  { title: 'Student & Team Eligibility', url: 'https://ieeextreme.org/eligibility/' },
  { title: 'Registration Tips & FAQs', url: 'https://ieeextreme.org/registration-tips/' },
  { title: 'Proctor Eligibility Requirements', url: 'https://ieeextreme.org/proctor-eligibility-and-requirements/' },
];

export default function RulebookView() {
  const [activeTab, setActiveTab] = useState<'interactive' | 'document'>('interactive');
  const [currentPage, setCurrentPage] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [copiedAmbassador, setCopiedAmbassador] = useState(false);
  const [copiedProctor, setCopiedProctor] = useState(false);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  // Load checklist state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('nibmcodex_rulebook_checklist');
      if (saved) {
        setChecklist(JSON.parse(saved));
      }
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
      // Fallback
      if (type === 'ambassador') setCopiedAmbassador(true);
      else setCopiedProctor(true);
    }
  };

  const completedCount = PRE_ARRIVAL_ITEMS.filter((item) => checklist[item.id]).length;
  const progressPercent = Math.round((completedCount / PRE_ARRIVAL_ITEMS.length) * 100);

  return (
    <div className="space-y-12">
      {/* Hero Announcement Header */}
      <div className="relative rounded-3xl border border-[#5a1cbd]/50 bg-gradient-to-br from-[#05022d] via-[#090538] to-[#03011a] p-6 sm:p-10 overflow-hidden shadow-2xl">
        {/* Ambient Glowing Orbs */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#4f58fd]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#5a1cbd]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#7bdfff]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-widest px-3 py-1 rounded-full bg-[#5a1cbd]/30 border border-[#7bdfff]/30 text-[#7bdfff] font-bold">
                NIBMCODEX 2.0 // IEEEXTREME 20.0
              </span>
              <span className="font-mono text-xs uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-400/30 text-cyan-300 font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                Physical Venue Edition
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              Physical Participation <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7bdfff] via-[#4f58fd] to-[#e2b9f5]">
                Official Rulebook
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              Complete reference manual and on-site guidelines for participants joining the 
              24-hour <strong className="text-white">IEEEXtreme 20.0</strong> challenge at the NIBM Auditorium.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#03011a]/80 border border-[#5a1cbd]/40 text-xs font-mono text-[#bfe0e7]">
              <Sparkles className="w-3.5 h-3.5 text-[#7bdfff]" />
              <span className="font-bold tracking-widest text-[#7bdfff]">THINK. CODE. COMPETE. CONQUER.</span>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <a
              href="/api/rulebook/download"
              className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#4f58fd] via-[#5a1cbd] to-[#7bdfff] hover:from-[#396bfe] hover:to-[#bfe0e7] text-white font-bold text-sm tracking-wide shadow-lg shadow-[#4f58fd]/30 transition-all active:scale-[0.98] group"
              title="Download official PDF copy"
            >
              <Download className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
              <span>Download Official PDF</span>
              <span className="text-[11px] font-mono opacity-80 bg-black/20 px-1.5 py-0.5 rounded">2.5 MB</span>
            </a>

            <div className="flex gap-2">
              <a
                href="/rulebook.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#05022d] border border-[#5a1cbd]/40 hover:border-[#7bdfff]/50 text-[#d7d5e3] hover:text-white text-xs font-mono transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#7bdfff]" />
                <span>Open in Tab</span>
              </a>

              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#05022d] border border-[#5a1cbd]/40 hover:border-[#7bdfff]/50 text-[#d7d5e3] hover:text-white text-xs font-mono transition-all cursor-pointer"
                title="Print this rulebook"
              >
                <Printer className="w-3.5 h-3.5 text-[#7bdfff]" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>

        {/* View Toggle Bar */}
        <div className="mt-8 pt-6 border-t border-[#5a1cbd]/30 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-[#03011a]/80 p-1.5 rounded-xl border border-[#5a1cbd]/30">
            <button
              type="button"
              onClick={() => setActiveTab('interactive')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'interactive'
                  ? 'bg-gradient-to-r from-[#4f58fd] to-[#5a1cbd] text-white font-bold shadow-md shadow-[#4f58fd]/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Interactive Guide</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('document')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'document'
                  ? 'bg-gradient-to-r from-[#4f58fd] to-[#5a1cbd] text-white font-bold shadow-md shadow-[#4f58fd]/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Document Viewer (5 Pages)</span>
            </button>
          </div>

          <span className="text-xs font-mono text-[#bfe0e7]">
            Official Edition: <span className="text-white font-bold">NIBMCodex2.0_Rulebook_VF.pdf</span>
          </span>
        </div>
      </div>

      {/* Mode 1: Interactive Guide */}
      {activeTab === 'interactive' && (
        <div className="space-y-10">
          {/* Quick Credential Box - Section 05 Highlight */}
          <div className="rounded-2xl border border-[#7bdfff]/40 bg-gradient-to-r from-[#03011a] via-[#080332] to-[#03011a] p-5 sm:p-6 shadow-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#7bdfff] font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#7bdfff]" />
                  Section 05 • Keep Handy During Registration
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  Official NIBM Registration Credentials
                </h3>
                <p className="text-xs text-slate-400">
                  Use these credentials strictly when requested during official IEEEXtreme/vTools team registration.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 shrink-0">
                {/* Ambassador ID */}
                <div className="p-3 rounded-xl bg-[#05022d] border border-[#5a1cbd]/50 flex items-center justify-between gap-3 min-w-[240px]">
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 block">
                      Ambassador ID
                    </span>
                    <span className="text-xs font-mono font-bold text-[#7bdfff] tracking-wider block">
                      {AMBASSADOR_CODE}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(AMBASSADOR_CODE, 'ambassador')}
                    className="p-2 rounded-lg bg-[#5a1cbd]/30 hover:bg-[#5a1cbd]/60 text-[#7bdfff] hover:text-white transition-all cursor-pointer"
                    title="Copy Ambassador ID"
                  >
                    {copiedAmbassador ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                </div>

                {/* Proctor Name */}
                <div className="p-3 rounded-xl bg-[#05022d] border border-[#5a1cbd]/50 flex items-center justify-between gap-3 min-w-[240px]">
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 block">
                      Confirmed Proctor
                    </span>
                    <span className="text-xs font-bold text-white tracking-wide block">
                      {PROCTOR_NAME}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(PROCTOR_NAME, 'proctor')}
                    className="p-2 rounded-lg bg-[#5a1cbd]/30 hover:bg-[#5a1cbd]/60 text-[#7bdfff] hover:text-white transition-all cursor-pointer"
                    title="Copy Proctor Name"
                  >
                    {copiedProctor ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 01 & 02 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 01 Event at a Glance */}
            <div className="rounded-2xl border border-white/10 bg-navy-900/60 p-6 backdrop-blur-xl relative overflow-hidden">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                <span className="font-mono text-xs font-bold text-[#7bdfff]">01 /</span>
                <h2 className="text-lg font-bold text-white">Event at a Glance</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-[#7bdfff] mt-1 shrink-0" />
                  <div>
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Date</span>
                    <span className="text-sm font-semibold text-white">31 October 2026</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#7bdfff] mt-1 shrink-0" />
                  <div>
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Competition Time (24 Hours)</span>
                    <span className="text-sm font-semibold text-white">
                      5:30 AM on 31 October 2026 to 5:30 AM on 1 November 2026
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#7bdfff] mt-1 shrink-0" />
                  <div>
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Physical Venue</span>
                    <span className="text-sm font-semibold text-white">NIBM Auditorium, Colombo 07</span>
                  </div>
                </div>

                <div className="pt-2 text-xs text-slate-300 leading-relaxed bg-navy-950/60 p-3 rounded-xl border border-white/5">
                  IEEEXtreme is a global 24-hour virtual programming competition for teams of eligible 
                  IEEE Student and Graduate Student members hosted physically at NIBM.
                </div>
              </div>
            </div>

            {/* 02 Eligibility & Team Size */}
            <div className="rounded-2xl border border-white/10 bg-navy-900/60 p-6 backdrop-blur-xl relative overflow-hidden">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                <span className="font-mono text-xs font-bold text-[#7bdfff]">02 /</span>
                <h2 className="text-lg font-bold text-white">Eligibility & Team Size</h2>
              </div>

              <div className="flex items-center gap-4 mb-4 p-3 bg-[#05022d] border border-[#5a1cbd]/40 rounded-xl">
                <div className="text-3xl font-black font-mono text-[#7bdfff] tracking-tighter">
                  1-3
                </div>
                <div className="text-xs text-slate-300 leading-tight">
                  <strong className="text-white block font-semibold">Members per team</strong>
                  Form your squad of up to 3 active IEEE student members.
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7bdfff] mt-1.5 shrink-0" />
                  <span>All members must be active IEEE Student or Graduate Student members.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7bdfff] mt-1.5 shrink-0" />
                  <span>Maximum 2 Graduate Student members permitted per team.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7bdfff] mt-1.5 shrink-0" />
                  <span>All team members must be over 18 at registration.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7bdfff] mt-1.5 shrink-0" />
                  <span>Valid IEEE membership numbers are mandatory.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7bdfff] mt-1.5 shrink-0" />
                  <span>Universities / colleges may register multiple teams.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 03 & 04 Registration Requirements & What You Need */}
          <div className="rounded-2xl border border-white/10 bg-navy-900/60 p-6 sm:p-8 backdrop-blur-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-2">
              <div>
                <span className="font-mono text-xs font-bold text-[#7bdfff]">03 & 04 /</span>
                <h2 className="text-xl font-bold text-white mt-0.5">Registration Requirements & Process</h2>
              </div>
              <span className="text-xs font-mono text-[#e2b9f5]">Official vTools / IEEEXtreme Portal</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-sm font-mono font-bold text-slate-200 uppercase tracking-wider">
                  Registration Requirements
                </h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5a1cbd] mt-1.5 shrink-0" />
                    <span>Only registered team members may participate.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e92527] mt-1.5 shrink-0" />
                    <span className="text-red-300 font-medium">Substituting an unregistered person is prohibited and can disqualify the team.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5a1cbd] mt-1.5 shrink-0" />
                    <span>A proctor must be selected during registration.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5a1cbd] mt-1.5 shrink-0" />
                    <span>A confirmed Proctor of Record is required for ranking, prizes, and certificates.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5a1cbd] mt-1.5 shrink-0" />
                    <span>The team leader should verify proctor confirmation prior to competition day.</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-mono font-bold text-slate-200 uppercase tracking-wider">
                  What to Have Ready
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['Team Name', 'School / University', 'Country', 'Team Member Details', 'IEEE Membership Numbers', 'Proctor Selection'].map((item) => (
                    <span key={item} className="px-2.5 py-1.5 rounded-lg bg-navy-950 border border-white/10 text-xs font-mono text-[#bfe0e7]">
                      {item}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed pt-1">
                  After selecting your school on vTools, the registration form provides a proctor list for that school when available.
                  Official guidance also allows teams to enter the proctor&apos;s IEEE membership number directly.
                </p>
              </div>
            </div>
          </div>

          {/* Section 06, 07, 08 Core Rules & Integrity */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Core Rules */}
            <div className="rounded-2xl border border-white/10 bg-navy-900/60 p-6 backdrop-blur-xl">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
                <span className="font-mono text-xs font-bold text-[#7bdfff]">06 /</span>
                <h3 className="text-base font-bold text-white">Core Competition Rules</h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li>• 24-hour continuous duration following official UTC schedule.</li>
                <li>• Teams must be proctored throughout the entire competition.</li>
                <li>• Only registered members may contribute to code solutions.</li>
                <li>• Teams must solve problems independently without outside assistance.</li>
                <li>• Proctors may assist with the platform/interface, but strictly NOT with problem solving.</li>
              </ul>
            </div>

            {/* Plagiarism & Collaboration */}
            <div className="rounded-2xl border border-white/10 bg-navy-900/60 p-6 backdrop-blur-xl">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
                <span className="font-mono text-xs font-bold text-[#7bdfff]">07 /</span>
                <h3 className="text-base font-bold text-white">Plagiarism & Collaboration</h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li>• Do not share your submission code, in whole or in part, with any other team.</li>
                <li>• Do not receive assistance from other teams or third parties.</li>
                <li>• Properly cite and reference any external fixed algorithms or libraries used.</li>
                <li>• Cross-team collaboration during the contest window is strictly banned.</li>
              </ul>
            </div>

            {/* Disqualification & Technical Issues */}
            <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-6 backdrop-blur-xl">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-red-500/30">
                <span className="font-mono text-xs font-bold text-red-400">08 & 09 /</span>
                <h3 className="text-base font-bold text-white">Disqualification & Technical Issues</h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li>• All submissions undergo automated anti-plagiarism review.</li>
                <li>• Code reuse without referencing leads to instant disqualification.</li>
                <li>• IEEE reserves the right to disqualify any team violating competition integrity.</li>
                <li className="pt-2 text-red-300 font-semibold border-t border-red-500/20">
                  ⚠️ If laptop, Wi-Fi, browser, or contest platform malfunctions, notify NIBMCODEX 2.0 staff/proctor immediately.
                </li>
              </ul>
            </div>
          </div>

          {/* Section 10, 11, 12, 13, 14 At the NIBM Venue */}
          <div className="rounded-3xl border border-[#5a1cbd]/50 bg-gradient-to-b from-[#05022d]/90 to-[#03011a]/90 p-6 sm:p-8 backdrop-blur-2xl space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#5a1cbd]/30 gap-2">
              <div>
                <span className="font-mono text-xs font-bold text-[#7bdfff]">10, 11, 12, 13 & 14 /</span>
                <h2 className="text-2xl font-black text-white mt-0.5">At the NIBM Venue</h2>
              </div>
              <span className="text-xs font-mono text-[#7bdfff] bg-[#5a1cbd]/30 border border-[#7bdfff]/30 px-3 py-1 rounded-full">
                Physical Event Rules & Amenities
              </span>
            </div>

            {/* 3 Pillars: Arrival, What to Bring, Connectivity */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-xl bg-[#03011a]/80 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-[#7bdfff] font-bold text-sm">
                  <MapPin size={16} />
                  <span>Arrival & Check-in</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Arrive on time, complete check-in, remain within the designated competition area, 
                  and follow all instructions from the NIBMCODEX 2.0 organizing committee and proctors.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#03011a]/80 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-[#7bdfff] font-bold text-sm">
                  <Laptop size={16} />
                  <span>What to Bring</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Laptop suitable for programming, original power adapter / charging cables, 
                  extension cords if needed, and personal essentials for a 24-hour stay.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#03011a]/80 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-[#7bdfff] font-bold text-sm">
                  <Wifi size={16} />
                  <span>Campus Connectivity</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Dedicated high-speed Institute Wi-Fi network access is provided throughout 
                  the auditorium for all registered participants.
                </p>
              </div>
            </div>

            {/* Amenities Grid (What Participants Will Get) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Coffee className="w-4 h-4 text-[#7bdfff]" />
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                  What Participants Will Get (Full Hospitality)
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {AMENITIES.map((item) => (
                  <div
                    key={item.label}
                    className="p-3 rounded-xl bg-[#05022d] border border-[#5a1cbd]/40 hover:border-[#7bdfff]/50 transition-colors"
                  >
                    <span className="text-xs font-bold text-[#bfe0e7] block">{item.label}</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Crucial Venue Rule Alert Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 flex items-start gap-3.5">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs sm:text-sm">
                <strong className="text-amber-300 font-bold block uppercase tracking-wide">
                  CRITICAL VENUE SECURITY NOTICE: 6:00 PM DEPARTURE RESTRICTION
                </strong>
                <p className="text-slate-300 leading-relaxed">
                  Leaving the premises after <strong className="text-white">6:00 PM</strong> is strictly NOT acceptable.
                  Ensure you bring all necessary clothing, medication, adapters, and personal belongings prior to 6:00 PM check-in closure.
                </p>
              </div>
            </div>
          </div>

          {/* Section 15: Certificates & Interactive Checklist */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Certificates */}
            <div className="rounded-2xl border border-white/10 bg-navy-900/60 p-6 sm:p-8 backdrop-blur-xl space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                <Award className="w-5 h-5 text-[#7bdfff]" />
                <h3 className="text-lg font-bold text-white">Certificates & Recognition</h3>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#05022d] border border-[#5a1cbd]/40 space-y-1.5">
                  <span className="text-xs font-mono font-bold text-[#7bdfff] uppercase tracking-wider block">
                    1. IEEE Global E-Certificate
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Participants will be eligible to receive an official electronic Certificate directly 
                    from IEEE Global if the team obtains more than 0 marks in the contest.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#05022d] border border-[#5a1cbd]/40 space-y-1.5">
                  <span className="text-xs font-mono font-bold text-[#e2b9f5] uppercase tracking-wider block">
                    2. Physical NIBM Certificate
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    A physical certificate of active participation will be officially issued by NIBM 
                    to active on-site participants completing the 24-hour challenge.
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Pre-Arrival Checklist */}
            <div className="rounded-2xl border border-[#5a1cbd]/50 bg-[#05022d]/80 p-6 sm:p-8 backdrop-blur-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#5a1cbd]/30">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-[#7bdfff]" />
                  <h3 className="text-lg font-bold text-white">Before You Arrive Checklist</h3>
                </div>
                <span className="text-xs font-mono font-bold text-[#7bdfff]">
                  {completedCount}/{PRE_ARRIVAL_ITEMS.length} ({progressPercent}%)
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-navy-950 overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-[#4f58fd] via-[#5a1cbd] to-[#7bdfff] transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="space-y-2.5">
                {PRE_ARRIVAL_ITEMS.map((item) => {
                  const isChecked = Boolean(checklist[item.id]);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleChecklistItem(item.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                        isChecked
                          ? 'bg-[#5a1cbd]/20 border-[#7bdfff]/40 text-white'
                          : 'bg-[#03011a]/60 border-white/5 text-slate-300 hover:border-white/20'
                      }`}
                    >
                      <span className="mt-0.5 shrink-0 text-[#7bdfff]">
                        {isChecked ? <CheckSquare size={16} /> : <Square size={16} />}
                      </span>
                      <span className={`text-xs ${isChecked ? 'line-through text-slate-400 font-normal' : 'font-medium'}`}>
                        {item.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Official IEEE Sources */}
          <div className="rounded-2xl border border-white/10 bg-navy-900/60 p-6 backdrop-blur-xl">
            <h3 className="text-sm font-mono font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#7bdfff]" />
              <span>Official IEEE Competition Resources</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {OFFICIAL_RESOURCES.map((res) => (
                <a
                  key={res.title}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-navy-950/80 border border-white/5 hover:border-[#7bdfff]/40 text-xs text-slate-300 hover:text-white transition-all flex items-center justify-between group"
                >
                  <span className="font-medium pr-2">{res.title}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#7bdfff] shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Original 5-Page Document Viewer */}
      {activeTab === 'document' && (
        <div className="space-y-6">
          {/* Stepper / Thumbnail Strip */}
          <div className="flex items-center justify-between bg-navy-900/80 border border-white/10 p-3 rounded-2xl backdrop-blur-xl gap-2 overflow-x-auto">
            <div className="flex items-center gap-2">
              {RULEBOOK_PAGES.map((page) => (
                <button
                  key={page.id}
                  type="button"
                  onClick={() => setCurrentPage(page.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all shrink-0 cursor-pointer ${
                    currentPage === page.id
                      ? 'bg-gradient-to-r from-[#4f58fd] to-[#5a1cbd] text-white font-bold border border-[#7bdfff]/40 shadow-md'
                      : 'bg-navy-950 text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  Page {page.id}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-2 rounded-xl bg-navy-950 border border-white/10 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:text-white cursor-pointer"
                title="Previous page"
              >
                <ChevronLeft size={16} />
              </button>

              <span className="text-xs font-mono text-slate-300 px-1">
                {currentPage} / {RULEBOOK_PAGES.length}
              </span>

              <button
                type="button"
                disabled={currentPage === RULEBOOK_PAGES.length}
                onClick={() => setCurrentPage((p) => Math.min(RULEBOOK_PAGES.length, p + 1))}
                className="p-2 rounded-xl bg-navy-950 border border-white/10 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:text-white cursor-pointer"
                title="Next page"
              >
                <ChevronRight size={16} />
              </button>

              <button
                type="button"
                onClick={() => setIsZoomed(true)}
                className="p-2 rounded-xl bg-[#5a1cbd]/30 border border-[#7bdfff]/30 text-[#7bdfff] hover:text-white cursor-pointer"
                title="Enlarge page"
              >
                <Maximize2 size={16} />
              </button>
            </div>
          </div>

          {/* Page Preview Canvas */}
          <div className="relative rounded-3xl border border-[#5a1cbd]/40 bg-[#03011a] p-4 sm:p-8 flex flex-col items-center justify-center overflow-hidden shadow-2xl">
            <div className="relative max-w-4xl w-full aspect-[819/1024] rounded-xl overflow-hidden border border-white/10 shadow-2xl cursor-pointer"
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
            </div>

            {/* Page caption & controls */}
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between w-full max-w-4xl text-xs font-mono text-slate-400 gap-2">
              <span>{RULEBOOK_PAGES[currentPage - 1].title}</span>
              <button
                type="button"
                onClick={() => setIsZoomed(true)}
                className="text-[#7bdfff] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Maximize2 size={12} /> Click to expand fullscreen
              </button>
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
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-4 sm:p-6"
            onClick={() => setIsZoomed(false)}
          >
            <div className="flex items-center justify-between pb-3 text-white">
              <span className="font-mono text-xs uppercase tracking-wider text-[#7bdfff]">
                Page {currentPage} of {RULEBOOK_PAGES.length} • {RULEBOOK_PAGES[currentPage - 1].title}
              </span>

              <button
                type="button"
                onClick={() => setIsZoomed(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
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
                className="px-3 py-1.5 rounded-lg bg-white/10 disabled:opacity-40 cursor-pointer"
              >
                Previous
              </button>
              <span>{currentPage} / {RULEBOOK_PAGES.length}</span>
              <button
                type="button"
                disabled={currentPage === RULEBOOK_PAGES.length}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentPage((p) => Math.min(RULEBOOK_PAGES.length, p + 1));
                }}
                className="px-3 py-1.5 rounded-lg bg-white/10 disabled:opacity-40 cursor-pointer"
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

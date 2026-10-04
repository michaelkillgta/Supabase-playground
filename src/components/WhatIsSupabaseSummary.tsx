import {
  Database,
  FolderArchive,
  Zap,
  Plug,
  ShieldCheck,
  BrainCircuit,
  ArrowDown,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function WhatIsSupabaseSummary() {
  const features = [
    { name: 'PostgreSQL', desc: 'Relational Database', icon: Database, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
    { name: 'Storage', desc: 'Files, Media & CDN', icon: FolderArchive, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
    { name: 'Realtime', desc: 'WebSockets & Live Sync', icon: Zap, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
    { name: 'APIs', desc: 'Auto REST & GraphQL', icon: Plug, color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20' },
    { name: 'Authentication', desc: 'Users, OAuth & Sessions', icon: ShieldCheck, color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20' },
    { name: 'pgvector', desc: 'AI Vector Search', icon: BrainCircuit, color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' },
  ];

  return (
    <section className="mt-14 pt-10 border-t border-slate-200/80 space-y-6">
      {/* Title & Headline */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider border border-blue-100">
          <Layers className="w-3.5 h-3.5" />
          The Big Picture
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          So, what is Supabase?
        </h2>
        <p className="text-slate-700 text-sm sm:text-base max-w-3xl leading-relaxed">
          <strong>
            Supabase is a backend platform built around PostgreSQL that gives your application a database, storage, APIs, realtime capabilities, authentication, and AI-friendly features such as pgvector.
          </strong>
        </p>
      </div>

      {/* Visual Structured Architecture Stack */}
      <div className="bg-slate-900 text-slate-100 p-6 sm:p-8 rounded-3xl shadow-md border border-slate-800 space-y-6 max-w-2xl">
        {/* Tier 1: Frontend App */}
        <div className="flex flex-col items-center">
          <div className="px-5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 font-mono text-xs sm:text-sm font-bold text-white shadow-sm">
            YOUR APP (Frontend / Mobile / Web)
          </div>
          <ArrowDown className="w-4 h-4 text-emerald-400 my-2" />
          <div className="px-4 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold font-mono text-xs tracking-wider uppercase">
            ⚡ SUPABASE PLATFORM
          </div>
          <ArrowDown className="w-4 h-4 text-emerald-400 my-2" />
        </div>

        {/* Tier 2: The Core PostgreSQL Engine Stack */}
        <div className="border border-slate-700/80 rounded-2xl p-4 bg-slate-950/70 space-y-3">
          <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400 text-center font-semibold">
            PostgreSQL Infrastructure Engine
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {features.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.name}
                  className={`p-3 rounded-xl border ${item.color} bg-slate-900/80 flex flex-col justify-between space-y-1.5 transition-all`}
                >
                  <Icon className="w-4 h-4" />
                  <div>
                    <span className="font-bold text-xs text-white block">{item.name}</span>
                    <span className="text-[10px] text-slate-400 block">{item.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Traditional Clean ASCII Diagram as required */}
        <div className="pt-2 border-t border-slate-800/80 flex justify-between items-center text-[11px] font-mono text-slate-400">
          <span>Architecture Mental Model</span>
          <span className="text-emerald-400">PostgreSQL Core Stack</span>
        </div>
      </div>

      {/* Bottom Key Takeaway Callout */}
      <div className="bg-blue-50/80 border border-blue-200/80 p-4 sm:p-5 rounded-2xl max-w-2xl text-blue-950 font-semibold text-sm sm:text-base flex items-center gap-3 shadow-sm">
        <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0" />
        <span>You build the app. Supabase handles much of the backend infrastructure behind it.</span>
      </div>
    </section>
  );
}

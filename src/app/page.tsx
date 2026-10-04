'use client';

import { useState } from 'react';
import DatabaseDemo from '@/components/DatabaseDemo';
import StorageDemo from '@/components/StorageDemo';
import RealtimeDemo from '@/components/RealtimeDemo';
import PgvectorDemo from '@/components/PgvectorDemo';
import AuthNoticeCard from '@/components/AuthNoticeCard';
import WhatIsSupabaseSummary from '@/components/WhatIsSupabaseSummary';
import { isSupabaseConfigured } from '@/lib/supabaseClient';
import { Database, FolderArchive, Zap, Sparkles, CheckCircle2, Info, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'database' | 'storage' | 'realtime' | 'pgvector'>('pgvector');

  const tabs = [
    {
      id: 'database',
      label: 'Database',
      badge: 'PostgreSQL',
      icon: Database,
      accent: 'text-blue-600 bg-blue-50/80 border-blue-200 shadow-sm',
    },
    {
      id: 'storage',
      label: 'Storage',
      badge: 'CDN Files',
      icon: FolderArchive,
      accent: 'text-emerald-600 bg-emerald-50/80 border-emerald-200 shadow-sm',
    },
    {
      id: 'realtime',
      label: 'Realtime',
      badge: 'WebSockets',
      icon: Zap,
      accent: 'text-amber-600 bg-amber-50/80 border-amber-200 shadow-sm',
    },
    {
      id: 'pgvector',
      label: 'pgvector',
      badge: 'AI Search',
      icon: Sparkles,
      accent: 'text-purple-600 bg-purple-50/80 border-purple-200 shadow-sm',
    },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-purple-100 selection:text-purple-900 pb-16">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-lg font-mono">
                ⚡
              </div>
              <div>
                <span className="font-bold text-slate-900 tracking-tight text-base sm:text-lg block leading-none">
                  Supabase Playground
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Interactive Backend Studio</span>
              </div>
            </div>

            {/* Status indicator */}
            <div className="flex items-center gap-2 text-xs">
              {isSupabaseConfigured ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-medium font-mono text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Connected to Supabase
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 font-medium font-mono text-xs">
                  <Info className="w-3.5 h-3.5 text-blue-600" />
                  Interactive Demo Mode
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Unified Hero & Mental Model Deck */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="space-y-1.5">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Supabase Playground
            </h1>
            <p className="text-base sm:text-lg text-slate-600 font-medium">
              See what your backend is actually doing.
            </p>
          </div>

          {/* Interactive Mental Model Ribbon */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs shadow-inner border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-2">
              Core Backend Mental Model
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-white font-medium">
                Your App (Frontend)
              </span>
              <ArrowRight className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white font-bold shadow-sm">
                ⚡ Supabase
              </span>
              <ArrowRight className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <span className="px-2 py-1 rounded bg-blue-900/60 text-blue-300 border border-blue-800">Data</span>
                <span className="px-2 py-1 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-800">Files</span>
                <span className="px-2 py-1 rounded bg-amber-900/60 text-amber-300 border border-amber-800">Realtime</span>
                <span className="px-2 py-1 rounded bg-purple-900/60 text-purple-300 border border-purple-800">AI Search</span>
              </div>
            </div>
          </div>

          {/* Auth Card */}
          <AuthNoticeCard />
        </div>

        {/* Segmented Tab Navigation Bar */}
        <div className="bg-slate-200/70 p-1.5 rounded-2xl flex flex-wrap sm:flex-nowrap gap-1.5 shadow-inner border border-slate-200/80">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                  isActive
                    ? `${tab.accent} bg-white border-slate-200`
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span
                  className={`hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                    isActive ? 'bg-slate-100 text-slate-700' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Structured Interactive Workspace */}
        <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
          {activeTab === 'database' && <DatabaseDemo />}
          {activeTab === 'storage' && <StorageDemo />}
          {activeTab === 'realtime' && <RealtimeDemo />}
          {activeTab === 'pgvector' && <PgvectorDemo />}
        </section>

        {/* Final Educational Summary */}
        <WhatIsSupabaseSummary />
      </main>
    </div>
  );
}

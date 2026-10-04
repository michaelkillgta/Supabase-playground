'use client';

import { useState } from 'react';
import {
  Sparkles,
  Search,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  FileText,
  BrainCircuit,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';

interface MatchedPolicy {
  title: string;
  content: string;
  similarityScore: number;
}

export default function PgvectorDemo() {
  const [query, setQuery] = useState('Can I work from home?');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [bestMatch, setBestMatch] = useState<MatchedPolicy>({
    title: 'Work From Home Policy',
    content: 'Employees can work remotely with manager approval.',
    similarityScore: 96,
  });

  const queryCategories = [
    { label: 'Work from home', query: 'Can I work remotely?' },
    { label: 'Leave & Vacation', query: 'How many vacation days do I get?' },
    { label: 'Pay & Salary', query: 'When do we receive our salary?' },
    { label: 'Security & 2FA', query: 'What are the password and 2FA rules?' },
    { label: 'Office Hours', query: 'What are our standard office hours?' },
  ];

  const handleSearch = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const searchQuery = (customQuery || query).trim();
    if (!searchQuery) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/pgvector/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to perform vector search.');
      }

      if (data.results && data.results.length > 0) {
        setBestMatch(data.results[0]);
      }
    } catch (err) {
      setErrorMsg((err as Error).message || 'Search failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-200/80 gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-semibold uppercase tracking-wider mb-1.5 border border-purple-100">
            <BrainCircuit className="w-3.5 h-3.5" />
            WHAT IS IT?
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            pgvector Demo (AI Semantic Search)
          </h2>
          <p className="text-slate-600 text-sm mt-0.5">
            Store vector embeddings and search by conceptual meaning directly inside PostgreSQL.
          </p>
        </div>

        <div className="self-start sm:self-center px-3 py-1.5 bg-purple-50/80 border border-purple-200/70 rounded-lg text-xs font-mono text-purple-800 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
          pgvector Extension Active
        </div>
      </div>

      {/* 2. Structured Two-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Search & Controls Studio (Span 6) */}
        <div className="lg:col-span-6 flex flex-col justify-between bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                Query Input Studio
              </h3>
              <span className="text-xs text-slate-400 font-mono">5 Policies Indexed</span>
            </div>

            {/* Input Box */}
            <form onSubmit={(e) => handleSearch(e)} className="space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. Can I work remotely?"
                  className="w-full pl-10 pr-24 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none transition"
                />
                <button
                  type="submit"
                  disabled={loading || !query.trim()}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-2 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 disabled:opacity-50 text-white font-medium rounded-lg text-xs transition shadow-sm"
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg">
                  {errorMsg}
                </p>
              )}
            </form>

            {/* Categorized Test Chips */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Quick Test Prompts
              </span>
              <div className="flex flex-wrap gap-1.5">
                {queryCategories.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setQuery(item.query);
                      handleSearch(undefined, item.query);
                    }}
                    className={`px-3 py-1.5 text-xs rounded-lg transition font-medium border ${
                      query === item.query
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                        : 'bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-700 border-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Structured Concept Comparison: Keyword vs Vector */}
          <div className="pt-4 border-t border-slate-100 space-y-2.5">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
              Why pgvector Matters
            </span>
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-semibold text-slate-500 block">Keyword Search</span>
                <span className="font-mono text-slate-800 text-[11px] block">&quot;work from home&quot;</span>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Looks for exact string matches. Fails on synonyms like &quot;remotely&quot;.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200 space-y-1">
                <span className="font-semibold text-purple-700 block">pgvector AI Search</span>
                <span className="font-mono text-purple-900 text-[11px] block">&quot;Can I work remotely?&quot;</span>
                <p className="text-[11px] text-purple-800 leading-snug">
                  Understands semantic meaning and finds the policy effortlessly.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Supabase Engine & Best Match Result (Span 6) */}
        <div className="lg:col-span-6 flex flex-col justify-between bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 shadow-sm p-6 space-y-5">
          {/* Top: Best Match Card */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-2.5">
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-purple-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                BEST MATCH IN POSTGRESQL
              </span>
              <div className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-xs font-semibold border border-purple-500/30">
                Similarity: {bestMatch.similarityScore}%
              </div>
            </div>

            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                {bestMatch.title}
              </h4>
              <p className="text-slate-300 text-xs mt-1.5 italic bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 leading-relaxed">
                &ldquo;{bestMatch.content}&rdquo;
              </p>
            </div>

            {/* Similarity Score Meter */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>Vector Semantic Closeness</span>
                <span className="text-purple-300 font-bold">{bestMatch.similarityScore}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${bestMatch.similarityScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Bottom: Request Flow Pipeline */}
          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
              Live Pipeline Execution Flow
            </span>
            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 font-mono text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">1. Question:</span>
                <span className="truncate max-w-[220px] text-white">&ldquo;{query}&rdquo;</span>
              </div>
              <div className="flex items-center justify-between text-purple-300">
                <span className="text-slate-400">2. Vector:</span>
                <span>384-dimensional embedding</span>
              </div>
              <div className="flex items-center justify-between text-emerald-300">
                <span className="text-slate-400">3. Match:</span>
                <span>Cosine distance query executed</span>
              </div>
              <div className="flex items-center justify-between text-amber-300 pt-1 border-t border-slate-800">
                <span className="text-slate-400">4. Result:</span>
                <span className="font-semibold text-purple-300 truncate max-w-[200px]">{bestMatch.title}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Deep Dive & Key Takeaway */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Accordion: What Just Happened? */}
        <div className="border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-sm flex flex-col justify-between">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full px-5 py-4 flex justify-between items-center text-left text-slate-900 font-bold text-sm hover:bg-slate-50 transition"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-600" />
              What just happened?
            </span>
            {isOpen ? (
              <ChevronUp className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            )}
          </button>
          {isOpen && (
            <div className="px-5 pb-5 pt-1 text-sm text-slate-600 border-t border-slate-100 bg-slate-50/50 leading-relaxed space-y-2">
              <p>
                pgvector is a PostgreSQL extension that lets you store and search embeddings.
              </p>
              <p className="text-xs text-slate-500">
                Instead of looking only for exact keywords, your frontend converted the question into vector coordinates, and PostgreSQL calculated which document sat closest in conceptual space.
              </p>
            </div>
          )}
        </div>

        {/* The Simple Idea Banner */}
        <div className="p-5 bg-purple-50/70 border border-purple-200/80 rounded-2xl text-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0 text-purple-700">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-purple-950 block text-xs uppercase tracking-wide">
              The Simple Idea
            </span>
            <span className="text-purple-900 text-sm font-medium">
              &ldquo;Supabase can store and search embeddings inside PostgreSQL.&rdquo;
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

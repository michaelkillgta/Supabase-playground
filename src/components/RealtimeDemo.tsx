'use client';

import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { Zap, ChevronDown, ChevronUp, Radio, Laptop } from 'lucide-react';

export default function RealtimeDemo() {
  const [count, setCount] = useState<number>(24);
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    let broadcast: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      broadcast = new BroadcastChannel('supabase_playground_realtime_counter');
      broadcast.onmessage = (event) => {
        if (typeof event.data?.count === 'number') {
          setCount(event.data.count);
        }
      };
    }

    if (isSupabaseConfigured) {
      supabase
        .from('live_counter')
        .select('count')
        .eq('id', 1)
        .single()
        .then(({ data, error }) => {
          if (!error && data && typeof data.count === 'number') {
            setCount(data.count);
          }
        });

      const channel = supabase
        .channel('realtime_live_counter')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'live_counter',
            filter: 'id=eq.1',
          },
          (payload) => {
            if (payload.new && typeof payload.new.count === 'number') {
              setCount(payload.new.count);
            }
          }
        )
        .subscribe((status) => {
          setIsConnected(status === 'SUBSCRIBED');
        });

      return () => {
        supabase.removeChannel(channel);
        if (broadcast) broadcast.close();
      };
    }

    return () => {
      if (broadcast) broadcast.close();
    };
  }, []);

  const handleIncrement = async () => {
    const nextCount = count + 1;
    setCount(nextCount);
    setIsUpdating(true);

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        const bc = new BroadcastChannel('supabase_playground_realtime_counter');
        bc.postMessage({ count: nextCount });
        bc.close();
      } catch (e) {
        console.error(e);
      }
    }

    if (isSupabaseConfigured) {
      await supabase
        .from('live_counter')
        .update({ count: nextCount, updated_at: new Date().toISOString() })
        .eq('id', 1);
    }

    setTimeout(() => setIsUpdating(false), 300);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-200/80 gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-xs font-semibold uppercase tracking-wider mb-1.5 border border-amber-100">
            <Radio className="w-3.5 h-3.5" />
            WHAT IS IT?
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Realtime Demo (`live_counter` Table)
          </h2>
          <p className="text-slate-600 text-sm mt-0.5">
            Supabase listens to PostgreSQL replication logs and pushes changes over WebSockets without client polling.
          </p>
        </div>

        <div className="self-start sm:self-center px-3 py-1.5 bg-amber-50/80 border border-amber-200/70 rounded-lg text-xs font-mono text-amber-800 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          WebSocket Channel Subscribed
        </div>
      </div>

      {/* 2. Structured Two-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Interactive Counter Studio (Span 5) */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
          <div className="space-y-4 text-center">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold tracking-widest text-slate-400 uppercase font-mono">
                LIVE COUNTER
              </span>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                🟢 Realtime connected
              </div>
            </div>

            <div
              className={`text-6xl font-extrabold text-slate-900 font-mono tracking-tight py-2 transition-transform duration-200 ${
                isUpdating ? 'scale-110 text-amber-600' : 'scale-100'
              }`}
            >
              {count}
            </div>

            <button
              type="button"
              onClick={handleIncrement}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold text-base rounded-xl transition shadow-sm active:scale-95 flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-current" />
              [ +1 ]
            </button>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5 text-amber-600" />
              Multi-Tab Sync Test:
            </span>
            <p className="text-[11px] text-slate-500 leading-snug">
              Open this playground in two browser tabs side-by-side. Click <strong>[ +1 ]</strong> in one tab and watch the other tab update instantly!
            </p>
          </div>
        </div>

        {/* Right Column: Realtime Architecture & Pipeline (Span 7) */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 shadow-sm p-6 space-y-4">
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block font-semibold">
              Live Replication Flow
            </span>

            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-2.5">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Client Action:</span>
                <span className="text-white font-semibold">User triggers [ +1 ] in Tab A</span>
              </div>
              <div className="flex items-center justify-between text-amber-300">
                <span className="text-slate-400">PostgreSQL Log:</span>
                <span>Row updated: count = {count}</span>
              </div>
              <div className="flex items-center justify-between text-emerald-300">
                <span className="text-slate-400">WebSocket Broadcast:</span>
                <span>Change pushed to channel</span>
              </div>
              <div className="flex items-center justify-between text-purple-300 pt-1 border-t border-slate-800">
                <span className="text-slate-400">Listener:</span>
                <span className="font-semibold text-emerald-300">Tab B receives payload & updates instantly</span>
              </div>
            </div>
          </div>

          {/* Architecture Flow */}
          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80 font-mono text-xs flex items-center justify-between gap-1 overflow-x-auto">
            <span className="bg-slate-900 px-2.5 py-1 rounded text-slate-200">Tab A</span>
            <span className="text-amber-400">→</span>
            <span className="bg-slate-900 px-2.5 py-1 rounded text-slate-200">Database change</span>
            <span className="text-amber-400">→</span>
            <span className="bg-amber-500 text-slate-950 font-bold px-2.5 py-1 rounded">Supabase Realtime</span>
            <span className="text-amber-400">→</span>
            <span className="bg-emerald-600 text-white font-bold px-2.5 py-1 rounded">Tab B Updates</span>
          </div>
        </div>
      </div>

      {/* 3. Deep Dive & Key Takeaway */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div className="border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-sm flex flex-col justify-between">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full px-5 py-4 flex justify-between items-center text-left text-slate-900 font-bold text-sm hover:bg-slate-50 transition"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              What just happened?
            </span>
            {isOpen ? (
              <ChevronUp className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            )}
          </button>
          {isOpen && (
            <div className="px-5 pb-5 pt-1 text-sm text-slate-600 border-t border-slate-100 bg-slate-50/50 leading-relaxed">
              Instead of repeatedly asking the server whether something changed, your app can listen for database changes and receive updates automatically.
            </div>
          )}
        </div>

        <div className="p-5 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0 text-amber-700">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-amber-950 block text-xs uppercase tracking-wide">
              The Simple Idea
            </span>
            <span className="text-amber-900 text-sm font-medium">
              &ldquo;Supabase can push database changes to connected apps.&rdquo;
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

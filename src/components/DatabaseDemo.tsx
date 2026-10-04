'use client';

import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { Database, Plus, ChevronDown, ChevronUp, ArrowRight, CheckCircle2, RefreshCw } from 'lucide-react';

interface Student {
  id: number | string;
  name: string;
  role: string;
  score: number;
}

export default function DatabaseDemo() {
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: 'Uma', role: 'Student', score: 85 },
    { id: 2, name: 'Rahul', role: 'Student', score: 91 },
    { id: 3, name: 'Sophia', role: 'Student', score: 94 },
  ]);
  const [name, setName] = useState('');
  const [role, setRole] = useState('Student');
  const [score, setScore] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isSupabaseConfigured) {
      loadStudents();
    }
  }, []);

  const loadStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error('Error fetching students:', error.message);
      } else if (data && data.length > 0) {
        setStudents(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || score === '') return;

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (isSupabaseConfigured) {
        const { error: insertError } = await supabase.from('students').insert([
          {
            name: name.trim(),
            role: role.trim() || 'Student',
            score: Number(score),
          },
        ]);

        if (insertError) {
          throw new Error(insertError.message);
        }

        await loadStudents();
      } else {
        const nextId =
          students.length > 0
            ? Math.max(...students.map((s) => Number(s.id) || 0)) + 1
            : 1;

        setStudents((prev) => [
          ...prev,
          {
            id: nextId,
            name: name.trim(),
            role: role.trim() || 'Student',
            score: Number(score),
          },
        ]);
      }

      setSuccessMsg(`Added "${name.trim()}" successfully.`);
      setName('');
      setScore('');
    } catch (err) {
      setErrorMsg((err as Error).message || 'Failed to add student.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-200/80 gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-1.5 border border-blue-100">
            <Database className="w-3.5 h-3.5" />
            WHAT IS IT?
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Database Demo (`students` Table)
          </h2>
          <p className="text-slate-600 text-sm mt-0.5">
            Supabase provides a real PostgreSQL relational database with instant CRUD APIs.
          </p>
        </div>

        <div className="self-start sm:self-center px-3 py-1.5 bg-blue-50/80 border border-blue-200/70 rounded-lg text-xs font-mono text-blue-800 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-600" />
          Table: public.students
        </div>
      </div>

      {/* 2. Structured Two-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Form & Action (Span 5) */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-600" />
                Add Student
              </h3>
              <span className="text-xs text-slate-400 font-mono">PostgreSQL Insert</span>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-3.5 text-sm">
              <div>
                <label className="block text-slate-700 font-medium mb-1 text-xs uppercase tracking-wide">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Priya Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1 text-xs uppercase tracking-wide">
                  Role
                </label>
                <input
                  type="text"
                  placeholder="e.g. Student"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1 text-xs uppercase tracking-wide">
                  Score
                </label>
                <input
                  type="number"
                  placeholder="e.g. 88"
                  min="0"
                  max="100"
                  value={score}
                  onChange={(e) =>
                    setScore(e.target.value === '' ? '' : Number(e.target.value))
                  }
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white font-medium rounded-lg text-sm transition flex items-center justify-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                {loading ? 'Inserting into Supabase...' : '[ Add Student ]'}
              </button>

              {successMsg && (
                <p className="text-xs text-emerald-700 flex items-center gap-1.5 font-medium bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  {successMsg}
                </p>
              )}

              {errorMsg && (
                <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg">
                  {errorMsg}
                </p>
              )}
            </form>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
            <span className="font-semibold text-slate-800 block">⚡ Instant Reflection:</span>
            Submitting this form immediately fires an insert to your Supabase PostgreSQL table.
          </div>
        </div>

        {/* Right Column: Live Table & Flow (Span 7) */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Live Records (`public.students`)
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-mono text-[11px] font-bold">
                  {students.length} {students.length === 1 ? 'row' : 'rows'}
                </span>
              </div>

              <button
                type="button"
                onClick={loadStudents}
                className="text-xs text-slate-500 hover:text-blue-700 flex items-center gap-1 transition px-2 py-1 rounded hover:bg-slate-50"
              >
                <RefreshCw className="w-3 h-3" />
                Refresh
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto max-h-[220px] overflow-y-auto pr-1">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="py-2 px-3">ID</th>
                    <th className="py-2 px-3">Name</th>
                    <th className="py-2 px-3">Role</th>
                    <th className="py-2 px-3 text-right">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-normal">
                  {students.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-slate-400">{st.id}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-900">{st.name}</td>
                      <td className="py-2.5 px-3 text-slate-600">{st.role}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-blue-600">{st.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Architecture Flow */}
          <div className="bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-800 font-mono text-xs flex items-center justify-between gap-1 overflow-x-auto">
            <span className="bg-slate-800 px-2.5 py-1 rounded text-slate-200">YOUR APP</span>
            <span className="text-blue-400">→</span>
            <span className="bg-blue-600 px-2.5 py-1 rounded text-white font-bold">Supabase</span>
            <span className="text-blue-400">→</span>
            <span className="bg-slate-800 px-2.5 py-1 rounded text-slate-200">PostgreSQL</span>
            <span className="text-blue-400">→</span>
            <span className="bg-emerald-600 px-2.5 py-1 rounded text-white font-bold">Data Stored</span>
            <span className="text-blue-400">→</span>
            <span className="bg-slate-800 px-2.5 py-1 rounded text-slate-200">YOUR APP</span>
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
              <span className="w-2 h-2 rounded-full bg-blue-600" />
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
              Your frontend sent a request to Supabase. Supabase stored the data in PostgreSQL and returned the result to your app.
            </div>
          )}
        </div>

        <div className="p-5 bg-blue-50/70 border border-blue-200/80 rounded-2xl text-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-700">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-blue-950 block text-xs uppercase tracking-wide">
              The Simple Idea
            </span>
            <span className="text-blue-900 text-sm font-medium">
              &ldquo;Supabase stores your application&apos;s data.&rdquo;
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

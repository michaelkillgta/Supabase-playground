'use client';

import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FolderArchive,
  RefreshCw,
  ExternalLink,
  Download,
} from 'lucide-react';

interface BucketItem {
  name: string;
  size: string;
  createdAt: string;
  publicUrl: string;
}

export default function StorageDemo() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [bucketFiles, setBucketFiles] = useState<BucketItem[]>([
    {
      name: 'sample.txt',
      size: '11 B',
      createdAt: 'Just now',
      publicUrl: 'https://zgqkfufwtqlkcrhvbrdx.supabase.co/storage/v1/object/public/learning-files/sample.txt',
    },
  ]);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const loadBucketFiles = async () => {
    if (!isSupabaseConfigured) return;
    try {
      const { data, error } = await supabase.storage.from('learning-files').list();
      if (!error && Array.isArray(data)) {
        const mapped = data.map((item) => {
          const { data: urlData } = supabase.storage
            .from('learning-files')
            .getPublicUrl(item.name);
          return {
            name: item.name,
            size: item.metadata?.size ? formatFileSize(item.metadata.size) : 'File',
            createdAt: item.created_at ? new Date(item.created_at).toLocaleTimeString() : 'Recently',
            publicUrl: urlData.publicUrl,
          };
        });
        if (mapped.length > 0) {
          setBucketFiles(mapped);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadBucketFiles();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const cleanName = `${Date.now()}-${selectedFile.name.replace(/[^a-zA-Z0-9_.-]/g, '_')}`;

      if (isSupabaseConfigured) {
        const { error } = await supabase.storage
          .from('learning-files')
          .upload(cleanName, selectedFile, {
            cacheControl: '3600',
            upsert: true,
          });

        if (error) {
          throw new Error(error.message);
        }

        const { data: urlData } = supabase.storage
          .from('learning-files')
          .getPublicUrl(cleanName);

        setBucketFiles((prev) => [
          {
            name: cleanName,
            size: formatFileSize(selectedFile.size),
            createdAt: 'Just now',
            publicUrl: urlData.publicUrl,
          },
          ...prev,
        ]);
      } else {
        setBucketFiles((prev) => [
          {
            name: selectedFile.name,
            size: formatFileSize(selectedFile.size),
            createdAt: 'Just now',
            publicUrl: '#',
          },
          ...prev,
        ]);
      }

      setSuccessMsg(`"${selectedFile.name}" uploaded to learning-files!`);
      setSelectedFile(null);
    } catch (err) {
      setErrorMsg((err as Error).message || 'Failed to upload file.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-200/80 gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-1.5 border border-emerald-100">
            <FolderArchive className="w-3.5 h-3.5" />
            WHAT IS IT?
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Storage Demo (`learning-files` Bucket)
          </h2>
          <p className="text-slate-600 text-sm mt-0.5">
            Store unstructured files, PDFs, videos, and images outside database rows with instant CDN links.
          </p>
        </div>

        <div className="self-start sm:self-center px-3 py-1.5 bg-emerald-50/80 border border-emerald-200/70 rounded-lg text-xs font-mono text-emerald-800 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-600" />
          Bucket: learning-files (Public)
        </div>
      </div>

      {/* 2. Structured Two-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Upload Dropzone & Action (Span 5) */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-emerald-600" />
                Upload File
              </h3>
              <span className="text-xs text-slate-400 font-mono">Bucket: learning-files</span>
            </div>

            <form onSubmit={handleUpload} className="space-y-4 text-sm">
              <label
                htmlFor="file-upload"
                className="group flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl cursor-pointer bg-slate-50/60 hover:bg-emerald-50/20 transition-all text-center"
              >
                <FileText className="w-8 h-8 text-slate-400 group-hover:text-emerald-600 mb-2 transition" />
                <span className="text-xs font-semibold text-blue-600 group-hover:text-emerald-700">
                  {selectedFile ? selectedFile.name : '[ Choose File to Upload ]'}
                </span>
                <span className="text-[11px] text-slate-400 mt-1">
                  {selectedFile
                    ? `Ready (${formatFileSize(selectedFile.size)})`
                    : 'PDF, Image, or Document'}
                </span>
                <input
                  id="file-upload"
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>

              <button
                type="submit"
                disabled={!selectedFile || uploading}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white font-medium rounded-lg text-sm transition flex items-center justify-center gap-2 shadow-sm"
              >
                <UploadCloud className="w-4 h-4" />
                {uploading ? 'Uploading to Supabase Storage...' : '[ Upload to Supabase ]'}
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

          {/* Quick Tip for Supabase Dashboard */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
            <span className="font-semibold text-slate-800 block">👀 Where to see it in Supabase:</span>
            <p className="text-[11px] text-slate-500 leading-snug">
              In your Supabase Dashboard, click <strong>Storage</strong> in the left sidebar, then click on the <strong>learning-files</strong> bucket.
            </p>
          </div>
        </div>

        {/* Right Column: Live Bucket Contents Inspector (Span 7) */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Live Bucket Contents
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[11px] font-bold">
                  {bucketFiles.length} {bucketFiles.length === 1 ? 'file' : 'files'}
                </span>
              </div>

              <button
                type="button"
                onClick={loadBucketFiles}
                className="text-xs text-slate-500 hover:text-emerald-700 flex items-center gap-1 transition px-2 py-1 rounded hover:bg-slate-50"
              >
                <RefreshCw className="w-3 h-3" />
                Refresh
              </button>
            </div>

            {/* Files List */}
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {bucketFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 hover:bg-emerald-50/30 border border-slate-200/80 transition"
                >
                  <div className="flex items-center gap-2.5 truncate mr-2">
                    <FileText className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <div className="truncate">
                      <span className="text-xs font-semibold text-slate-900 block truncate">
                        {file.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {file.size} • {file.createdAt}
                      </span>
                    </div>
                  </div>

                  {file.publicUrl && file.publicUrl !== '#' && (
                    <a
                      href={file.publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-white hover:bg-emerald-600 hover:text-white border border-slate-200 rounded-lg text-[11px] font-medium text-slate-700 transition flex items-center gap-1 flex-shrink-0"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Architecture Flow */}
          <div className="bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-800 font-mono text-xs flex items-center justify-between gap-1 overflow-x-auto">
            <span className="bg-slate-800 px-2.5 py-1 rounded text-slate-200">YOUR APP</span>
            <span className="text-emerald-400">→</span>
            <span className="bg-slate-800 px-2.5 py-1 rounded text-slate-200">Upload file</span>
            <span className="text-emerald-400">→</span>
            <span className="bg-emerald-600 px-2.5 py-1 rounded text-white font-bold">Supabase Storage</span>
            <span className="text-emerald-400">→</span>
            <span className="bg-slate-800 px-2.5 py-1 rounded text-emerald-300">Public CDN</span>
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
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
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
              Supabase Storage is used for files such as PDFs, images, videos, and other uploads. Your database stores metadata while Storage distributes the raw binary files worldwide over CDN.
            </div>
          )}
        </div>

        <div className="p-5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl text-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-700">
            <FolderArchive className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-emerald-950 block text-xs uppercase tracking-wide">
              The Simple Idea
            </span>
            <span className="text-emerald-900 text-sm font-medium">
              &ldquo;Supabase stores your files.&rdquo;
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Supabase Playground - See what your backend is actually doing',
  description: 'An interactive playground teaching beginners core Supabase concepts: Database, Storage, Realtime, and pgvector.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
        {children}
      </body>
    </html>
  );
}

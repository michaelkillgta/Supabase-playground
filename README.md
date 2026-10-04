# ⚡ Supabase Playground

> **See what your backend is actually doing.**

An interactive educational playground built with **Next.js**, **TypeScript**, and **Tailwind CSS** that teaches beginners how Supabase works under the hood through working interactive examples.

---

## 🧠 Mental Model

```text
Your App  ───►  Supabase  ───►  Data / Files / Realtime / AI Search
```

---

## 🚀 Getting Started

### 1. Start the Development Server

From the `supabase-playground` directory, run:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Connecting Your Own Supabase Project (Optional)

The playground works **right out of the box** in interactive demonstration mode. To connect your live Supabase cloud project:

1. **Create a free Supabase project** at [supabase.com](https://supabase.com).
2. **Run the Database Schema**:
   - Open your project dashboard → **SQL Editor** → **New Query**.
   - Copy and paste the entire contents of `supabase/schema.sql`.
   - Click **Run**.
3. **Set your environment variables**:
   - Copy `.env.example` to `.env.local`:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
     ```
4. Restart your development server (`npm run dev`). The status badge in the top-right will turn green: **"Connected to Supabase"**!

---

## 📚 What's Inside

| Section | Educational Concept | Interactive Demo |
| :--- | :--- | :--- |
| **Database** | PostgreSQL CRUD & instant APIs | Add students to `students` table, fetch live records, view request/response flow. |
| **Storage** | Object storage vs database rows | Upload files into the `learning-files` bucket and inspect persisted metadata. |
| **Realtime** | WebSocket database change replication | Realtime counter synced across multiple browser tabs automatically. |
| **pgvector** | AI semantic search inside PostgreSQL | Search company policies by meaning rather than exact keywords. |
| **Auth** | User identity & sessions | Clear explanation of Supabase's authentication suite without bloat. |

---

## 📁 Project Structure

```text
supabase-playground/
├── supabase/
│   └── schema.sql                  # PostgreSQL tables, storage bucket, & pgvector RPC function
├── src/
│   ├── app/
│   │   ├── page.tsx                # Playground dashboard shell & tab navigation
│   │   ├── layout.tsx              # Root HTML & typography layout
│   │   ├── globals.css             # Tailwind CSS & UI styling
│   │   └── api/
│   │       └── pgvector/
│   │           ├── search/route.ts # Server-side semantic embedding query endpoint
│   │           └── seed/route.ts   # Document embedding seed endpoint
│   ├── components/
│   │   ├── DatabaseDemo.tsx        # Students table interactive demo & request flow
│   │   ├── StorageDemo.tsx         # File upload to learning-files bucket & metadata
│   │   ├── RealtimeDemo.tsx        # Multi-tab live counter with Realtime sync
│   │   ├── PgvectorDemo.tsx        # Semantic search & keyword vs vector comparison
│   │   ├── AuthNoticeCard.tsx      # Supabase Authentication explanation card
│   │   └── WhatIsSupabaseSummary.tsx # Bottom architecture & mental model summary
│   └── lib/
│       ├── supabaseClient.ts       # Supabase client initialization
│       ├── embeddings.ts           # 384-dimensional vector embedding generator
│       └── sampleDocuments.ts      # Example policy collection for AI search
├── .env.example
├── tailwind.config.js
└── package.json
```

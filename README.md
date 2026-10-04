# ⚡ Supabase Playground

> **See what your backend is actually doing.**

An interactive educational playground built with **Next.js**, **TypeScript**, and **Tailwind CSS** that teaches beginners how Supabase works under the hood through simple, working interactive examples.

---

## 🧠 The Core Mental Model

```text
Your Frontend App  ───►  ⚡ Supabase Engine  ───►  Data / Files / Realtime / AI Search
```

Supabase is not just a database—it is a complete backend platform built around **PostgreSQL**. You build your frontend, and Supabase handles the database, storage, realtime websockets, auto-generated APIs, and vector AI search behind it.

---

## 🚀 Beginner Quick Start Guide

Follow these 5 simple steps to get the playground up and running on your computer.

### Step 1: Clone the Repository
Open your terminal or PowerShell and run:

```bash
git clone https://github.com/michaelkillgta/Supabase-playground.git
cd Supabase-playground
```

---

### Step 2: Install Dependencies
Ensure you have **Node.js** (v18 or higher) installed:

```bash
npm install
```

---

### Step 3: Set Up Your Free Supabase Backend

1. Go to [supabase.com](https://supabase.com) and create a free account (takes 30 seconds).
2. Click **New Project**, choose a name, and set a database password.
3. Once your project is ready, open the **SQL Editor** from the left sidebar:
   - Click **New Query**.
   - Copy the entire contents of [`supabase/schema.sql`](./supabase/schema.sql).
   - Paste into the editor and click **Run** (green button).

> [!NOTE]
> This one SQL script automatically:
> - Enables the **pgvector** AI extension.
> - Creates the `students` table with initial demo data.
> - Creates the `learning-files` storage bucket.
> - Creates the `live_counter` table and enables Realtime WebSockets.
> - Creates the `documents` table and cosine similarity search function (`match_documents`).

---

### Step 4: Configure Your Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   *(On Windows PowerShell, use: `Copy-Item .env.example .env.local`)*

2. Open `.env.local` in your editor and enter your Supabase project keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```

> 💡 **Where to find your keys in Supabase:**  
> Go to your project dashboard → **Project Settings** (gear icon) → **API** → Copy **Project URL** and **`anon` (public)** key.  
> *(No OpenAI or external embedding API key is needed—the playground includes a built-in semantic vectorizer!)*

---

### Step 5: Start the Development Server

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser!  
The status badge in the top-right corner will display **"Connected to Supabase"**!

---

## 🎮 Interactive Demos & Learning Objectives

| Tab | Core Concept | What You Can Do |
| :--- | :--- | :--- |
| **🗄️ Database** | PostgreSQL CRUD & instant APIs | Add students (`Name`, `Role`, `Score`) to the `students` table, fetch records, and trace the live request/response flow. |
| **📁 Storage** | Object storage vs database rows | Upload any PDF, image, or text file to the `learning-files` bucket and inspect persisted metadata with direct CDN links. |
| **⚡ Realtime** | WebSocket database replication | Open **two browser tabs** side-by-side, click **[ +1 ]**, and watch the counter update across both tabs in real-time without refreshing. |
| **✨ pgvector** | Vector embeddings & AI semantic search | Search company policies by meaning rather than keywords (e.g., *"Can I work remotely?"* matches the *"Work From Home Policy"* with 96% similarity). |
| **🛡️ Authentication** | User identity & sessions | Clean educational explanation of Supabase Auth (OAuth, OTP, email logins, sessions). |

---

## 🏗️ Architecture & Project Structure

```text
supabase-playground/
├── supabase/
│   └── schema.sql                  # PostgreSQL tables, storage bucket & pgvector RPC function
├── src/
│   ├── app/
│   │   ├── page.tsx                # Playground shell, navigation tabs & mental model banner
│   │   ├── layout.tsx              # Root HTML & typography layout
│   │   ├── globals.css             # Tailwind CSS & UI styling
│   │   └── api/
│   │       └── pgvector/
│   │           ├── search/route.ts # Server-side semantic embedding query endpoint
│   │           └── seed/route.ts   # Document embedding seed endpoint
│   ├── components/
│   │   ├── DatabaseDemo.tsx        # Students CRUD demo & live table inspector
│   │   ├── StorageDemo.tsx         # File upload to learning-files & live bucket inspector
│   │   ├── RealtimeDemo.tsx        # Multi-tab live counter with WebSockets sync
│   │   ├── PgvectorDemo.tsx        # AI semantic search, visual pipeline & comparison
│   │   ├── AuthNoticeCard.tsx      # Supabase Authentication explanation card
│   │   └── WhatIsSupabaseSummary.tsx # Bottom architecture & "So, what is Supabase?"
│   └── lib/
│       ├── supabaseClient.ts       # Supabase client initialization
│       ├── embeddings.ts           # 384-dimensional vector embedding generator
│       └── sampleDocuments.ts      # 5 Realistic company policy documents
├── .env.example                    # Environment variable template
├── tailwind.config.js
└── package.json
```

---

## ❓ Frequently Asked Questions (FAQ)

### 1. Does this work without a Supabase account?
Yes! If no Supabase credentials are provided, the playground automatically runs in **Interactive Demo Mode**, allowing you to explore the mental models, diagrams, and simulated data immediately.

### 2. Why don't I need an OpenAI or Gemini API key for pgvector?
For learning purposes, this repository includes an educational **384-dimensional semantic vector generator** directly inside the server (`src/lib/embeddings.ts`). It generates real mathematical embeddings and compares them with cosine similarity in PostgreSQL, with zero external API fees.

### 3. Where are my uploaded files stored in Supabase?
In your Supabase Dashboard, click **Storage** on the left menu, then open the **`learning-files`** bucket to view and download all uploaded files.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Storage, Realtime, pgvector)
- **Icons:** Lucide React

---

## 👤 Author

Developed by **michael** ([@michaelkillgta](https://github.com/michaelkillgta)).

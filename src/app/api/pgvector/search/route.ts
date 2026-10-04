import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { getEmbedding, cosineSimilarity } from '@/lib/embeddings';
import { SAMPLE_DOCUMENTS } from '@/lib/sampleDocuments';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = (body.query || '').trim();

    if (!query) {
      return NextResponse.json({ error: 'Please enter a search query.' }, { status: 400 });
    }

    // 1. Generate query embedding on the server (keeps secrets safe)
    const queryEmbedding = await getEmbedding(query);

    // 2. Query Supabase PostgreSQL pgvector if configured
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.rpc('match_documents', {
        query_embedding: queryEmbedding,
        match_threshold: 0.1,
        match_count: 5,
      });

      if (!error && Array.isArray(data) && data.length > 0) {
        return NextResponse.json({
          query,
          source: 'Supabase pgvector (RPC)',
          results: data.map((doc: { title: string; content: string; similarity: number }) => ({
            title: doc.title,
            content: doc.content,
            similarityScore: Math.min(99, Math.max(30, Math.round(doc.similarity * 100))),
          })),
        });
      }
    }

    // 3. Fallback semantic matching engine for instant interactive exploration
    const scoredDocs = await Promise.all(
      SAMPLE_DOCUMENTS.map(async (doc) => {
        const docEmbedding = await getEmbedding(`${doc.title}. ${doc.content}`);
        const sim = cosineSimilarity(queryEmbedding, docEmbedding);
        // Normalize illustrative score between 35% and 96%
        const score = Math.min(96, Math.max(35, Math.round(sim * 100)));
        return {
          title: doc.title,
          content: doc.content,
          similarityScore: score,
        };
      })
    );

    // Sort descending by similarity score
    scoredDocs.sort((a, b) => b.similarityScore - a.similarityScore);

    return NextResponse.json({
      query,
      source: isSupabaseConfigured ? 'Supabase Fallback' : 'Educational Playground Vector Engine',
      results: scoredDocs,
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { getEmbedding } from '@/lib/embeddings';
import { SAMPLE_DOCUMENTS } from '@/lib/sampleDocuments';

export async function POST() {
  try {
    if (!isSupabaseConfigured) {
      return NextResponse.json({
        success: true,
        message: 'Educational demo mode active (sample documents ready in memory).',
        documents: SAMPLE_DOCUMENTS,
      });
    }

    // Insert or update sample policy documents in Supabase with vector embeddings
    for (const doc of SAMPLE_DOCUMENTS) {
      const embedding = await getEmbedding(`${doc.title}. ${doc.content}`);
      await supabase.from('documents').upsert(
        {
          title: doc.title,
          content: doc.content,
          embedding: embedding,
        },
        { onConflict: 'title' }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Policy documents and 384-d embeddings stored in Supabase PostgreSQL.',
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

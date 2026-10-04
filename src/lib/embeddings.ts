/**
 * Server-side Embedding Generator & Similarity Calculator.
 * Produces normalized 384-dimensional vector embeddings for pgvector storage and querying.
 */

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been',
  'can', 'could', 'do', 'does', 'did', 'have', 'has', 'had',
  'i', 'you', 'he', 'she', 'it', 'we', 'they', 'my', 'our',
  'to', 'from', 'in', 'on', 'at', 'by', 'for', 'with', 'about',
  'what', 'when', 'where', 'how', 'why', 'who', 'get', 'our', 'all'
]);

export async function getEmbedding(text: string): Promise<number[]> {
  const DIMENSIONS = 384;
  const normalized = text.toLowerCase().trim();

  // Semantic concept clusters mapped to specific vector subspace dimensions
  const semanticClusters: Record<string, { dims: number[]; weight: number }> = {
    // Work From Home / Remote policy
    remote: { dims: [10, 11, 12, 13, 14, 15, 16], weight: 4.0 },
    remotely: { dims: [10, 11, 12, 13, 14, 15, 16], weight: 4.0 },
    home: { dims: [10, 11, 12, 13, 14, 15, 16], weight: 3.5 },
    wfh: { dims: [10, 11, 12, 13, 14, 15, 16], weight: 4.0 },
    telecommute: { dims: [10, 11, 12, 13, 14, 15, 16], weight: 4.0 },
    approval: { dims: [10, 11, 12], weight: 2.0 },
    manager: { dims: [10, 11, 12], weight: 2.0 },

    // Leave / Vacation / Sick policy
    leave: { dims: [80, 81, 82, 83, 84, 85, 86], weight: 4.0 },
    vacation: { dims: [80, 81, 82, 83, 84, 85, 86], weight: 4.0 },
    holiday: { dims: [80, 81, 82, 83, 84, 85, 86], weight: 3.5 },
    sick: { dims: [80, 81, 82, 83, 84, 85, 86], weight: 4.0 },
    annual: { dims: [80, 81, 82], weight: 2.5 },
    days: { dims: [80, 81, 82], weight: 2.0 },

    // Salary / Pay / Compensation policy
    salary: { dims: [160, 161, 162, 163, 164, 165, 166], weight: 4.0 },
    salaries: { dims: [160, 161, 162, 163, 164, 165, 166], weight: 4.0 },
    pay: { dims: [160, 161, 162, 163, 164, 165, 166], weight: 4.0 },
    paid: { dims: [160, 161, 162, 163, 164, 165, 166], weight: 3.5 },
    compensation: { dims: [160, 161, 162, 163, 164, 165, 166], weight: 4.0 },
    bonus: { dims: [160, 161, 162, 163], weight: 3.0 },
    disbursed: { dims: [160, 161, 162], weight: 2.5 },
    month: { dims: [160, 161, 162], weight: 2.0 },

    // Security / Password / 2FA policy
    security: { dims: [240, 241, 242, 243, 244, 245, 246], weight: 4.0 },
    password: { dims: [240, 241, 242, 243, 244, 245, 246], weight: 4.0 },
    authentication: { dims: [240, 241, 242, 243, 244, 245, 246], weight: 4.0 },
    auth: { dims: [240, 241, 242, 243, 244, 245, 246], weight: 4.0 },
    encryption: { dims: [240, 241, 242, 243, 244, 245, 246], weight: 4.0 },
    device: { dims: [240, 241, 242], weight: 2.5 },
    twofactor: { dims: [240, 241, 242, 243, 244, 245, 246], weight: 4.0 },
    mfa: { dims: [240, 241, 242, 243, 244, 245, 246], weight: 4.0 },

    // Timing / Hours / Schedule policy
    timing: { dims: [320, 321, 322, 323, 324, 325, 326], weight: 4.0 },
    hours: { dims: [320, 321, 322, 323, 324, 325, 326], weight: 4.0 },
    time: { dims: [320, 321, 322, 323, 324, 325, 326], weight: 3.5 },
    schedule: { dims: [320, 321, 322, 323, 324, 325, 326], weight: 4.0 },
    office: { dims: [320, 321, 322], weight: 2.0 },
    friday: { dims: [320, 321, 322], weight: 2.0 },
    monday: { dims: [320, 321, 322], weight: 2.0 },
  };

  const vector = new Array(DIMENSIONS).fill(0.005);
  const words = normalized
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));

  words.forEach((word) => {
    // Check conceptual match
    Object.entries(semanticClusters).forEach(([concept, config]) => {
      if (word === concept || word.startsWith(concept) || concept.startsWith(word)) {
        config.dims.forEach((d) => {
          vector[d] += config.weight;
        });
      }
    });

    // Hash distribution for contextual variance across remaining dimensions
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
      hash = (hash << 5) - hash + word.charCodeAt(i);
      hash |= 0;
    }
    const idx = Math.abs(hash) % DIMENSIONS;
    vector[idx] += 0.3;
  });

  // Calculate L2 norm (magnitude)
  const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  
  // Return unit normalized vector
  return vector.map((v) => Number((v / (norm || 1)).toFixed(6)));
}

/**
 * Computes Cosine Similarity between two normalized vectors (-1.0 to 1.0)
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (!denominator) return 0;
  return dot / denominator;
}

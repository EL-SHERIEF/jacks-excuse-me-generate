import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Excuse {
  id: string;
  tone: 'funny' | 'believable' | 'dramatic';
  excuse_text: string;
  excuse_tips: string;
  likes_count: number;
  shares_count: number;
  copies_count: number;
  created_at: string;
  user_id?: string;
}

export interface Interaction {
  id: string;
  excuse_id: string;
  user_id?: string;
  interaction_type: 'like' | 'share' | 'copy';
  created_at: string;
}

export async function getTopExcuses(limit: number = 10): Promise<Excuse[]> {
  const { data, error } = await supabase
    .from('excuses')
    .select('*')
    .order('likes_count', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching top excuses:', error);
    return [];
  }

  return data || [];
}

export async function saveExcuse(excuse: Omit<Excuse, 'id' | 'created_at' | 'likes_count' | 'shares_count' | 'copies_count'>): Promise<Excuse | null> {
  const { data, error } = await supabase
    .from('excuses')
    .insert([excuse])
    .select()
    .single();

  if (error) {
    console.error('Error saving excuse:', error);
    return null;
  }

  return data;
}

export async function incrementExcuseCount(excuseId: string, countType: 'likes_count' | 'shares_count' | 'copies_count'): Promise<void> {
  const { data: excuse } = await supabase
    .from('excuses')
    .select(countType)
    .eq('id', excuseId)
    .maybeSingle();

  if (excuse) {
    const excuseData = excuse as Record<string, number>;
    const currentCount = excuseData[countType];
    if (typeof currentCount === 'number') {
      await supabase
        .from('excuses')
        .update({ [countType]: currentCount + 1 })
        .eq('id', excuseId);
    }
  }
}

export async function saveInteraction(interaction: Omit<Interaction, 'id' | 'created_at'>): Promise<void> {
  await supabase
    .from('interactions')
    .insert([interaction]);
}

'use server';

// Server actions for managing scores in the Golf Charity Platform securely
import { createServerSupabaseClient } from '@/lib/supabase';
import { requireActiveSubscription, requireUser } from '@/lib/auth-utils';
import { revalidatePath } from 'next/cache';

export async function getUserScores(userId: string) {
  try {
    const { supabase } = await requireUser();
    const { data: scores, error } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', userId)
      .order('played_at', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[GET_SCORES_ERROR]', { userId, error: error.message });
      throw new Error(error.message);
    }
    return scores || [];
  } catch (err: unknown) {
    console.error('[GET_SCORES_CRITICAL]', err);
    return [];
  }
}

export async function addScore(score: number, playedAt: Date) {
  try {
    let supabase, user;
    try {
      const auth = await requireActiveSubscription();
      supabase = auth.supabase;
      user = auth.user;
    } catch (e: any) {
      return { error: e.message };
    }

    // Defensive Server-Side logic handling edge cases natively
    if (!Number.isInteger(score) || score < 1 || score > 45) {
      return { error: 'Score must explicitly be an integer bounded between 1 and 45.' };
    }
    
    const now = new Date();
    if (new Date(playedAt) > now) {
      return { error: 'Reflected score date mathematically cannot be in the future.' };
    }

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    if (new Date(playedAt) < oneYearAgo) {
      return { error: 'Reflected score date mathematically cannot be greater than 1 year ago.' };
    }

    // Insert to the backend — any max 5 logic constraint is flawlessly delegated via DB Triggers
    const { error } = await supabase
      .from('scores')
      .insert({
        user_id: user.id,
        score,
        // Date formatting purely YYYY-MM-DD
        played_at: playedAt.toISOString().split('T')[0], 
      });

    if (error) {
      console.error('[ADD_SCORE_ERROR]', { userId: user.id, score, error: error.message });
      return { error: error.message };
    }

    revalidatePath('/dashboard/scores');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err: unknown) {
    console.error('[ADD_SCORE_CRITICAL]', err);
    return { error: 'A critical data ingestion fault occurred.' };
  }
}

export async function deleteScore(scoreId: string) {
  try {
    let supabase, user;
    try {
      const auth = await requireUser();
      supabase = auth.supabase;
      user = auth.user;
    } catch (e: any) {
      return { error: e.message };
    }

    const { error } = await supabase
      .from('scores')
      .delete()
      // Explicit matching ensures strict parameter ownership mathematically mitigating row hopping
      .match({ id: scoreId, user_id: user.id });

    if (error) {
      console.error('[DELETE_SCORE_ERROR]', { scoreId, userId: user.id, error: error.message });
      return { error: error.message };
    }
    
    revalidatePath('/dashboard/scores');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err: unknown) {
    console.error('[DELETE_SCORE_CRITICAL]', err);
    return { error: 'Data removal boundary fault.' };
  }
}

export async function updateScore(scoreId: string, score: number) {
  try {
    let supabase, user;
    try {
      const auth = await requireActiveSubscription();
      supabase = auth.supabase;
      user = auth.user;
    } catch (e: any) {
      return { error: e.message };
    }

    // High-fidelity validation: 1-45 Stableford scale
    if (!Number.isInteger(score) || score < 1 || score > 45) {
      return { error: 'Score verification failure: Bound mismatch (1-45).' };
    }

    const { error: updateError } = await supabase
      .from('scores')
      .update({ score })
      .match({ id: scoreId, user_id: user.id });

    if (updateError) {
       console.error('[UPDATE_SCORE_ERROR]', updateError.message);
       return { error: updateError.message };
    }

    revalidatePath('/dashboard/scores');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err: unknown) {
    console.error('[UPDATE_SCORE_CRITICAL]', err);
    return { error: 'Performance record update fault.' };
  }
}

'use server';

// Administrative server actions for managing users and subscriptions
import { createServerSupabaseClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth-utils';
import { revalidatePath } from 'next/cache';

/**
 * Fetches all users with pagination and optional filtering.
 */
export async function getAllUsers(page: number = 1, filters?: { query?: string, status?: string, plan?: string }) {
  const { supabase } = await requireAdmin();
  const limit = 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let queryBuilder = supabase
    .from('profiles')
    .select(`
      *,
      scores (id),
      charities (name)
    `, { count: 'exact' });

  // Add text search
  if (filters?.query) {
    queryBuilder = queryBuilder.or(`full_name.ilike.%${filters.query}%,email.ilike.%${filters.query}%`);
  }

  // Add status and plan filters
  if (filters?.status) {
    queryBuilder = queryBuilder.eq('subscription_status', filters.status);
  }
  if (filters?.plan) {
    queryBuilder = queryBuilder.eq('subscription_plan', filters.plan);
  }

  const { data, count, error } = await queryBuilder
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw new Error(error.message);

  return {
    users: data || [],
    totalCount: count || 0,
    totalPages: Math.ceil((count || 0) / limit)
  };
}

/**
 * Returns a specific user with their score and draw history.
 */
export async function getUserById(id: string) {
  const { supabase } = await requireAdmin();
  
  const [profileRes, scoresRes, resultsRes] = await Promise.all([
    supabase.from('profiles').select('*, charities(name)').eq('id', id).single(),
    supabase.from('scores').select('*').eq('user_id', id).order('played_at', { ascending: false }),
    supabase.from('draw_results').select('*, draws(month)').eq('user_id', id).order('created_at', { ascending: false })
  ]);

  if (profileRes.error) throw new Error(profileRes.error.message);

  return {
    profile: profileRes.data,
    scores: scoresRes.data || [],
    drawResults: resultsRes.data || []
  };
}

/**
 * Manually updates a user's subscription status.
 */
export async function updateUserSubscriptionStatus(userId: string, status: 'active' | 'inactive' | 'lapsed' | 'cancelled') {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from('profiles')
    .update({ subscription_status: status })
    .eq('id', userId);

  if (error) return { error: error.message };
  
  revalidatePath(`/admin/users/${userId}`);
  return { success: true };
}

/**
 * Admin deletion of an individual score.
 */
export async function deleteUserScore(scoreId: string, userId: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from('scores')
    .delete()
    .eq('id', scoreId);

  if (error) return { error: error.message };

  revalidatePath(`/admin/users/${userId}`);
  return { success: true };
}

'use server';

// Server actions for managing draw records and triggering the draw-runner logic
import { createServerSupabaseClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth-utils';
import { revalidatePath } from 'next/cache';

/**
 * Creates a new draft draw record for a specific month.
 * Ensures only one draw exists per month.
 */
export async function createDraw(year: number, month: number, logicType: 'random' | 'algorithmic') {
  try {
    let supabase;
    try {
      const auth = await requireAdmin();
      supabase = auth.supabase;
    } catch (e: any) {
      return { error: e.message };
    }
    
    // Build month string directly from local year/month — no Date timezone shifting
    const normalizedMonth = `${year}-${String(month + 1).padStart(2, '0')}-01`;

    // Check if draw already exists for this month
    const { data: existing } = await supabase
      .from('draws')
      .select('id')
      .eq('month', normalizedMonth)
      .single();

    if (existing) {
      return { error: 'A draw already exists for this month.' };
    }

    const { data, error } = await supabase
      .from('draws')
      .insert({
        month: normalizedMonth,
        logic_type: logicType,
        status: 'draft'
      })
      .select()
      .single();

    if (error) {
      console.error('[CREATE_DRAW_ERROR]', { month: normalizedMonth, error: error.message });
      return { error: error.message };
    }
    
    revalidatePath('/admin/draws');
    return { success: true, draw: data };
  } catch (err) {
    console.error('[CREATE_DRAW_CRITICAL]', err);
    return { error: 'Structural generation fault during draw setup.' };
  }
}

/**
 * Returns all draws sorted by month descending.
 */
export async function getDraws() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('draws')
      .select('*')
      .order('month', { ascending: false });

    if (error) {
      console.error('[GET_DRAWS_ERROR]', { error: error.message });
      throw new Error(error.message);
    }
    return data || [];
  } catch (err) {
    console.error('[GET_DRAWS_CRITICAL]', err);
    return [];
  }
}

/**
 * Returns a specific draw with its results summary.
 */
export async function getDrawById(id: string) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: draw, error } = await supabase
      .from('draws')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('[GET_DRAW_BY_ID_ERROR]', { id, error: error.message });
      return { error: error.message };
    }

    const { data: results } = await supabase
      .from('draw_results')
      .select('*')
      .eq('draw_id', id);

    return { draw, results: results || [] };
  } catch (err) {
    console.error('[GET_DRAW_BY_ID_CRITICAL]', err);
    return { error: 'Boundary lookup failure.' };
  }
}

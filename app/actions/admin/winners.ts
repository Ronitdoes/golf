'use server';

// Administrative server actions for verifying draw results and managing the payout lifecycle
import { createServerSupabaseClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth-utils';
import { revalidatePath } from 'next/cache';

/**
 * Fetches all winners based on status filters.
 */
export async function getWinnersByStatus(status?: 'pending' | 'paid') {
  const { supabase } = await requireAdmin();
  
  let query = supabase
    .from('draw_results')
    .select(`
      *,
      profiles (full_name, email),
      draws (month)
    `)
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('payment_status', status);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  
  return data || [];
}

/**
 * Fetches specific draw result with all verified context.
 */
export async function getWinnerResultById(id: string) {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from('draw_results')
    .select(`
      *,
      profiles (
        full_name, 
        email,
        scores (score)
      ),
      draws (month, drawn_numbers)
    `)
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

import { sendWinnerApprovedEmail } from '@/emails/winner-approved';
import { sendWinnerRejectedEmail } from '@/emails/winner-rejected';

/**
 * Approves a winner's proof and marks for pending payout.
 */
export async function approveWinner(id: string) {
  const { supabase } = await requireAdmin();
  
  // Need to fetch winner details first for email
  const winner = await getWinnerResultById(id);

  const { error } = await supabase
    .from('draw_results')
    .update({ 
       payment_status: 'paid',
       verified_at: new Date().toISOString() 
    })
    .eq('id', id);

  if (error) return { error: error.message };
  
  // Trigger Email Notification for Approval
  await sendWinnerApprovedEmail(winner.profiles.email, winner.profiles.full_name, winner.prize_amount);

  revalidatePath('/admin/winners');
  revalidatePath(`/admin/winners/${id}`);
  return { success: true };
}

/**
 * Rejects a winner's proof.
 */
export async function rejectWinner(id: string, reason: string) {
  const { supabase } = await requireAdmin();

  // Need to fetch winner details first for email
  const winner = await getWinnerResultById(id);

  const { error } = await supabase
    .from('draw_results')
    .update({ 
       payment_status: 'rejected',
    })
    .eq('id', id);

  if (error) return { error: error.message };
  
  // Trigger Email Notification for Rejection
  await sendWinnerRejectedEmail(winner.profiles.email, winner.profiles.full_name, reason);

  revalidatePath('/admin/winners');
  revalidatePath(`/admin/winners/${id}`);
  return { success: true };
}

/**
 * Marks a prize as officially disbursed.
 */
export async function markAsPaid(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from('draw_results')
    .update({ 
       payment_status: 'paid',
       verified_at: new Date().toISOString() // Or separate paid_at if schema expanded
    })
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/winners');
  revalidatePath(`/admin/winners/${id}`);
  return { success: true };
}

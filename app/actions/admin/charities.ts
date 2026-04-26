'use server';

// Administrative server actions for managing charities and their upcoming events agenda
import { createServerSupabaseClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth-utils';
import { revalidatePath } from 'next/cache';

/**
 * Creates a new charity record and manages visual mapping.
 */
export async function createCharity(formData: {
  name: string;
  description: string;
  website_url: string;
  image_url: string;
  is_featured: boolean;
  is_active: boolean;
}) {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from('charities')
    .insert(formData)
    .select()
    .single();

  if (error) return { error: error.message };
  
  revalidatePath('/admin/charities');
  revalidatePath('/charities');
  return { success: true, charity: data };
}

/**
 * Updates an existing charity's metadata and visual identifiers.
 */
export async function updateCharity(id: string, formData: Partial<{
  name: string;
  description: string;
  website_url: string;
  image_url: string;
  is_featured: boolean;
  is_active: boolean;
}>) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from('charities')
    .update(formData)
    .eq('id', id);

  if (error) return { error: error.message };
  
  revalidatePath('/admin/charities');
  revalidatePath(`/admin/charities/${id}`);
  revalidatePath('/charities');
  revalidatePath(`/charities/${id}`);
  return { success: true };
}

/**
 * Soft-deletion for charities, ensuring no active mapping is compromised.
 */
export async function deleteCharity(id: string) {
  const { supabase } = await requireAdmin();
  
  // Check if any users have this charity selected
  const { count } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('selected_charity_id', id);

  if (count && count > 0) {
    return { error: 'Physically blocked. This organization is currently actively selected by verified subscribers.' };
  }

  const { error } = await supabase
    .from('charities')
    .update({ is_active: false })
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/charities');
  return { success: true };
}

/**
 * Adds an upcoming event activation to a charity's agenda.
 */
export async function addCharityEvent(charityId: string, eventData: {
  title: string;
  description: string;
  event_date: string;
  location: string;
}) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from('charity_events')
    .insert({ ...eventData, charity_id: charityId });

  if (error) return { error: error.message };
  
  revalidatePath(`/admin/charities/${charityId}`);
  revalidatePath(`/charities/${charityId}`);
  return { success: true };
}

/**
 * Removes an event activation from a charity's agenda.
 */
export async function deleteCharityEvent(eventId: string, charityId: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from('charity_events')
    .delete()
    .eq('id', eventId);

  if (error) return { error: error.message };
  
  revalidatePath(`/admin/charities/${charityId}`);
  revalidatePath(`/charities/${charityId}`);
  return { success: true };
}

/**
 * Returns all charities with subscriber counts.
 */
export async function getAllCharitiesAdmin() {
  const { supabase } = await requireAdmin();
  
  // Aggregate using manual mapping due to count-aware selectivity in profile relations
  const { data: charities } = await supabase
    .from('charities')
    .select('*')
    .order('name');
    
  if (!charities) return [];

  const { data: profiles } = await supabase
    .from('profiles')
    .select('selected_charity_id');

  const countMap: Record<string, number> = {};
  profiles?.forEach(p => {
    if (p.selected_charity_id) {
       countMap[p.selected_charity_id] = (countMap[p.selected_charity_id] || 0) + 1;
    }
  });

  return charities.map(c => ({
    ...c,
    subscriberCount: countMap[c.id] || 0
  }));
}

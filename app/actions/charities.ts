'use server';

// Server actions handling global charity querying and authenticating explicit contribution parameter adjustments
import { createServerSupabaseClient } from '@/lib/supabase';
import { requireUser } from '@/lib/auth-utils';
import { revalidatePath } from 'next/cache';

export async function getCharities(featuredOnly = false) {
  const supabase = await createServerSupabaseClient();
  let query = supabase.from('charities').select('*').eq('is_active', true).order('name');
  
  // Conditionally isolated query limiting to explicit flag bindings
  if (featuredOnly) {
    query = query.eq('is_featured', true);
  }
  
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  
  return data || [];
}

export async function getCharityById(id: string) {
  const supabase = await createServerSupabaseClient();
  
  const { data: charity, error } = await supabase
    .from('charities')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);

  const { data: events } = await supabase
    .from('charity_events')
    .select('*')
    .eq('charity_id', id)
    .gte('event_date', new Date().toISOString())
    .order('event_date', { ascending: true });
  
  return { charity, events: events || [] };
}

export async function selectCharity(charityId: string) {
  let user, supabase;
  try {
    const auth = await requireUser();
    supabase = auth.supabase;
    user = auth.user;
  } catch (e: any) {
    return { error: 'Not authenticated natively.' };
  }

  const { error } = await supabase
    .from('profiles')
    .update({ selected_charity_id: charityId })
    .eq('id', user.id);

  if (error) return { error: error.message };

  // Actively invalidate routing caches ensuring subsequent dashboard calls hydrate accurately
  revalidatePath('/dashboard/charity');
  revalidatePath('/dashboard');
  
  return { success: true };
}


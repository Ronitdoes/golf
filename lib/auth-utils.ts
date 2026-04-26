import { createServerSupabaseClient } from './supabase';

/**
 * Requires an authenticated user.
 * Throws an error if the user is not authenticated.
 */
export async function requireUser() {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    throw new Error('Not authenticated.');
  }
  
  return { supabase, user };
}

/**
 * Requires an authenticated user with an active subscription.
 * Throws an error if the user is not authenticated or their subscription is inactive.
 */
export async function requireActiveSubscription() {
  const { supabase, user } = await requireUser();
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status')
    .eq('id', user.id)
    .single();

  if (profile?.subscription_status !== 'active') {
    throw new Error('Subscriber integrity check failed. Account inactive.');
  }

  return { supabase, user, profile };
}

/**
 * Requires an authenticated user with admin privileges.
 * Throws an error if the user is not authenticated or is not an admin.
 */
export async function requireAdmin() {
  const { supabase, user } = await requireUser();
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin, full_name')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) {
    throw new Error('Administrative privileges required.');
  }

  return { supabase, user, profile };
}

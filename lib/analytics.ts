'use server';

// Aggregation logic for administrative data visualization and platform performance monitoring
import { createServerSupabaseClient } from '@/lib/supabase';

import { calculateMonthlyPrizePool } from '@/lib/prize-pool';

/**
 * Aggregates subscriber counts and revenue estimates.
 */
export async function getSubscriberStats() {
  const supabase = await createServerSupabaseClient();
  
  const { data: profiles } = await supabase
    .from('profiles')
    .select('subscription_status, subscription_plan, is_admin');

  // Filter out admins so they don't skew the business analytics
  const realProfiles = profiles?.filter(p => !p.is_admin) || [];

  const stats = {
    total: realProfiles.length,
    active: realProfiles.filter(p => p.subscription_status === 'active').length,
    monthly: realProfiles.filter(p => p.subscription_status === 'active' && p.subscription_plan === 'monthly').length,
    yearly: realProfiles.filter(p => p.subscription_status === 'active' && p.subscription_plan === 'yearly').length,
  };

  // Estimated Monthly Recurring Revenue (MRR)
  // Monthly price: £10, Yearly: £96 (£8.00/mo)
  const mrr = (stats.monthly * 10) + (stats.yearly * (96 / 12));

  const poolData = await calculateMonthlyPrizePool();

  return { ...stats, mrr, profit: poolData.profit };
}

/**
 * Aggregates prize distribution history across all cycles.
 */
export async function getPrizePoolStats() {
  const supabase = await createServerSupabaseClient();
  
  const { data: draws } = await supabase
    .from('draws')
    .select('total_prize_pool, jackpot_rollover_amount, month, status')
    .eq('status', 'published');

  const totalPaid = draws?.reduce((acc, d) => acc + Number(d.total_prize_pool || 0), 0) || 0;

  const history = draws?.map(d => ({
    month: new Date(d.month + 'T00:00:00Z').toLocaleDateString(undefined, { month: 'short' }),
    amount: Number(d.total_prize_pool || 0)
  })) || [];

  return { totalPaid, history };
}

/**
 * Aggregates charity impact data per organization.
 */
export async function getCharityStats() {
  const supabase = await createServerSupabaseClient();
  
  const { data: charities } = await supabase
    .from('charities')
    .select('id, name');

  const { data: contributions } = await supabase
    .from('charity_draw_contributions')
    .select('charity_id, amount');

  const { data: profiles } = await supabase
    .from('profiles')
    .select('selected_charity_id, subscription_status, subscription_plan, charity_contribution_percentage, is_admin');

  // Exclude admin records
  const activeProfiles = profiles?.filter(p => p.subscription_status === 'active' && !p.is_admin) || [];
  
  const impactMap: Record<string, number> = {};
  
  // 1. Add historical draw contributions
  contributions?.forEach(c => {
    if (c.charity_id) {
       impactMap[c.charity_id] = (impactMap[c.charity_id] || 0) + Number(c.amount || 0);
    }
  });

  // 2. Add current MRR subscription money (based on their chosen percentage)
  activeProfiles.forEach(p => {
    if (p.selected_charity_id) {
       const planRevenue = p.subscription_plan === 'yearly' ? 8 : 10;
       const pct = (p.charity_contribution_percentage >= 10 ? p.charity_contribution_percentage : 10) / 100;
       const contribution = planRevenue * pct; 
       impactMap[p.selected_charity_id] = (impactMap[p.selected_charity_id] || 0) + contribution;
    }
  });

  const totalImpact = Object.values(impactMap).reduce((acc, val) => acc + val, 0);

  const breakdown = charities?.map(c => ({
    name: c.name,
    value: Math.round(impactMap[c.id] || 0)
  })).filter(b => b.value > 0) || [];

  return { totalImpact, breakdown };
}

/**
 * Aggregates general draw performance and frequency data.
 */
export async function getDrawStats() {
  const supabase = await createServerSupabaseClient();
  
  const { data: draws } = await supabase
    .from('draws')
    .select('id, drawn_numbers')
    .eq('status', 'published');

  const drawsRun = draws?.length || 0;
  
  // Calculate frequencies of drawn numbers
  const frequencies: Record<number, number> = {};
  draws?.forEach(d => {
    d.drawn_numbers?.forEach((n: number) => {
      frequencies[n] = (frequencies[n] || 0) + 1;
    });
  });

  const frequencyChart = Object.entries(frequencies)
    .map(([num, count]) => ({ number: Number(num), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return { drawsRun, frequencyChart };
}

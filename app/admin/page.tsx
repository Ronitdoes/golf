import { createServerSupabaseClient } from '@/lib/supabase';
import AdminDashboardClient from './DashboardView';

export default async function AdminDashboardPage() {
  const supabase = await createServerSupabaseClient();

  // Parallel data fetching for real-time metrics
  const [
    { count: totalPlayers },
    { count: activeCharities },
    { count: pendingPayouts },
    { data: activeSubscribers }
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('charities').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('draw_results').select('*', { count: 'exact', head: true }).eq('payment_status', 'pending'),
    supabase.from('profiles').select('subscription_plan').eq('subscription_status', 'active').eq('is_admin', false)
  ]);

  // Compute revenue directly from active subscribers' plan pricing
  // monthly = €10/mo | yearly = €96/yr (€8/mo effective)
  const revenueTotal = (activeSubscribers || []).reduce((acc, p) => {
    if (p.subscription_plan === 'monthly') return acc + 10;
    if (p.subscription_plan === 'yearly') return acc + 8;
    return acc;
  }, 0);

  const realStats = [
    { 
      label: 'Total Players', 
      value: (totalPlayers || 0).toLocaleString(), 
      change: 'Live', 
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' 
    },
    { 
      label: 'Monthly Revenue', 
      value: `€${revenueTotal.toLocaleString()}`, 
      change: 'Active subscribers', 
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' 
    },
    { 
      label: 'Active Charities', 
      value: (activeCharities || 0).toString(), 
      change: 'Active', 
      icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' 
    },
    { 
      label: 'Pending Payouts', 
      value: (pendingPayouts || 0).toString(), 
      change: 'Awaiting Verification', 
      icon: 'M13 10V3L4 14h7v7l9-11h-7z' 
    },
  ];

  return <AdminDashboardClient stats={realStats} />;
}

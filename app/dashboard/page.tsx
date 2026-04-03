// Main dashboard overview utilizing SSR concurrent queries efficiently displaying global summary statistics
import { createServerSupabaseClient } from '@/lib/supabase';
import StatCard from '@/components/dashboard/StatCard';
import Link from 'next/link';

export default async function DashboardOverview() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Concurrent data fetching natively retrieving aggregate boundaries safely without RLS leakage
  const [
    { data: profile },
    { count: scoreCount },
    { count: drawCount },
    { data: winnings }
  ] = await Promise.all([
    supabase.from('profiles').select('subscription_status, subscription_plan, charity_contribution_percentage').eq('id', user!.id).single(),
    supabase.from('scores').select('*', { count: 'exact', head: true }).eq('user_id', user!.id),
    supabase.from('draw_results').select('*', { count: 'exact', head: true }).eq('user_id', user!.id),
    supabase.from('draw_results').select('prize_amount').eq('user_id', user!.id)
  ]);

  const totalWinnings = winnings?.reduce((acc, curr) => acc + Number(curr.prize_amount), 0) || 0;
  const isInactive = profile?.subscription_status !== 'active';

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-black text-white tracking-tighter">Platform Overview</h1>
              {profile?.subscription_status === 'active' && (
                <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-black uppercase tracking-widest rounded-full">Pro Node</span>
              )}
           </div>
          <p className="text-white/30 font-bold">Track your participation, charities, and prize statistics simultaneously.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/dashboard/scores" className="px-6 py-3 bg-green-500 hover:bg-green-400 text-neutral-950 font-black rounded-xl transition-all text-sm shadow-lg hover:scale-[1.02] active:scale-95">
            Enter Score
          </Link>
          <Link href="/dashboard/draws" className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all text-sm border border-white/10">
            View Draws
          </Link>
        </div>
      </div>

      {isInactive && (
        <div className="relative group overflow-hidden bg-gradient-to-r from-green-600 to-green-400 rounded-3xl p-8 md:p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 animate-in zoom-in-95 duration-700 delay-300 fill-mode-both">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/20 transition-all duration-700" />
          <div className="relative z-10 space-y-2 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-black text-neutral-950 tracking-tighter">Membership Required</h2>
            <p className="text-neutral-900/60 font-bold max-w-md">Your account is currently in limited mode. Activate your high-fidelity subscription via Razorpay to enter monthly draws.</p>
          </div>
          <Link 
            href="/#membership" 
            className="relative z-10 px-10 py-5 bg-neutral-950 text-white font-black rounded-2xl shadow-2xl hover:scale-[1.05] active:scale-95 transition-all text-lg tracking-tight group-hover:bg-black"
          >
            Activate Now
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Scores Logged" 
          value={`${scoreCount || 0}/5`} 
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
        />
        <StatCard 
          title="Charity Allocation" 
          value={`${profile?.charity_contribution_percentage || 10}%`} 
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
        />
        <StatCard 
          title="Draws Entered" 
          value={drawCount || 0} 
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>}
        />
        <StatCard 
          title="Total Winnings" 
          value={`£${totalWinnings.toFixed(2)}`} 
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </div>

    </div>
  );
}

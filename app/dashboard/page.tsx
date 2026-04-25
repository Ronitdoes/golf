// Main dashboard overview utilizing SSR concurrent queries efficiently displaying global summary statistics
import { createServerSupabaseClient } from '@/lib/supabase';
import StatCard from '@/components/dashboard/StatCard';
import Link from 'next/link';

export default async function DashboardOverview({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { payment } = await searchParams;
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Persist sandbox success state to database natively to ensure persistent access
  if (payment === 'success' && process.env.CASHFREE_ENVIRONMENT === 'SANDBOX') {
    await supabase
      .from('profiles')
      .update({ subscription_status: 'active', subscription_plan: 'monthly' })
      .eq('id', user!.id);
  }

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
  const isSandbox = process.env.CASHFREE_ENVIRONMENT === 'SANDBOX';
  const isInactive = profile?.subscription_status !== 'active' && !isSandbox;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
      
      {payment === 'success' && (
        <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-4 duration-500">
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-black uppercase text-xs tracking-widest">Protocol Synchronized</h3>
            <p className="text-white/40 text-sm font-bold">Your subscription has been successfully verified. Welcome to the elite tier.</p>
          </div>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-4">
           <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black text-green-500 uppercase tracking-[0.4em] mb-1">Operational Status</span>
              <div className="flex items-center gap-4">
                <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-black text-white tracking-tighter leading-[0.9]">Platform<br/>Overview</h1>
                {(profile?.subscription_status === 'active' || isSandbox) && (
                  <div className="px-4 py-1.5 bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-[0_0_15px_rgba(34,197,94,0.1)]">Pro Node</div>
                )}
              </div>
           </div>
          <p className="text-white/30 font-bold max-w-md">Concurrent data stream synchronizing your tactical participation and philanthropic impact.</p>
        </div>
        <div className="flex items-center gap-4 shrink-0 pb-2">
          <Link href="/dashboard/scores" className="px-8 py-4 bg-green-500 hover:bg-green-400 text-neutral-950 font-black rounded-[1.25rem] transition-all text-sm shadow-[0_10px_30px_rgba(16,185,129,0.2)] hover:scale-[1.05] active:scale-95 uppercase tracking-widest">
            Enter Score
          </Link>
          <Link href="/dashboard/draws" className="px-8 py-4 bg-white/[0.03] hover:bg-white/[0.06] text-white font-black rounded-[1.25rem] transition-all text-sm border border-white/10 uppercase tracking-widest">
            View Draws
          </Link>
        </div>
      </div>

      {isInactive && (
        <div className="relative group overflow-hidden bg-white/[0.01] border border-white/5 rounded-[3rem] p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 animate-in zoom-in-95 duration-1000 delay-300 fill-mode-both">
          <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-green-500/[0.03] rounded-full -mr-40 -mt-40 blur-[100px] group-hover:bg-green-500/[0.05] transition-all duration-1000" />
          <div className="relative z-10 space-y-4 text-center md:text-left">
            <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em]">Restricted Access</span>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight">Membership<br/>Synchronization Required</h2>
            <p className="text-white/30 font-bold max-w-md text-lg">Your terminal is currently in limited mode. Establish a high-fidelity subscription via Razorpay to unlock monthly jackpot eligibility.</p>
          </div>
          <Link 
            href="/#membership" 
            className="relative z-10 px-12 py-6 bg-white text-neutral-950 font-black rounded-[1.5rem] shadow-2xl hover:scale-[1.05] active:scale-95 transition-all text-xl tracking-tight hover:shadow-white/10"
          >
            ACTIVATE NODE
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard 
          title="Scores Logged" 
          value={`${scoreCount || 0}/5`} 
          desc="Participation Threshold"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
        />
        <StatCard 
          title="Charity Allocation" 
          value={`${profile?.charity_contribution_percentage || 10}%`} 
          desc="Philanthropic Weight"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
        />
        <StatCard 
          title="Draws Entered" 
          value={drawCount || 0} 
          desc="Historical Intersections"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>}
        />
        <StatCard 
          title="Total Winnings" 
          value={`$${totalWinnings.toFixed(2)}`} 
          desc="Cumulative Yield"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </div>

    </div>
  );
}

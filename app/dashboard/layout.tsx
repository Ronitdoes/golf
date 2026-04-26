// Dashboard layout handling Sidebar (desktop) and Bottom Tabs (mobile), while enforcing strict Auth/Subscription access explicitly natively

import { requireUser } from '@/lib/auth-utils';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
import Link from 'next/link';
import Image from 'next/image';
import { signOut } from '@/app/actions/auth';

import { DashboardNav } from './_components/DashboardNav';

const NAV_ITEMS = [
  { label: 'Overview', href: '/dashboard', exact: true, icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
  { label: 'Scores', href: '/dashboard/scores', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { label: 'Charity', href: '/dashboard/charity', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
  { label: 'Draws', href: '/dashboard/draws', icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z' },
  { label: 'Winnings', href: '/dashboard/winnings', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { label: 'Settings', href: '/dashboard/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  let supabase, user;
  try {
    const auth = await requireUser();
    supabase = auth.supabase;
    user = auth.user;
  } catch (e) {
    return redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url, subscription_status')
    .eq('id', user.id)
    .single();

  // Allow access in sandbox mode or if active
  const isSandbox = process.env.CASHFREE_ENVIRONMENT === 'SANDBOX';
  if (profile?.subscription_status !== 'active' && !isSandbox) {
    redirect('/#membership');
  }

  const initialLet = profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="flex min-h-screen bg-neutral-950 text-neutral-200">
      
      {/* High-Fidelity Tactical Sidebar */}
      <aside className="hidden md:flex flex-col w-72 border-r border-white/5 bg-neutral-950 px-6 py-10 sticky top-0 h-screen shrink-0 overflow-y-auto custom-scrollbar">
        <div className="absolute top-0 left-0 w-full h-[50vh] bg-green-500/[0.01] blur-[100px] pointer-events-none" />
        
        <Link href="/dashboard" className="mb-16 px-2 transition-all hover:translate-x-1 inline-block">
          <span className="text-3xl font-black tracking-[-0.04em] text-white uppercase block leading-[0.9]">
            Player<br />Dashboard
          </span>
        </Link>
        
        <DashboardNav items={NAV_ITEMS} variant="sidebar" />



        {/* Profile Command Center */}
        <div className="border-t border-white/5 pt-10 px-2 flex items-center justify-between relative z-10 shrink-0">
           <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/20 blur-md rounded-full" />
                {profile?.avatar_url ? (
                  <Image src={profile.avatar_url} alt="Avatar" width={40} height={40} className="w-10 h-10 rounded-xl object-cover relative border border-white/10" />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center text-white font-black text-sm relative">{initialLet}</div>
                )}
              </div>
              <div className="flex flex-col">
                 <span className="text-xs font-black text-white uppercase tracking-tighter truncate max-w-[120px]">{profile?.full_name || 'User'}</span>
                 <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Active Node</span>
              </div>
           </div>
           <Link href="/" className="p-2.5 text-neutral-600 hover:text-white hover:bg-white/[0.05] rounded-xl transition-all" title="Exit Dashboard">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
             </svg>
           </Link>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative w-full bg-neutral-950 overflow-x-hidden">
        {/* Mobile Tacticle Header - Sticky for better accessibility */}
        <header className="md:hidden sticky top-0 flex items-center justify-between px-8 py-6 border-b border-white/5 bg-neutral-950/80 backdrop-blur-3xl shrink-0 z-50">
          <Link href="/dashboard" className="flex items-center">
            <span className="text-sm font-black text-white uppercase tracking-widest">Player Dashboard</span>
          </Link>
          <div className="flex items-center gap-4">
             <span className="text-[9px] font-black bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded-full uppercase tracking-widest">Live</span>
             <Link href="/" className="p-1 text-neutral-500 hover:text-white transition-colors" title="Exit Dashboard">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
             </Link>
          </div>
        </header>

        {/* Global Application Canvas */}
        <div className="relative w-full">
          {/* Environmental Foundy Lighting */}
          <div className="absolute top-0 left-0 w-[40vw] h-[40vw] bg-green-500/[0.03] blur-[150px] pointer-events-none" />
          <div className="absolute top-[-10%] left-[-10%] w-[30%] h-[30%] bg-green-500/[0.05] rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-green-500/[0.015] blur-[150px] pointer-events-none" />
          
          <div className="max-w-[100rem] mx-auto p-6 sm:p-10 md:p-16 pb-32 md:pb-16 relative z-10 w-full">
            {children}
          </div>
        </div>

        <DashboardNav items={NAV_ITEMS} variant="bottom-nav" />
      </main>

    </div>
  );
}

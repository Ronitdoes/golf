// Dashboard layout handling Sidebar (desktop) and Bottom Tabs (mobile), while enforcing strict Auth/Subscription access explicitly natively

import { createServerSupabaseClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { signOut } from '@/app/actions/auth';

const NAV_ITEMS = [
  { label: 'Overview', href: '/dashboard', exact: true, icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
  { label: 'Scores', href: '/dashboard/scores', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { label: 'My Charity', href: '/dashboard/charity', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
  { label: 'Draws', href: '/dashboard/draws', icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z' },
  { label: 'Winnings', href: '/dashboard/winnings', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url, subscription_status')
    .eq('id', user.id)
    .single();

  // Enforce rigid access explicitly checking exact database string outputs securely
  if (profile?.subscription_status !== 'active') {
    redirect('/#membership');
  }

  const initialLet = profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="flex h-screen bg-neutral-950 overflow-hidden text-neutral-200">
      
      {/* Desktop Sidebar securely mounted inherently fixed */}
      <aside className="hidden md:flex flex-col w-64 border-r border-neutral-800 bg-neutral-950 px-4 py-8">
        <Link href="/dashboard" className="flex items-center mb-10 px-2 group">
          <div className="w-8 h-8 rounded-full bg-green-500 mr-3 flex items-center justify-center group-hover:scale-105 transition-transform">
            <span className="text-neutral-950 font-bold text-sm">D</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Digital Heroes</span>
        </Link>
        
        <nav className="flex-1 space-y-2">
          {NAV_ITEMS.map((item) => (
            <Link key={item.label} href={item.href} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
              </svg>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Desktop Profile / Logout cleanly aligned natively */}
        <div className="mt-auto border-t border-neutral-800 pt-6 px-2 flex items-center justify-between">
           <div className="flex items-center gap-3">
              {profile?.avatar_url ? (
                <Image src={profile.avatar_url} alt="Avatar" width={36} height={36} className="w-9 h-9 rounded-full object-cover" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-white font-bold">{initialLet}</div>
              )}
              <div className="flex flex-col">
                 <span className="text-sm font-bold text-white truncate max-w-[100px]">{profile?.full_name || 'User'}</span>
                 <span className="text-xs text-green-400">Active</span>
              </div>
           </div>
           <form action={signOut}>
             <button type="submit" className="p-2 shrink-0 text-neutral-500 hover:text-white transition-colors" title="Sign Out">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
               </svg>
             </button>
           </form>
        </div>
      </aside>

      {/* Main Content Pane cleanly isolated scrolling */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Top Bar */}
        <header className="md:hidden flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950 shrink-0">
          <Link href="/dashboard" className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mr-2">
               <span className="text-neutral-950 font-bold text-sm">D</span>
            </div>
            <span className="text-lg font-bold text-white">Dashboard</span>
          </Link>
          <div className="flex items-center gap-3">
             <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-1 rounded-full font-medium">Active</span>
             <form action={signOut}>
               <button type="submit" className="p-1 text-neutral-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
               </button>
             </form>
          </div>
        </header>

        {/* Scrollable Children Canvas natively occupying viewport remaining bounds */}
        <div className="flex-1 overflow-y-auto w-full max-w-5xl mx-auto p-6 md:p-10 pb-24 md:pb-10">
           {children}
        </div>

        {/* Mobile Bottom Tab Navigation dynamically mounted permanently fixed */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-neutral-950 border-t border-neutral-800 flex items-center justify-around z-50 px-2 pb-safe" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          {NAV_ITEMS.map((item) => (
             <Link key={item.label} href={item.href} className="flex flex-col items-center flex-1 py-3 px-1 text-neutral-400 hover:text-green-400 transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={item.icon} />
               </svg>
               <span className="text-[10px] font-medium">{item.label}</span>
             </Link>
          ))}
        </nav>
      </main>

    </div>
  );
}

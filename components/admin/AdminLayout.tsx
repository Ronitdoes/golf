'use client';

// Administrative navigation and global layout using green accents for consistency with brand
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from '@/app/actions/auth';
import { useTransition } from 'react';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { label: 'Panel', href: '/admin', icon: 'M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm10 0h6v6h-6z' },
  { label: 'Users', href: '/admin/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  { label: 'Draws', href: '/admin/draws', icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { label: 'Charities', href: '/admin/charities', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
  { label: 'Winners', href: '/admin/winners', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
  { label: 'Analytics', href: '/admin/reports', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
];

export default function AdminLayout({ children, adminName }: { children: React.ReactNode, adminName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await signOut();
      router.push('/');
    });
  };

  return (
    <div className="flex min-h-screen bg-[#060606] selection:bg-green-500/30 selection:text-green-200 overflow-x-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat z-0" />
      <div className="fixed top-[-10%] left-[-5%] w-[35%] h-[35%] bg-green-500/10 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[35%] h-[35%] bg-green-500/5 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Sidebar Navigation - Reduced width to w-72 */}
      <aside className="w-72 bg-white/[0.01] border-r border-white/5 flex flex-col fixed h-full z-30 backdrop-blur-3xl shadow-[20px_0_50px_-20px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="p-8 border-b border-white/5 relative group">
          <Link href="/admin" className="transition-all hover:translate-x-1 inline-block">
            <span className="text-3xl font-black tracking-[-0.04em] text-white uppercase block leading-[0.9]">
              Admin<br />Panel
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-6 space-y-2 overflow-y-auto custom-scrollbar">
          {NAV_ITEMS.map((item, idx) => {
            const isActive = item.href === '/admin' 
              ? pathname === '/admin' 
              : pathname.startsWith(item.href);
            return (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={item.href}
              >
                <Link 
                  href={item.href}
                  className={`flex items-center gap-3 px-5 py-3.5 rounded-xl transition-all font-black text-[10px] uppercase tracking-[0.2em] group relative overflow-hidden ${isActive ? 'text-neutral-950' : 'text-white/40 hover:text-white'}`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="nav-bg"
                      className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 shadow-lg shadow-green-500/20 z-0"
                    />
                  )}
                  <div className="relative z-10 flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-neutral-950' : 'text-green-500/50 group-hover:text-green-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon} />
                    </svg>
                    <span className="truncate">{item.label}</span>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </nav>

        <div className="p-6 border-t border-white/5 backdrop-blur-xl bg-black/20 space-y-2">
           <Link href="/" className="flex items-center gap-3 px-5 py-3.5 text-[9px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-all bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.05]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a2 2 0 002 2h3a2 2 0 002-2V14a2 2 0 012-2h2a2 2 0 012 2v6a2 2 0 002 2h3a2 2 0 002-2V10L12 3m0 0l-7 7" /></svg>
              Exit Admin Panel
           </Link>
           <button 
             onClick={handleLogout}
             disabled={isPending}
             className="w-full flex items-center gap-3 px-5 py-3.5 text-[9px] font-black uppercase tracking-widest text-rose-500/60 hover:text-rose-500 hover:bg-rose-500/10 border border-rose-500/10 rounded-xl transition-all disabled:opacity-50"
           >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              {isPending ? 'Logging out...' : 'Terminate'}
           </button>
        </div>
      </aside>

      {/* Main Content Area - Increased margin slightly and adjusted padding */}
      <main className="flex-1 ml-72 flex flex-col min-h-screen relative z-10 overflow-x-hidden w-full">
        <header className="h-20 bg-white/[0.01] backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-20 shadow-sm shadow-black/50">
           <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.3em]">
              <span className="text-white/30 hidden sm:inline">Administrative Interface</span>
              <div className="w-1 h-1 rounded-full bg-green-500" />
              <span className="text-white">{pathname.split('/')[2] || 'Operations Panel'}</span>
           </div>

           <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                 <span className="text-xs font-black text-white tracking-tight">{adminName}</span>
                 <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1 h-1 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                    <span className="text-[8px] text-green-500/60 font-black uppercase tracking-[0.2em]">Verified Access</span>
                 </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 flex items-center justify-center font-black text-white text-base shadow-xl shrink-0">
                 {adminName[0]}
              </div>
           </div>
        </header>

        <div className="flex-1 p-8 sm:p-10 w-full max-w-[1600px] mx-auto overflow-x-hidden">
           {children}
        </div>
      </main>
    </div>
  );
}

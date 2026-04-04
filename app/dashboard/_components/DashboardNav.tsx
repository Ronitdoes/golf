'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
  icon: string;
  exact?: boolean;
}

interface NavProps {
  items: NavItem[];
  variant: 'sidebar' | 'bottom-nav';
}

export function DashboardNav({ items, variant }: NavProps) {
  const pathname = usePathname();

  if (variant === 'sidebar') {
    return (
      <nav className="flex-1 space-y-3 relative z-10 overflow-y-auto pr-2 custom-scrollbar">
        {items.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          
          return (
            <Link 
              key={item.label} 
              href={item.href} 
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl border transition-all group relative overflow-hidden ${
                isActive 
                  ? 'text-white bg-green-500/[0.03] border-transparent shadow-[0_0_30px_rgba(16,185,129,0.05)]' 
                  : 'text-neutral-500 hover:text-white hover:bg-white/[0.03] border-transparent hover:border-white/5'
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent pointer-events-none" />
              )}
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 shrink-0 transition-colors ${isActive ? 'text-green-500' : 'group-hover:text-green-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
              </svg>
              <span className={`font-black text-[11px] uppercase tracking-[0.2em] transition-all ${isActive ? 'translate-x-1 underline-offset-8 decoration-green-500/50' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    );
  }

  // Mobile Bottom Nav
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-neutral-950/80 backdrop-blur-3xl border-t border-white/5 flex items-center justify-around z-50 px-4 pb-8 pt-4">
      {items.map((item) => {
         const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
         
         return (
            <Link 
              key={item.label} 
              href={item.href} 
              className={`flex flex-col items-center flex-1 py-1 transition-all ${
                isActive ? 'text-green-500 scale-110' : 'text-neutral-500'
              }`}
            >
              <div className="relative">
                {isActive && (
                   <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full" />
                )}
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mb-1.5 relative ${isActive ? 'animate-pulse' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                </svg>
              </div>
              <span className={`text-[8px] font-black uppercase tracking-widest relative ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                {item.label}
              </span>
            </Link>
         );
      })}
    </nav>
  );
}

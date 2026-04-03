'use client';

// Reusable metric component for the user dashboard displaying numeric representations clearly
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  desc?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white/[0.01] border border-white/5 rounded-[2rem] p-8 h-full animate-pulse space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-3 w-20 bg-neutral-800 rounded" />
        <div className="h-10 w-10 bg-neutral-800 rounded-xl" />
      </div>
      <div className="space-y-2">
        <div className="h-10 w-24 bg-neutral-800 rounded" />
        <div className="h-3 w-32 bg-neutral-800 rounded" />
      </div>
    </div>
  );
}

export default function StatCard({ title, value, desc, icon, trend }: StatCardProps) {
  return (
    <div className="group relative bg-white/[0.01] border border-white/5 rounded-[2rem] p-8 hover:bg-white/[0.02] hover:border-white/10 transition-all duration-500 flex flex-col justify-between h-full overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/[0.02] rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-green-500/[0.05] transition-all duration-700" />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">{title}</h3>
        {icon && (
          <div className="text-green-500 bg-green-500/5 p-3 rounded-2xl border border-green-500/10 group-hover:border-green-500/30 group-hover:bg-green-500/10 transition-all duration-500">
            {icon}
          </div>
        )}
      </div>
      
      <div className="space-y-1 relative z-10">
        <div className="text-4xl font-black text-white tracking-tighter leading-none">{value}</div>
        {desc && <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{desc}</p>}
        
        {trend && (
           <div className={`mt-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${trend.positive ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-neutral-800 text-neutral-400 border border-neutral-700'}`}>
             {trend.positive ? (
               <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18" />
               </svg>
             ) : null}
             {trend.value}
           </div>
        )}
      </div>
    </div>
  );
}

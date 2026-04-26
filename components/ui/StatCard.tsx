'use client';

// Unified high-fidelity metric tile component
import React from 'react';

export interface StatCardProps {
  title: string;
  value: string | number;
  desc?: string;
  icon?: React.ReactNode;
  trend?: string;
  trendDirection?: 'up' | 'down';
}

export default function StatCard({ 
  title, 
  value, 
  desc,
  icon, 
  trend, 
  trendDirection = 'up' 
}: StatCardProps) {
  return (
    <div className="bg-white/[0.01] border border-white/5 rounded-[2.5rem] p-8 md:p-10 hover:border-green-500/20 transition-all duration-500 group relative overflow-hidden backdrop-blur-3xl shadow-2xl flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-8 relative z-10">
         <div className="w-14 h-14 bg-white/[0.02] border border-white/10 rounded-2xl flex items-center justify-center text-white/20 group-hover:text-green-500 group-hover:bg-green-500/10 group-hover:border-green-500/20 transition-all duration-500 shadow-xl group-hover:scale-110 group-hover:rotate-3 shrink-0">
            {icon}
         </div>
         {trend && (
           <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border shadow-lg ${trendDirection === 'up' ? 'bg-green-500/10 text-green-500 border-green-500/20 shadow-green-500/5' : 'bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-rose-500/5'}`}>
              {trendDirection === 'up' ? '↑' : '↓'} {trend}
           </span>
         )}
      </div>
      <div className="relative z-10">
         <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 block mb-2">{title}</span>
         <span className="text-4xl font-black text-white tracking-tighter leading-none group-hover:text-green-400 transition-colors duration-500">{value}</span>
         {desc && <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-2">{desc}</p>}
      </div>
      
      {/* Dynamic Background Glow on Hover */}
      <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-green-500/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      <div className="absolute -left-12 -top-12 w-24 h-24 bg-white/[0.02] rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
    </div>
  );
}

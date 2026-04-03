'use client';
// Client-side dashboard component for platform metrics

import { motion } from 'framer-motion';
import Link from 'next/link';

interface Stat {
  label: string;
  value: string;
  change: string;
  icon: string;
}

const quickActions = [
  { title: 'Create New Draw', href: '/admin/draws', description: 'Schedule or run the monthly lottery draw manually.', color: 'bg-green-500' },
  { title: 'Approve Charities', href: '/admin/charities', description: 'Review and approve new charity partner applications.', color: 'bg-emerald-500' },
  { title: 'Verify Winners', href: '/admin/winners', description: 'Check score evidence and authorize prize payments.', color: 'bg-blue-500' },
];

export default function AdminDashboardClient({ stats }: { stats: Stat[] }) {
  return (
    <div className="space-y-16">
      {/* Welcome Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.215, 0.61, 0.355, 1] }}
        className="space-y-3"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-green-500/60 ml-1">Central Console</span>
        <div className="flex items-baseline gap-4">
          <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-black text-white tracking-tighter leading-none">Intelligence</h1>
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.8)]" />
        </div>
        <p className="text-white/30 font-bold max-w-xl text-lg leading-relaxed">Synthesizing live platform metrics and strategic operations management.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
            className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-6 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)] backdrop-blur-xl relative overflow-hidden group hover:bg-white/[0.04] transition-colors"
          >
            {/* Ambient Glow */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full blur-3xl group-hover:bg-green-500/10 transition-all" />
            
            <div className="flex items-center justify-between relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-neutral-950 shadow-[0_10px_20px_-5px_rgba(34,197,94,0.4)] group-hover:scale-110 group-hover:rotate-3 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d={stat.icon} />
                </svg>
              </div>
              <div className="px-3 py-1 rounded-full bg-white/[0.05] border border-white/5">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                  {stat.change}
                </span>
              </div>
            </div>
            
            <div className="space-y-1 relative z-10">
              <h3 className="text-4xl font-black text-white leading-none tracking-tighter mb-1">{stat.value}</h3>
              <p className="text-[10px] font-black text-green-500/60 uppercase tracking-[0.3em] ml-1">{stat.label}</p>
            </div>

            {/* Micro progress line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/[0.02] overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 whileInView={{ width: '100%' }}
                 transition={{ delay: 0.5 + i * 0.1, duration: 1.5 }}
                 className="h-full bg-gradient-to-r from-green-500/0 via-green-500/40 to-green-500/0"
               />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions Sections */}
      <div className="space-y-8 pt-8">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-black text-white tracking-widest uppercase text-xs">Strategic Operations</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {quickActions.map((action, i) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + i * 0.1, duration: 0.8 }}
              className="group"
            >
              <Link href={action.href} className="block p-10 rounded-[2.5rem] bg-white/[0.01] hover:bg-white/[0.04] border border-white/5 hover:border-green-500/20 transition-all duration-500 space-y-6 relative overflow-hidden shadow-2xl">
                {/* Background Glow */}
                <div className={`absolute -right-10 -top-10 w-40 h-40 ${action.color.replace('bg-', 'bg-')}/5 rounded-full blur-[80px] group-hover:blur-[60px] transition-all`} />
                
                <div className="flex items-center justify-between relative z-10">
                  <div className={`w-14 h-14 rounded-[1.25rem] ${action.color} flex items-center justify-center text-neutral-950 shadow-2xl group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500`}>
                     <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                     </svg>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-white/10 group-hover:bg-white/40 transition-colors" />
                </div>
                <div className="space-y-3 relative z-10">
                   <h3 className="text-2xl font-black text-white tracking-tight leading-none group-hover:text-green-400 transition-colors">{action.title}</h3>
                   <p className="text-white/30 text-sm font-bold leading-relaxed pr-8">{action.description}</p>
                </div>

                <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 transition-transform duration-500">
                   <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Execute Node</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

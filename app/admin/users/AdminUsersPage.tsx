'use client';

// Administrative command center for managing user base and subscription flows
import { useState } from 'react';
import UserTable from '@/components/admin/UserTable';
import { motion } from 'framer-motion';

interface User {
  id: string;
  full_name?: string;
  email?: string;
  subscription_status?: string;
  created_at?: string;
  [key: string]: unknown;
}

export default function AdminUsersPage({ users, totalCount, totalPages: _totalPages, currentPage: _currentPage }: { users: User[], totalCount: number, totalPages: number, currentPage: number }) {
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <div className="space-y-16">
      
      {/* Header and Operational Dashboard Control */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col md:flex-row items-start md:items-end justify-between gap-10 border-b border-white/5 pb-16"
      >
        <div className="space-y-4">
           <span className="text-[10px] font-black uppercase tracking-[0.4em] text-green-500/60 ml-1">User Base Control</span>
           <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-black text-white tracking-tighter leading-none">Global Registry</h1>
           <p className="text-white/30 font-bold max-w-2xl text-lg leading-relaxed">
              Monitoring verified user alignments, subscription health, and participation deltas across the global network architecture.
           </p>
        </div>
        
        <div className="flex bg-white/[0.03] border border-white/5 p-2 rounded-3xl backdrop-blur-3xl shadow-xl">
           {['all', 'active', 'inactive', 'lapsed'].map((filter) => (
             <button
               key={filter}
               onClick={() => setActiveFilter(filter)}
               className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === filter ? 'bg-green-500 text-neutral-950 shadow-lg shadow-green-500/20' : 'text-white/30 hover:text-white/60 hover:bg-white/[0.05]'}`}
             >
               {filter}
             </button>
           ))}
        </div>
      </motion.div>

      {/* Statistics and Filtering Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-4">
         {[
           { label: 'Total Registry', value: totalCount, icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
           { label: 'Verified Nodes', value: users.filter(u => u.subscription_status === 'active').length, icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
           { label: 'Pending Alignment', value: users.filter(u => u.subscription_status === 'inactive').length, icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
         ].map((stat, i) => (
           <motion.div
             key={stat.label}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.4 + i * 0.1 }}
             className="bg-white/[0.01] border border-white/5 p-8 rounded-[2rem] flex items-center gap-6 group hover:bg-white/[0.03] transition-all backdrop-blur-xl"
           >
             <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-neutral-950 transition-all shadow-[0_10px_20px_-5px_rgba(34,197,94,0.1)]">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={stat.icon} /></svg>
             </div>
             <div>
                <div className="text-3xl font-black text-white tracking-tighter leading-none">{stat.value}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/20 mt-1">{stat.label}</div>
             </div>
           </motion.div>
         ))}
      </div>

      {/* Main Registry Ledger */}
      <UserTable users={users} />
    
    </div>
  );
}

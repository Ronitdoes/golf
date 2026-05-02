'use client';

// Administrative user data table with optimized spacing for high-density information displays
import Link from 'next/link';
import { motion } from 'framer-motion';

interface UserRow {
  id: string;
  full_name?: string;
  email?: string;
  subscription_status?: string;
  subscription_plan?: string;
  is_admin?: boolean;
  charities?: { name?: string } | null;
  scores?: unknown[];
}

export default function UserTable({ users, currentUserId }: { users: UserRow[], currentUserId?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/[0.01] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-3xl relative"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/[0.01] rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 overflow-x-clip">
        <table className="w-full text-left whitespace-nowrap text-sm">
          <thead>
            <tr className="bg-white/[0.02] text-white/40 text-[9px] font-black uppercase tracking-[0.3em] border-b border-white/5">
              <th className="px-8 py-6">User Identity</th>
              <th className="px-6 py-6">Tier Alignment</th>
              <th className="px-6 py-6">Entity Allocation</th>
              <th className="px-6 py-6 text-center">Score Delta</th>
              <th className="px-6 py-6 text-center">Protocol Status</th>
              <th className="px-8 py-6 text-right">System Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((user, idx) => (
              <motion.tr 
                key={user.id} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + idx * 0.03 }}
                className="hover:bg-white/[0.03] transition-all group"
              >
                <td className="px-8 py-6">
                   <div className="flex flex-col">
                      <span className={`font-black text-base tracking-tight leading-none mb-1 transition-colors ${user.is_admin ? 'text-green-500' : 'text-white group-hover:text-green-400'}`}>
                        {user.is_admin ? 'System Administrator' : (user.full_name || 'Anonymous Node')}
                      </span>
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/20">{user.email}</span>
                   </div>
                </td>
                <td className="px-6 py-6 font-black text-[9px] uppercase tracking-[0.2em]">
                   <span className={`inline-flex items-center px-3 py-1 rounded-lg border ${user.subscription_plan === 'yearly' ? 'bg-green-500/10 text-green-500 border-green-500/30' : 'bg-white/[0.03] text-white/40 border-white/5'}`}>
                      {user.is_admin ? 'N/A' : (user.subscription_plan || 'N/A')}
                   </span>
                </td>
                <td className="px-6 py-6">
                   <span className="text-white/40 font-black text-[9px] uppercase tracking-widest truncate max-w-[150px] block">{user.charities?.name || 'Unassigned'}</span>
                </td>
                <td className="px-6 py-6 text-center">
                   <div className="flex items-center justify-center gap-1.5">
                      <span className="text-base font-black text-white tracking-tighter">{user.scores?.length || 0}</span>
                      <span className="text-[9px] font-black text-white/10">/ 5</span>
                   </div>
                </td>
                <td className="px-6 py-6 text-center">
                   {user.is_admin ? (
                      user.id === currentUserId ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border bg-green-500/20 text-green-500 border-green-500/40 shadow-[0_0_15px_-5px_#22C55E]">
                          <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse shadow-[0_0_6px_#22C55E]" />
                          Active Node
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border bg-white/[0.03] text-white/30 border-white/10">
                          System Node
                        </span>
                      )
                   ) : (
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border ${user.subscription_status === 'active' ? 'bg-green-500/10 text-green-500 border-green-500/30' : user.subscription_status === 'inactive' ? 'bg-white/[0.03] text-white/20 border-white/10' : user.subscription_status === 'lapsed' ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' : 'bg-rose-500/10 text-rose-500 border-rose-500/30'}`}>
                        {user.subscription_status === 'active' && <div className="w-1 h-1 bg-green-500 rounded-full shadow-[0_0_6px_#22C55E]" />}
                        {user.subscription_status || 'Unregistered'}
                      </span>
                   )}
                </td>
                <td className="px-8 py-6 text-right">
                   <Link 
                      href={`/admin/users/${user.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.02] hover:bg-white/[0.05] text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white rounded-xl transition-all border border-white/5 hover:border-white/10 active:scale-95 shadow-xl opacity-100 translate-x-0 lg:opacity-0 lg:group-hover:opacity-100 lg:-translate-x-3 lg:group-hover:translate-x-0"
                   >
                      Inspect Node
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                   </Link>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

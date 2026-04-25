'use client';

// Historical records for all past draws with optimized cell spacing for smaller viewport fit
import Link from 'next/link';
import { motion } from 'framer-motion';

export interface DrawRecord {
  id: string;
  month: string;
  status: 'draft' | 'simulation' | 'published';
  logic_type: 'random' | 'algorithmic';
  drawn_numbers: number[] | null;
  total_prize_pool: number | null;
  created_at: string;
}

export default function DrawHistory({ draws }: { draws: DrawRecord[] }) {
  if (draws.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/[0.01] border border-white/5 border-dashed rounded-[2.5rem] p-16 text-center backdrop-blur-3xl"
      >
        <div className="w-16 h-16 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
        </div>
        <h3 className="text-2xl font-black text-white tracking-tighter mb-2">Registry Inactive</h3>
        <p className="text-white/20 font-bold max-w-sm mx-auto text-base">Initialize your first monthly draw cycle to populate the system history ledger.</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/[0.01] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-3xl relative"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/[0.01] rounded-full blur-[100px] pointer-events-none" />
      
      <div className="overflow-x-auto relative z-10 custom-scrollbar">
        <table className="w-full text-left whitespace-nowrap text-sm">
          <thead>
            <tr className="bg-white/[0.02] text-white/40 text-[9px] font-black uppercase tracking-[0.3em] border-b border-white/5">
              <th className="px-8 py-6">Cycle Period</th>
              <th className="px-6 py-6">Logic Protocol</th>
              <th className="px-6 py-6 text-center">Verified Alignment</th>
              <th className="px-6 py-6 text-center">Prize Matrix</th>
              <th className="px-6 py-6 text-center">Cycle Status</th>
              <th className="px-8 py-6 text-right">Node Access</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {draws.map((draw, idx) => {
              const date = new Date(draw.month + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
              
              return (
                <motion.tr 
                  key={draw.id} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.03 }}
                  className="hover:bg-white/[0.03] transition-all group"
                >
                  <td className="px-8 py-6">
                     <div className="flex flex-col">
                        <span className="font-black text-white text-base tracking-tight leading-none mb-1 group-hover:text-green-400 transition-colors uppercase">{date}</span>
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">{draw.id.slice(0, 8)}</span>
                     </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="inline-flex items-center px-3 py-1 bg-white/[0.02] border border-white/5 rounded-lg text-[8px] font-black tracking-[0.2em] text-white/40 uppercase whitespace-nowrap">
                       {draw.logic_type}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    {draw.drawn_numbers ? (
                      <div className="flex items-center justify-center gap-1.5">
                        {draw.drawn_numbers.map((n, i) => (
                          <div key={i} className="w-6 h-6 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full flex items-center justify-center text-[9px] font-black group-hover:scale-110 transition-transform duration-300">
                            {n}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="w-1.5 h-1.5 bg-white/5 rounded-full mx-auto" />
                    )}
                  </td>
                  <td className="px-6 py-6 text-center">
                    <div className="flex flex-col">
                       <span className="text-base font-black text-white tracking-tighter">{draw.total_prize_pool ? `£${Number(draw.total_prize_pool).toLocaleString()}` : '--'}</span>
                       <span className="text-[8px] font-black text-white/10 uppercase tracking-widest">Aggregate</span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center text-[8px]">
                    {draw.status === 'published' ? (
                       <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/30 rounded-full font-black uppercase tracking-[0.2em] leading-none shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                          <div className="w-1 h-1 bg-green-500 rounded-full shadow-[0_0_6px_#22C55E]" />
                          Published
                       </span>
                    ) : (
                       <span className={`inline-flex items-center gap-1.5 px-3 py-1 bg-white/[0.03] text-white/40 border border-white/5 rounded-full font-black uppercase tracking-[0.2em] leading-none ${draw.status === 'simulation' ? 'animate-pulse text-green-500/60' : ''}`}>
                          {draw.status}
                       </span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Link 
                      href={`/admin/draws/${draw.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.02] hover:bg-white/[0.05] text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white rounded-xl transition-all border border-white/5 hover:border-white/10 active:scale-95 shadow-xl opacity-100 translate-x-0 lg:opacity-0 lg:group-hover:opacity-100 lg:translate-x-3 lg:group-hover:translate-x-0"
                    >
                      <span className="hidden sm:inline">Access Cycle</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </Link>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

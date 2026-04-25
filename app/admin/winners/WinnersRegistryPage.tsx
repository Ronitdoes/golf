'use client';

// Administrative winner registry with filtering and proof verification status indicators using Green brand theme
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface WinnerProfile { full_name?: string; email?: string }
interface WinnerDraw { month?: string }
interface Winner {
  id: string;
  match_count: number;
  prize_amount: number | string;
  payment_status: string;
  proof_url?: string | null;
  profiles?: WinnerProfile | null;
  draws?: WinnerDraw | null;
}

export default function WinnersRegistryPage({ winners }: { winners: Winner[] }) {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'paid'>('all');

  const filteredWinners = winners.filter(w => {
    if (activeTab === 'all') return true;
    return w.payment_status === activeTab;
  });

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* Header and Quick Stats */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 border-b border-white/5 pb-12">
        <div className="space-y-3">
           <span className="text-[10px] font-black uppercase tracking-[0.4em] text-green-500/60 ml-1">Verified Outcomes</span>
           <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-black text-white tracking-tighter leading-none">Winner Registry</h1>
           <p className="text-white/30 font-bold text-lg max-w-2xl leading-relaxed">
              Verify proof of results, approve verified allocations, and monitor historical prize disbursements across the network.
           </p>
        </div>
        
        <div className="flex bg-white/[0.03] border border-white/5 p-1.5 rounded-[1.5rem] shadow-2xl backdrop-blur-3xl">
           {['all', 'pending', 'paid'].map((tab) => (
              <button 
                 key={tab}
                 onClick={() => setActiveTab(tab as 'all' | 'pending' | 'paid')}
                 className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-green-500 text-neutral-950 shadow-lg shadow-green-500/20' : 'text-white/30 hover:text-white hover:bg-white/[0.05]'}`}
              >
                 {tab}
              </button>
           ))}
        </div>
      </div>

      {/* Main Winners Ledger Table */}
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
                <th className="px-10 py-8">Subscriber Identity</th>
                <th className="px-8 py-8">Draw Period</th>
                <th className="px-8 py-8 text-center">Protocol Match</th>
                <th className="px-8 py-8 text-right">Prize Matrix</th>
                <th className="px-8 py-8 text-center">Evidence Level</th>
                <th className="px-8 py-8 text-center">Cycle Status</th>
                <th className="px-10 py-8 text-right">Node Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredWinners.length === 0 ? (
                <tr>
                   <td colSpan={7} className="px-10 py-24 text-center text-white/20 font-black uppercase tracking-widest text-xs italic">
                      No verified outcomes currently matching filtered bounds.
                   </td>
                </tr>
              ) : filteredWinners.map((winner, idx) => (
                <motion.tr 
                  key={winner.id} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.03 }}
                  className="hover:bg-white/[0.03] transition-all group"
                >
                  <td className="px-10 py-8">
                    <div className="flex flex-col">
                       <span className="font-black text-white text-lg leading-none mb-1 group-hover:text-green-400 transition-colors uppercase tracking-tight">{winner.profiles?.full_name || 'Verified User'}</span>
                       <span className="text-white/20 font-black text-[9px] uppercase tracking-widest">{winner.profiles?.email || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-8 font-black text-white/40 text-[10px] uppercase tracking-widest">
                     {new Date(winner.draws?.month + 'T00:00:00Z' || Date.now()).toLocaleDateString(undefined, { month: 'long', year: 'numeric', timeZone: 'UTC' })}
                  </td>
                  <td className="px-8 py-8 text-center">
                    <span className="inline-flex items-center px-4 py-1.5 bg-white/[0.03] border border-white/10 rounded-xl text-[9px] font-black text-green-500 uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                       MATCH {winner.match_count}
                    </span>
                  </td>
                  <td className="px-8 py-8 text-right font-black text-white text-lg tracking-tighter">
                     £{Number(winner.prize_amount).toLocaleString()}
                  </td>
                  <td className="px-8 py-8 text-center">
                    {winner.proof_url ? (
                       <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-500/10 text-green-500 border border-green-500/30 rounded-full text-[9px] font-black uppercase tracking-widest leading-none shadow-[0_0_15px_rgba(34,197,94,0.15)]">
                          <div className="w-1 h-1 bg-green-500 rounded-full" />
                          Verified
                       </span>
                    ) : (
                       <span className="text-[9px] font-black uppercase tracking-widest text-white/10">Pending Proof</span>
                    )}
                  </td>
                  <td className="px-8 py-8 text-center">
                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${winner.payment_status === 'paid' ? 'bg-green-500/10 text-green-500 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'bg-white/[0.03] text-white/20 border-white/10'}`}>
                       {winner.payment_status === 'paid' && <div className="w-1 h-1 bg-green-500 rounded-full" />}
                       {winner.payment_status}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <Link 
                       href={`/admin/winners/${winner.id}`}
                       className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/[0.02] hover:bg-white/[0.05] text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white rounded-2xl transition-all border border-white/5 hover:border-white/10 active:scale-95 opacity-100 translate-x-0 lg:opacity-0 lg:group-hover:opacity-100 lg:translate-x-4 lg:group-hover:translate-x-0 group-hover:duration-500"
                    >
                       Inspect
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

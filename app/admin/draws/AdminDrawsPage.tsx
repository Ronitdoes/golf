'use client';

// Administrative command center for managing verified monthly lottery draw cycles using Green theme
import { useState } from 'react';
import DrawHistory, { DrawRecord } from '@/components/admin/DrawHistory';
import { createDraw } from '@/app/actions/draws';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AdminDrawsPage({ 
  draws, 
  currentMonthDraw 
}: { 
  draws: DrawRecord[], 
  currentMonthDraw: DrawRecord | null 
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCreateDraw = async () => {
    setIsCreating(true);
    setError(null);
    try {
      const now = new Date();
      // Logic defaults to random - updated during simulation/publish phase
      const res = await createDraw(now, 'random');
      if (res?.error) throw new Error(res.error);
      
      if (res?.draw) {
        router.push(`/admin/draws/${res.draw.id}`);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'An unexpected error occurred.');
    } finally {
      setIsCreating(false);
    }
  };

  const currentMonthName = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* Header and Current Action */}
      <div className="flex flex-col xl:flex-row items-start xl:items-end justify-between gap-10">
        <div className="space-y-3">
           <span className="text-[10px] font-black uppercase tracking-[0.4em] text-green-500/60 ml-1">Cycle Management</span>
           <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-black text-white tracking-tighter leading-none">Verified Draw Engine</h1>
           <p className="text-white/30 font-bold max-w-2xl text-lg leading-relaxed">
              Systematically generate, simulate, and publish monthly lottery alignments. 
              Only one verified publish event is permitted per month.
           </p>
        </div>
        
        {!currentMonthDraw ? (
           <button 
             onClick={handleCreateDraw}
             disabled={isCreating}
             className="px-10 py-5 bg-gradient-to-br from-green-400 to-green-600 hover:from-green-300 hover:to-green-500 text-neutral-950 font-black text-lg tracking-tight rounded-[2rem] shadow-[0_20px_40px_-10px_rgba(34,197,94,0.4)] transition-all hover:scale-[1.03] active:scale-95 disabled:opacity-50 flex items-center gap-4 group shrink-0"
           >
              {isCreating ? (
                 <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:rotate-90 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M12 4v16m8-8H4" /></svg>
              )}
              <span>Initialize {currentMonthName}</span>
           </button>
        ) : (
           <Link 
              href={`/admin/draws/${currentMonthDraw.id}`}
              className="px-8 py-5 bg-white/[0.03] border border-green-500/30 text-green-500 font-black text-lg tracking-tight rounded-[2.5rem] flex items-center gap-4 group hover:bg-white/[0.08] transition-all shadow-2xl backdrop-blur-3xl shrink-0"
           >
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(34,197,94,1)]" />
              <span>Continue {currentMonthName} Draw</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
           </Link>
        )}
      </div>

      {error && (
        <motion.div 
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           className="p-6 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-black uppercase tracking-widest rounded-3xl text-center shadow-2xl backdrop-blur-3xl"
        >
            System Error: {error}
        </motion.div>
      )}

      {/* Historical Ledger */}
      <div className="space-y-8 pt-8">
         <div className="flex items-center gap-6">
            <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] shrink-0">Systematic History</h3>
            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
            <span className="text-[10px] bg-white/[0.03] border border-white/5 px-6 py-2 rounded-full text-white/20 font-black uppercase tracking-widest shrink-0">{draws.length} Cycles Recorded</span>
         </div>
         <DrawHistory draws={draws} />
      </div>
    
    </div>
  );
}

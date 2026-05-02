'use client';

// Page for specific draw management session (Simulation/Publishing) with amber admin theme

import DrawControl from '@/components/admin/DrawControl';
import DrawPreview from '@/components/admin/DrawPreview';
import Link from 'next/link';

interface Draw {
  id: string;
  month: string;
  status: 'draft' | 'simulation' | 'published';
  drawn_numbers: number[] | null;
  total_prize_pool: number | null;
  jackpot_rollover_amount: number | null;
  logic_type: 'random' | 'algorithmic';
}

export default function AdminDrawDetailPage({ 
  draw, 
  eligibleCount,
  rollover,
  winnerCounts
}: { 
  draw: Draw, 
  eligibleCount: number,
  rollover: number,
  winnerCounts: { match5: number; match4: number; match3: number }
}) {
  const isPublished = draw.status === 'published';
  const isSimulation = draw.status === 'simulation';
  const drawDate = new Date(draw.month + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* Header and Context Stats */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-10 border-b border-neutral-800 pb-12">
        <div className="space-y-4">
           <Link href="/admin/draws" className="text-neutral-500 hover:text-amber-500 text-sm font-bold flex items-center gap-2 mb-4 group transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
              <span>Return to Registry</span>
           </Link>
           <h1 className="text-5xl font-black text-white tracking-tighter">{drawDate} Draw Lifecycle</h1>
           <div className="flex items-center gap-3">
              <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${isPublished ? 'bg-green-500/10 text-green-500 border border-green-500/20' : isSimulation ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                 {draw.status}
              </div>
              <span className="text-neutral-700 font-bold">•</span>
              <span className="text-neutral-500 font-bold uppercase tracking-widest text-[10px] bg-neutral-900 px-3 py-1 rounded-lg border border-neutral-800">{draw.id}</span>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
           <div className="bg-neutral-900 border border-neutral-800 px-8 py-6 rounded-3xl text-center shadow-xl">
              <span className="text-xs text-neutral-500 font-black uppercase tracking-widest block mb-1">Eligible Users</span>
              <span className="text-3xl font-black text-white">{eligibleCount}</span>
           </div>
           <div className="bg-neutral-900 border border-neutral-800 px-8 py-6 rounded-3xl text-center shadow-xl">
              <span className="text-xs text-neutral-500 font-black uppercase tracking-widest block mb-1">Vault Rollover</span>
              <span className="text-3xl font-black text-white">€{(isPublished ? Number(draw.jackpot_rollover_amount || 0) : rollover).toFixed(2)}</span>
           </div>
        </div>
      </div>

      {draw.status === 'draft' ? (
        <div className="space-y-12">
           {eligibleCount < 10 && (
              <div className="p-5 bg-amber-500/10 border border-amber-500/30 text-amber-500 text-sm font-bold rounded-2xl flex items-center justify-center gap-4 animate-pulse">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                 System Warning: Algorithmic weight logic strictly requires 10 eligible user score sets to operate natively.
              </div>
           )}
           <DrawControl drawId={draw.id} />
        </div>

      ) : draw.status === 'simulation' ? (
        // Simulation run — restore saved results from DB, show preview immediately
        <DrawControl
          drawId={draw.id}
          savedSimulation={draw.drawn_numbers ? {
            drawnNumbers: draw.drawn_numbers,
            winners: winnerCounts,
            pool: {
              totalPrizePool: Number(draw.total_prize_pool || 0)
            },
            jackpotRollover: rollover
          } : undefined}
          savedLogicType={draw.logic_type}
        />
      ) : (
        <div className="space-y-16">
            <div className="p-10 bg-green-500/5 border border-green-500/10 rounded-3xl text-center shadow-sm max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-green-500/10 border-2 border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-3xl font-black text-white tracking-tight mb-4">Alignment Finalized</h3>
                <p className="text-neutral-500 font-medium leading-relaxed">
                   Verified winning numbers have been archived and broadcasted to all eligible participants. 
                   The prize ledger for this cycle is officially locked.
                </p>
            </div>

            <div className="space-y-8">
               <div className="flex items-center gap-4">
                  <h3 className="text-2xl font-black text-white tracking-tight">Verified Results Output</h3>
                  <div className="h-px flex-1 bg-neutral-800" />
               </div>
                <DrawPreview 
                 drawnNumbers={draw.drawn_numbers} 
                 winners={winnerCounts}
                 pool={{ totalPrizePool: Number(draw.total_prize_pool || 0) }}
                 rollover={rollover}
               />
            </div>
        </div>
      )}
    </div>
  );
}

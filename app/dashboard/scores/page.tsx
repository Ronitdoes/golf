'use client';

// Scores management dashboard sub-route seamlessly utilizing previously instantiated modular components
import { useScores } from '@/hooks/useScores';
import ScoreEntry from '@/components/scores/ScoreEntry';
import ScoreList from '@/components/scores/ScoreList';

export default function ScoresDashboardPage() {
  const { scores, isLoading, addScore, deleteScore, editScore } = useScores();

  const missingScores = Math.max(0, 5 - scores.length);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out max-w-4xl">
      <div className="space-y-2">
        <span className="text-[10px] font-black text-green-500 uppercase tracking-[0.4em] ml-1">Performance Matrix</span>
        <h1 className="text-5xl font-black text-white tracking-tighter">Golf Intelligence</h1>
        <p className="text-white/30 font-bold text-lg max-w-xl">
          Track your Stableford execution sequentially. Your data streams are matched against global monthly draw parameters.
        </p>
      </div>

      {missingScores > 0 ? (
        <div className="bg-white/[0.02] border border-amber-500/20 p-8 rounded-[2rem] flex items-start gap-6 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/[0.05] blur-2xl rounded-full -mr-16 -mt-16" />
           <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
               <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
           </div>
           <div className="relative z-10">
             <h3 className="text-amber-500 font-black text-xs uppercase tracking-widest mb-1">Incomplete Synchronization</h3>
             <p className="text-white/60 font-medium">You need <span className="text-amber-400 font-black">{missingScores} more score{missingScores !== 1 ? 's' : ''}</span> to establish high-fidelity eligibility for upcoming jackpot windows.</p>
           </div>
        </div>
      ) : (
        <div className="bg-white/[0.01] border border-green-500/20 p-8 rounded-[2.5rem] flex items-center gap-6 relative overflow-hidden group shadow-[0_0_50px_rgba(34,197,94,0.03)]">
           <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/[0.05] blur-2xl rounded-full -mr-16 -mt-16" />
           <div className="w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
               <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
           </div>
           <div className="relative z-10">
             <h3 className="text-green-500 font-black text-xs uppercase tracking-widest mb-1">Node Verified</h3>
             <p className="text-white/60 font-medium">Your tactical performance stream is currently <span className="text-green-400 font-black">Active & Eligible</span> for global draw participation.</p>
           </div>
        </div>
      )}

      {/* Primary Interaction Interface encapsulated fluidly */}
      <div className="pt-4">
        <ScoreEntry onAddScore={addScore} scoreCount={scores.length} />
      </div>

      <div className="pt-8 border-t border-white/5">
        <div className="flex items-end justify-between mb-8">
           <div className="space-y-1">
             <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Temporal Log</span>
             <h2 className="text-3xl font-black text-white tracking-tighter">Performance History</h2>
           </div>
        </div>

        {isLoading ? (
           <div className="mt-6 flex flex-col gap-4">
              {[1,2,3].map(i => (
                 <div key={i} className="animate-pulse bg-white/[0.01] border border-white/5 rounded-[2rem] p-10 h-24 w-full" />
              ))}
           </div>
        ) : (
           <ScoreList scores={scores} onDelete={deleteScore} onEdit={editScore} />
        )}
      </div>
      
    </div>
  );
}

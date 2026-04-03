'use client';

// Input form for Stableford values utilizing strict client-side Zod parameter validation 
import { useState } from 'react';
import { z } from 'zod';

interface ScoreEntryProps {
  onAddScore: (score: number, playedAt: Date) => Promise<{ error?: string; success?: boolean }>;
  scoreCount: number;
}

export default function ScoreEntry({ onAddScore, scoreCount }: ScoreEntryProps) {
  const [score, setScore] = useState('');
  const [playedAt, setPlayedAt] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Maximum allowed date is today natively securely
  const today = new Date().toISOString().split('T')[0];
  
  // Zod Client-Side Schema 
  const schema = z.object({
    score: z.number().int().min(1, 'Score must dynamically natively be at least 1').max(45, 'Score safely cannot exceed 45'),
    playedAt: z.date()
      .max(new Date(), 'Played Date cannot be mathematically in the future')
      // Validating within 1 year purely logically
      .min(new Date(new Date().setFullYear(new Date().getFullYear() - 1)), 'Played Date natively logically cannot be more than exactly 1 year ago')
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const scoreNum = parseInt(score, 10);
    // Utilizing absolute UTC Date instantiation to offset arbitrary geographic misalignments
    const dateObj = new Date(playedAt + 'T00:00:00Z');

    const result = schema.safeParse({ score: scoreNum, playedAt: dateObj });

    if (!result.success) {
       // Isolate descriptive zod payload purely for surface projection
      setErrorMsg(result.error.issues[0]?.message ?? 'Please check your score details and try again.');
      return;
    }

    setIsSubmitting(true);
    const res = await onAddScore(scoreNum, dateObj);
    setIsSubmitting(false);

    if (res?.error) {
      setErrorMsg(res.error);
    } else {
      // Clear identically natively assuming pure success
      setScore('');
      setPlayedAt('');
    }
  };

  return (
    <div className="bg-white/[0.01] border border-white/5 rounded-[2rem] p-8 shadow-[0_0_50px_rgba(34,197,94,0.02)] relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/[0.03] blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-green-500/[0.06] transition-colors duration-1000" />
      
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-white tracking-tighter uppercase">Score Intake</h3>
        <div className="flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,1)]" />
           <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Live Node</span>
        </div>
      </div>
      
      {scoreCount >= 5 && (
         // Warning notification specifically addressing the isolated DB Trigger rolling window deletion
        <div className="mb-8 text-[10px] uppercase tracking-widest bg-amber-500/5 border border-amber-500/20 text-amber-500/80 p-5 rounded-2xl flex items-start gap-3 backdrop-blur-md">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
             <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
           </svg>
           <p className="leading-relaxed font-black">
             Rolling window active: New score sys-auto-removes oldest node.
           </p>
        </div>
      )}

      {errorMsg && (
         <div className="mb-8 text-[10px] uppercase tracking-widest text-red-400 bg-red-500/5 border border-red-500/20 p-5 rounded-2xl flex items-center gap-3 backdrop-blur-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="leading-relaxed font-black">{errorMsg}</span>
         </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-6 items-stretch w-full relative z-10">
        <div className="flex-1 w-full flex flex-col gap-2">
          <label htmlFor="score" className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Stableford Input</label>
          <div className="relative">
             <input 
               type="number" 
               id="score"
               name="score"
               value={score}
               onChange={e => setScore(e.target.value)}
               className="px-6 h-[62px] bg-white/[0.02] border border-white/5 rounded-2xl text-white font-black text-lg focus:ring-1 focus:ring-green-500/20 focus:border-green-500/40 outline-none w-full placeholder-white/10 transition-all shadow-inner [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
               placeholder="00"
               required
               min="1"
               max="45"
               disabled={isSubmitting}
             />
             <span className="absolute right-10 top-1/2 -translate-y-1/2 text-white/20 font-black text-xs uppercase tracking-widest pointer-events-none">pts</span>
          </div>
        </div>
        
        <div className="flex-1 w-full flex flex-col gap-2">
          <label htmlFor="playedAt" className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Operational Date</label>
          <input 
            type="date" 
            id="playedAt"
            name="playedAt"
            value={playedAt}
            onChange={e => setPlayedAt(e.target.value)}
            max={today}
            style={{ colorScheme: 'dark' }}
            className="px-6 h-[62px] bg-white/[0.02] border border-white/5 rounded-2xl text-white font-black text-sm uppercase tracking-widest focus:ring-1 focus:ring-green-500/20 focus:border-green-500/40 outline-none w-full transition-all shadow-inner"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-black text-transparent uppercase tracking-[0.2em] select-none">Action</span>
          <button 
            type="submit" 
            disabled={isSubmitting || !score || !playedAt}
            className="w-full lg:w-auto px-10 h-[62px] bg-white text-neutral-950 hover:bg-emerald-500 font-black transition-all disabled:opacity-20 disabled:grayscale rounded-2xl text-[11px] uppercase tracking-[0.2em] shadow-xl hover:shadow-emerald-500/20 active:scale-95 flex items-center justify-center shrink-0 min-w-[200px]"
          >
            {isSubmitting ? (
               <svg className="animate-spin h-4 w-4 text-neutral-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
            ) : 'Push Synchronization'}
          </button>
        </div>
      </form>
    </div>
  );
}

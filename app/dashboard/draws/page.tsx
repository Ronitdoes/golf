// Dashboard view tracking upcoming draws actively simulating timers and exposing historical participation records securely
import { createServerSupabaseClient } from '@/lib/supabase';

interface DrawRecord {
  draw_id: string;
  match_count: number;
  prize_amount: number | string;
  draws: { month: string; drawn_numbers?: number[] }[];
}

export default async function DrawsDashboardPage() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Next Draw simulation natively derived relative globally against current execution calendar
  const now = new Date();
  let nextDraw = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  if (now.getDate() === 1) nextDraw = new Date(now.getFullYear(), now.getMonth(), 1, 23, 59, 59); // If currently the 1st
  const diffTime = Math.abs(nextDraw.getTime() - now.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Retrieve strictly matched participation intersections isolating privacy safely
  const { data: participations } = await supabase
    .from('draw_results')
    .select(`
       draw_id, 
       match_count, 
       prize_amount,
       draws ( 
          month, 
          drawn_numbers 
       )
    `)
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out max-w-5xl">
      <div className="space-y-2">
        <span className="text-[10px] font-black text-green-500 uppercase tracking-[0.4em] ml-1">Temporal Intersections</span>
        <h1 className="text-5xl font-black text-white tracking-tighter">Draw Intelligence</h1>
        <p className="text-white/30 font-bold text-lg max-w-xl">Review your historical results securely and track upcoming jackpot cycles.</p>
      </div>

      {/* Countdown Panel cleanly isolating temporal awareness dynamically */}
      <div className="bg-white/[0.01] border border-green-500/20 rounded-[3rem] p-12 shadow-[0_0_50px_rgba(16,185,129,0.03)] flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative group">
         <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/[0.05] rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none group-hover:bg-green-500/[0.08] transition-all duration-1000" />
         
         <div className="relative z-10 w-full text-center md:text-left space-y-6">
           <div className="space-y-1">
             <span className="text-[10px] font-black tracking-[0.4em] text-green-500 uppercase">Operational Window</span>
             <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none">
                {nextDraw.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
             </h2>
           </div>
           <p className="text-white/30 font-bold text-lg max-w-md mx-auto md:mx-0">
             Ensure precisely <span className="text-white">5 high-fidelity scores</span> are properly synchronized onto your nodes before the cut-off correctly.
           </p>
         </div>

         <div className="relative z-10 shrink-0 flex flex-col items-center justify-center bg-neutral-950 border border-white/10 rounded-[2.5rem] w-40 h-40 md:w-48 md:h-48 shadow-2xl">
            <span className="text-6xl md:text-7xl font-black text-white tracking-tighter mb-1">{diffDays}</span>
            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Days Left</span>
         </div>
      </div>

      <div className="space-y-8 pt-8 border-t border-white/5">
        <div className="flex items-end justify-between">
           <div className="space-y-1">
             <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Historical Archive</span>
             <h3 className="text-3xl font-black text-white tracking-tighter">Participation Log</h3>
           </div>
        </div>
        
        {participations?.length === 0 ? (
           <div className="bg-white/[0.01] border border-white/5 border-dashed rounded-[3rem] p-24 text-center space-y-6">
              <div className="w-20 h-20 bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h4 className="text-2xl font-black text-white tracking-tighter uppercase">No Records Found</h4>
              <p className="text-white/20 font-bold max-w-xs mx-auto">Establish valid draw intersections by maintaining active scores streams globally.</p>
           </div>
        ) : (
           <div className="flex flex-col gap-6">
              {participations?.map((record: DrawRecord, idx: number) => {
                 const draw = record.draws[0];
                 const monthStr = draw ? new Date(draw.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' }) : 'Unknown';
                 
                 return (
                   <div key={`${record.draw_id}-${idx}`} className="group bg-white/[0.01] border border-white/5 rounded-[2.5rem] p-8 md:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 transition-all hover:bg-white/[0.02] hover:border-white/10 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/[0.01] blur-3xl rounded-full pointer-events-none" />
                      
                      <div className="flex-1 space-y-6 relative z-10 w-full">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em]">{monthStr} Execution</div>
                            <div className="flex items-center gap-4">
                               <span className="text-3xl font-black text-white tracking-tighter uppercase leading-none">Match Factor: {record.match_count}</span>
                               {record.match_count >= 3 && (
                                  <div className="bg-green-500/10 border border-green-500/20 text-green-500 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-[0_0_15px_rgba(34,197,94,0.1)]">Winner Verified</div>
                               )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/5">
                           <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Global Seed:</span>
                           <div className="flex flex-wrap gap-2">
                              {draw?.drawn_numbers?.map((num: number, i: number) => (
                                 <div key={i} className="w-8 h-8 rounded-xl bg-neutral-950 border border-white/5 flex items-center justify-center text-xs text-white font-black group-hover:border-green-500/20 transition-colors shadow-inner">
                                   {num}
                                 </div>
                              ))}
                           </div>
                        </div>
                      </div>

                      <div className="bg-neutral-950 px-10 py-8 rounded-[1.75rem] flex flex-col items-center justify-center min-w-[160px] shrink-0 border border-white/5 shadow-2xl relative animate-in zoom-in-95">
                         <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-2">Yield Output</span>
                         <span className={`text-4xl font-black tracking-tighter ${Number(record.prize_amount) > 0 ? 'text-green-500' : 'text-neutral-700'}`}>
                           ${Number(record.prize_amount || 0).toFixed(2)}
                         </span>
                      </div>
                      
                   </div>
                 )
              })}
           </div>
        )}
      </div>
    </div>
  );
}


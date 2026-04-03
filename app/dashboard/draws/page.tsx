// Dashboard view tracking upcoming draws actively simulating timers and exposing historical participation records securely
import { createServerSupabaseClient } from '@/lib/supabase';

interface DrawRecord {
  draw_id: string;
  match_count: number;
  prize_amount: number | string;
  draws: { draw_month: string; winning_numbers?: number[] }[];
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
          draw_month, 
          winning_numbers 
       )
    `)
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Draws & Participation</h1>
        <p className="text-neutral-400">Review your past results securely and prepare intelligently for upcoming cycles.</p>
      </div>

      {/* Countdown Panel cleanly isolating temporal awareness dynamically */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-green-900/10 border border-green-500/30 rounded-2xl p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
         <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
         
         <div className="relative z-10 w-full text-center md:text-left">
           <span className="text-sm font-bold tracking-widest text-green-400 uppercase mb-2 block">Next Automated Draw</span>
           <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tighter mb-4">
              {nextDraw.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
           </h2>
           <p className="text-neutral-400 max-w-md mx-auto md:mx-0">
             Ensure precisely 5 actively locked Stableford scores are properly formatted onto your dashboard before the cut-off correctly.
           </p>
         </div>

         <div className="relative z-10 shrink-0 flex flex-col items-center justify-center bg-neutral-950 border border-neutral-800 rounded-xl w-32 h-32 md:w-40 md:h-40">
            <span className="text-4xl md:text-5xl font-bold text-white mb-1">{diffDays}</span>
            <span className="text-sm font-medium text-neutral-500 uppercase tracking-widest">Days Left</span>
         </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-4">Historical Alignments</h3>
        
        {participations?.length === 0 ? (
           <div className="bg-neutral-900 border border-neutral-800 border-dashed rounded-xl p-10 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-neutral-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h4 className="text-white font-medium text-lg mb-1">No Historical Draws</h4>
              <p className="text-neutral-500">You haven&apos;t explicitly participated in any processed draws globally yet.</p>
           </div>
        ) : (
           <div className="flex flex-col gap-4">
              {participations?.map((record: DrawRecord, idx: number) => {
                 const draw = record.draws[0];
                 const monthStr = draw ? new Date(draw.draw_month).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' }) : 'Unknown';
                 
                 return (
                   <div key={`${record.draw_id}-${idx}`} className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors hover:border-neutral-700">
                      
                      <div className="flex-1">
                        <div className="text-sm text-neutral-500 font-medium mb-1">{monthStr}</div>
                        <div className="flex items-center gap-2 mb-3">
                           <span className="text-lg font-bold text-white">Match Count: {record.match_count}</span>
                           {record.match_count >= 3 && (
                              <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-0.5 rounded uppercase">Verified Winner</span>
                           )}
                        </div>
                        
                        {/* Numbers mapping representation securely visually interpreted linearly */}
                        <div className="flex flex-wrap gap-2">
                           <span className="text-xs text-neutral-500 mt-1 mr-1">Global Draw:</span>
                           {draw?.winning_numbers?.map((num: number, i: number) => (
                              <div key={i} className="w-6 h-6 rounded-md bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs text-white font-medium">
                                {num}
                              </div>
                           ))}
                        </div>
                      </div>

                      <div className="bg-neutral-950 px-5 py-4 rounded-lg flex flex-col items-center justify-center min-w-[120px] shrink-0 border border-neutral-800">
                         <span className="text-xs text-neutral-500 font-medium mb-1">Prize Output</span>
                         <span className={`text-xl font-bold ${Number(record.prize_amount) > 0 ? 'text-green-400' : 'text-neutral-300'}`}>
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


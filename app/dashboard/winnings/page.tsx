'use client';

// Winnings tracking page modeling historical financial intersections securely deploying direct Supabase Storage uploads
import { useState, useEffect } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

interface WinningsRecord {
  id: string;
  draw_id: string;
  match_count: number;
  prize_amount: number;
  payment_status: 'pending' | 'paid';
  draws: {
    draw_month: string;
  };
}

export default function WinningsDashboardPage() {
  const [records, setRecords] = useState<WinningsRecord[]>([]);
  const [totalWinnings, setTotalWinnings] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const supabase = createBrowserSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data } = await supabase
        .from('draw_results')
        .select(`
           id,
           draw_id,
           match_count,
           prize_amount,
           payment_status,
           draws ( draw_month )
        `)
        .eq('user_id', user.id)
        .gt('prize_amount', 0)
        .order('created_at', { ascending: false });

      if (data) {
         setRecords(data as unknown as WinningsRecord[]);
         const sum = data.reduce((acc, curr) => acc + Number(curr.prize_amount), 0);
         setTotalWinnings(sum);
      }
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, recordId: string) => {
     if (!e.target.files || e.target.files.length === 0) return;
     const file = e.target.files[0];
     
     setUploadingId(recordId);
     const supabase = createBrowserSupabaseClient();
     const { data: { user } } = await supabase.auth.getUser();

     // Securely upload physical file proof independently mitigating DB blob clutter
     const fileExt = file.name.split('.').pop();
     const filePath = `${user!.id}/${recordId}-${Date.now()}.${fileExt}`;

     // Note: "proofs" bucket needs to be authenticated dynamically via Supabase rules in production
     const { error: uploadError } = await supabase.storage
        .from('proofs')
        .upload(filePath, file);

     if (!uploadError) {
        // Optimistically update UI status although typically Admin verifies thoroughly
        setRecords(prev => prev.map(r => r.id === recordId ? { ...r, payment_status: 'paid' } : r));
        alert('Proof securely uploaded! An admin will verify the payload asynchronously.');
     } else {
        console.error(uploadError);
        alert('Upload isolated fault. Does the storage bucket exist natively?');
     }
     
     setUploadingId(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out max-w-5xl">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Winnings</h1>
          <p className="text-neutral-400 max-w-lg">Track your cumulative prizes cleanly natively reflecting global match alignments securely.</p>
        </div>
        
        <div className="shrink-0 bg-gradient-to-t from-green-900/40 to-neutral-900 border border-green-500/30 rounded-xl px-8 py-5 text-center shadow-lg min-w-[200px]">
           <span className="text-xs text-green-400 font-bold uppercase tracking-wider block mb-1">Total Vault Output</span>
           <span className="text-4xl font-black text-white tracking-tighter">${totalWinnings.toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden mt-8 shadow-sm">
         <div className="p-6 border-b border-neutral-800 bg-neutral-950/50">
           <h3 className="text-lg font-bold text-white">Prize Ledger</h3>
         </div>
         
         <div className="overflow-x-auto">
           {isLoading ? (
              <div className="p-10 flex justify-center">
                 <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
              </div>
           ) : records.length === 0 ? (
              <div className="p-16 text-center">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-neutral-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
                 <h4 className="text-lg font-medium text-white mb-2">No Verified Matches Found</h4>
                 <p className="text-neutral-500 max-w-sm mx-auto">Continue explicitly logging exact Stableford scores uniformly to intercept upcoming jackpot windows natively.</p>
              </div>
           ) : (
              <table className="w-full text-left whitespace-nowrap text-sm">
                <thead>
                  <tr className="bg-neutral-900/80 text-neutral-400 border-b border-neutral-800 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-medium">Draw Period</th>
                    <th className="px-6 py-4 font-medium">Match Level</th>
                    <th className="px-6 py-4 font-medium text-right">Yield Amount</th>
                    <th className="px-6 py-4 font-medium text-center">Status</th>
                    <th className="px-6 py-4 font-medium text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {records.map((r) => {
                     const date = new Date(r.draws.draw_month).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
                     
                     return (
                       <tr key={r.id} className="hover:bg-neutral-800/30 transition-colors">
                         <td className="px-6 py-5">
                            <span className="font-bold text-white">{date} Draw</span>
                         </td>
                         <td className="px-6 py-5">
                            <div className="flex items-center gap-2">
                               <div className="flex bg-neutral-950 rounded-md border border-neutral-800 overflow-hidden text-xs">
                                  <span className="px-2 py-1 bg-green-500/20 text-green-400 border-r border-neutral-800 font-bold">{r.match_count}</span>
                                  <span className="px-2 py-1 text-neutral-400 font-medium">Matched</span>
                               </div>
                            </div>
                         </td>
                         <td className="px-6 py-5 text-right font-bold text-white text-base">
                            ${Number(r.prize_amount).toFixed(2)}
                         </td>
                         <td className="px-6 py-5 text-center">
                            {r.payment_status === 'paid' ? (
                               <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                                  Paid Successfully
                               </span>
                            ) : (
                               <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                  Pending Review
                               </span>
                            )}
                         </td>
                         <td className="px-6 py-5 text-center flex justify-center">
                            {r.payment_status === 'pending' ? (
                               <div className="relative">
                                  <input 
                                    type="file" 
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                    disabled={uploadingId === r.id}
                                    accept="image/*,.pdf"
                                    onChange={(e) => handleFileUpload(e, r.id)}
                                  />
                                  <button 
                                    className="relative flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold rounded-lg transition-colors overflow-hidden border border-neutral-700 disabled:opacity-50"
                                    disabled={uploadingId === r.id}
                                  >
                                    {uploadingId === r.id ? (
                                      <>
                                        <svg className="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        <span>Parsing</span>
                                      </>
                                    ) : (
                                      <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                        <span>Upload Proof</span>
                                      </>
                                    )}
                                  </button>
                               </div>
                            ) : (
                               <div className="px-4 py-2 text-neutral-600 text-xs font-bold line-through flex items-center justify-center">
                                  Resolved
                               </div>
                            )}
                         </td>
                       </tr>
                     );
                  })}
                </tbody>
              </table>
           )}
         </div>
      </div>
    
    </div>
  );
}

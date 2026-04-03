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
  proof_url?: string | null;
  draws: {
    month: string;
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
           proof_url,
           draws ( month )
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
        // Retrieve valid Public URL to associate back into the result row
        const { data: { publicUrl } } = supabase.storage.from('proofs').getPublicUrl(filePath);

        // Update the draw_result row with the new proof_url
        const { error: dbError } = await supabase
           .from('draw_results')
           .update({ proof_url: publicUrl })
           .eq('id', recordId);

        if (!dbError) {
           // Optimistically update local state to show uploaded status
           setRecords(prev => prev.map(r => r.id === recordId ? { ...r, proof_url: publicUrl } : r));
           alert('Proof securely uploaded! An admin will verify the payload asynchronously.');
        } else {
           console.error('[DB_UPDATE_ERROR]', dbError);
           alert('Physical file uploaded but DB record synchronization failed.');
        }
     } else {
        console.error(uploadError);
        alert('Upload isolated fault. Does the storage bucket exist natively?');
     }
     
     setUploadingId(null);
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out max-w-6xl">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-10">
        <div className="space-y-2">
          <span className="text-[10px] font-black text-green-500 uppercase tracking-[0.4em] ml-1">Financial Reconciliation</span>
          <h1 className="text-5xl font-black text-white tracking-tighter">Vault Ledger</h1>
          <p className="text-white/30 font-bold text-lg max-w-lg">Track your cumulative prize output and match alignments securely.</p>
        </div>
        
        <div className="shrink-0 bg-white/[0.02] border border-green-500/20 rounded-[2.5rem] px-12 py-8 text-center shadow-[0_0_50px_rgba(16,185,129,0.05)] relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/[0.05] blur-3xl rounded-full -mr-16 -mt-16" />
           <span className="text-[10px] font-black text-green-500 uppercase tracking-[0.4em] block mb-2 relative z-10">Total Vault Output</span>
           <span className="text-6xl font-black text-white tracking-tighter relative z-10">${totalWinnings.toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-white/[0.01] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl relative">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500/20 to-transparent" />
         <div className="p-10 border-b border-white/5 flex items-center justify-between">
           <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">Aggregate Yield Records</h3>
           <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">{records.length} Transactions Found</span>
         </div>
         
         <div className="overflow-x-auto">
           {isLoading ? (
              <div className="p-20 flex justify-center">
                 <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(34,197,94,0.2)]" />
              </div>
           ) : records.length === 0 ? (
              <div className="p-24 text-center space-y-6">
                 <div className="w-20 h-20 bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-center mx-auto relative">
                   <div className="absolute inset-0 bg-white/5 blur-xl rounded-full" />
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white/10 relative" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                 </div>
                 <div className="space-y-1">
                   <h4 className="text-2xl font-black text-white tracking-tighter uppercase">No Verified Yield</h4>
                   <p className="text-white/20 font-bold max-w-xs mx-auto">Establish valid score streams to intercept upcoming jackpot windows natively.</p>
                 </div>
              </div>
           ) : (
              <table className="w-full text-left whitespace-nowrap">
                <thead>
                  <tr className="bg-white/[0.02] text-white/30 border-b border-white/5 text-[9px] font-black uppercase tracking-[0.3em]">
                    <th className="px-10 py-6 font-black">Draw Period</th>
                    <th className="px-10 py-6 font-black">Match Level</th>
                    <th className="px-10 py-6 font-black text-right">Yield Amount</th>
                    <th className="px-10 py-6 font-black text-center">Status</th>
                    <th className="px-10 py-6 font-black text-center">Protocol</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {records.map((r) => {
                     const date = new Date(r.draws.month).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
                     
                     return (
                       <tr key={r.id} className="hover:bg-white/[0.02] transition-colors group">
                         <td className="px-10 py-8">
                            <span className="font-black text-lg text-white tracking-tighter uppercase">{date} Draw</span>
                         </td>
                         <td className="px-10 py-8">
                            <div className="flex items-center gap-3">
                               <div className="flex bg-neutral-950 rounded-xl border border-white/10 overflow-hidden text-[10px] font-black uppercase">
                                  <span className="px-3 py-2 bg-green-500/20 text-green-500 border-r border-white/5">{r.match_count}</span>
                                  <span className="px-3 py-2 text-white/30 tracking-widest">Matched</span>
                               </div>
                            </div>
                         </td>
                         <td className="px-10 py-8 text-right font-black text-white text-2xl tracking-tighter">
                            ${Number(r.prize_amount).toFixed(2)}
                         </td>
                         <td className="px-10 py-8 text-center">
                            {r.payment_status === 'paid' ? (
                               <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-green-500/10 text-green-500 border border-green-500/20">
                                  Settled
                               </span>
                            ) : (
                               <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                                  In Review
                               </span>
                            )}
                         </td>
                         <td className="px-10 py-8 text-center">
                            {r.payment_status === 'pending' ? (
                               <div className="relative inline-block">
                                  <input 
                                    type="file" 
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                    disabled={uploadingId === r.id}
                                    accept="image/*,.pdf"
                                    onChange={(e) => handleFileUpload(e, r.id)}
                                  />
                                  <button 
                                    className="relative flex items-center justify-center gap-3 px-6 py-3 bg-white/[0.04] hover:bg-white text-neutral-400 hover:text-neutral-950 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all border border-white/10 disabled:opacity-50"
                                    disabled={uploadingId === r.id}
                                  >
                                    {uploadingId === r.id ? (
                                      <>
                                        <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        <span>Parsing</span>
                                      </>
                                    ) : (
                                      <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                        <span>Upload Payload</span>
                                      </>
                                    )}
                                  </button>
                               </div>
                            ) : (
                               <div className="text-white/10 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                  Archive Validated
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

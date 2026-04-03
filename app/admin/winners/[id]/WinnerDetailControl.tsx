'use client';

// Administrative winner verification and payout tracking interface using Green high-fidelity theme
import { useState } from 'react';
import { approveWinner, rejectWinner, markAsPaid } from '@/app/actions/admin/winners';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface WinnerResult {
  id: string;
  prize_amount: number | string;
  payment_status: string;
  proof_url?: string | null;
  verified_at?: string;
  profiles: { full_name?: string; email?: string };
  draws: { month: string; drawn_numbers: number[] };
}

export default function WinnerDetailControl({ result }: { result: WinnerResult }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showReject, setShowReject] = useState(false);

  const handleAction = async (action: 'approve' | 'pay' | 'reject') => {
    setIsProcessing(true);
    let res;
    if (action === 'approve') res = await approveWinner(result.id);
    if (action === 'pay') res = await markAsPaid(result.id);
    if (action === 'reject') res = await rejectWinner(result.id, rejectReason);
    
    if (res?.error) alert(res.error);
    else window.location.reload();
    setIsProcessing(false);
  };

  const drawDate = new Date(result.draws.month + 'T00:00:00Z').toLocaleDateString(undefined, { month: 'long', year: 'numeric', timeZone: 'UTC' });

  return (
    <div className="max-w-7xl mx-auto space-y-16 py-10 px-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
      
      {/* Header and Strategic Context */}
      <div className="flex flex-col xl:flex-row items-start xl:items-end justify-between gap-12 border-b border-white/5 pb-16">
        <div className="space-y-6">
           <Link href="/admin/winners" className="text-[10px] font-black uppercase tracking-[0.4em] text-green-500/60 hover:text-green-400 flex items-center gap-3 transition-all group">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:-translate-x-1.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M15 19l-7-7 7-7" /></svg>
              <span>Return to Registry</span>
           </Link>
           <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-black text-white tracking-tighter leading-none">Result Verification</h1>
           <div className="flex flex-wrap items-center gap-6">
              <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg ${result.payment_status === 'paid' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-green-500/[0.03] text-white/40 border border-white/10'}`}>
                 {result.payment_status}
              </span>
              <span className="hidden md:inline text-white/10 opacity-30">•</span>
              <p className="text-white/30 font-black text-xs uppercase tracking-widest">{drawDate} Cycle History</p>
           </div>
        </div>

        <motion.div 
           whileHover={{ scale: 1.02 }}
           className="bg-white/[0.01] border border-white/5 px-12 py-8 rounded-[2.5rem] text-center shadow-2xl relative overflow-hidden group backdrop-blur-3xl min-w-[320px]"
        >
           <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/[0.02] rounded-full -mr-12 -mt-12 blur-[60px] group-hover:bg-green-500/[0.05] transition-all" />
           <span className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em] block mb-3">Allocated Prize Manifest</span>
           <span className="text-5xl font-black text-white tracking-tighter group-hover:text-green-400 transition-colors">£{Number(result.prize_amount).toLocaleString()}</span>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
         
         {/* Proof & Identification Metrics */}
         <div className="space-y-12">
            <section className="space-y-8">
               <div className="flex items-center gap-4">
                  <div className="w-1.5 h-6 bg-green-500 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
                  <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Proof of Performance</h3>
               </div>
               
               {result.proof_url ? (
                  <div className="space-y-6">
                     <div className="bg-white/[0.01] border border-white/5 rounded-[3rem] overflow-hidden aspect-video relative group shadow-2xl backdrop-blur-3xl p-4">
                        <Image src={result.proof_url!} alt="Proof of Match alignment" fill className="object-contain rounded-[2rem]" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-10">
                             <a href={result.proof_url} target="_blank" className="bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] px-8 py-3 rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl">Inspect Full Manifest</a>
                        </div>
                     </div>
                  </div>
               ) : (
                  <div className="p-20 border-2 border-dashed border-white/5 rounded-[3rem] text-center bg-white/[0.01] group hover:border-green-500/20 transition-all">
                     <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                     </div>
                     <p className="text-white/40 font-bold text-xl mb-2 tracking-tight group-hover:text-white/60 transition-colors">Awaiting Verification Proof</p>
                     <p className="text-white/10 text-[9px] font-black uppercase tracking-[0.3em]">Client manifests pending secure tunnel transmission.</p>
                  </div>
               )}
            </section>

            <motion.section 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-white/[0.01] border border-white/5 rounded-[3rem] p-10 space-y-10 shadow-3xl backdrop-blur-3xl relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/[0.01] rounded-full blur-[60px]" />
               <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Identity Mapping</h3>
               <div className="space-y-8">
                  <div className="group">
                     <span className="text-[9px] text-white/20 font-black uppercase tracking-widest block mb-2 group-hover:text-green-500/40 transition-colors">Verified Legal Designation</span>
                     <p className="text-white text-3xl font-black tracking-tighter group-hover:text-green-400 transition-colors leading-none uppercase">{result.profiles.full_name}</p>
                  </div>
                  <div className="group">
                     <span className="text-[9px] text-white/20 font-black uppercase tracking-widest block mb-2 group-hover:text-green-500/40 transition-colors">Protocol Email Alignment</span>
                     <p className="text-white/60 font-bold text-base tracking-tight group-hover:text-white/80 transition-colors">{result.profiles.email}</p>
                  </div>
               </div>
            </motion.section>
         </div>

         {/* Strategic Action Controls */}
         <div className="space-y-12">
            <section className="space-y-8">
               <div className="flex items-center gap-4">
                  <div className="w-1.5 h-6 bg-green-500 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
                  <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Action Integrity</h3>
               </div>

               <div className="bg-white/[0.01] border border-white/5 rounded-[3rem] p-12 space-y-12 shadow-2xl backdrop-blur-3xl relative overflow-hidden">
                  <div className="absolute bottom-0 right-0 w-40 h-40 bg-green-500/[0.02] rounded-full blur-[80px]" />
                  {result.payment_status === 'paid' ? (
                     <div className="text-center py-10 space-y-4">
                        <div className="w-24 h-24 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-10 shadow-[0_0_50px_-10px_rgba(34,197,94,0.3)]">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h4 className="text-3xl font-black text-white tracking-tight">Disbursement Verified</h4>
                        <p className="text-white/30 font-bold max-w-xs mx-auto">Allocated funds were officially processed and cleared on {new Date(result.verified_at ?? Date.now()).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}.</p>
                     </div>
                  ) : (
                     <div className="space-y-10 relative z-10">
                        <div className="space-y-5">
                           <button 
                              onClick={() => handleAction('pay')}
                              disabled={isProcessing}
                              className="w-full py-6 bg-green-500 hover:bg-green-400 text-black font-black text-lg tracking-tight rounded-2xl shadow-[0_20px_40px_-5px_rgba(34,197,94,0.3)] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                           >
                              {isProcessing ? 'SYNCHRONIZING...' : 'MARK AS OFFICIALLY PAID'}
                           </button>
                           {result.payment_status !== 'pending' && (
                              <button 
                                 onClick={() => handleAction('approve')}
                                 disabled={isProcessing}
                                 className="w-full py-6 bg-white/5 hover:bg-white/10 text-white font-black text-lg tracking-tight rounded-2xl border border-white/10 transition-all active:scale-95 disabled:opacity-50"
                              >
                                 VERIFY PROOF & APPROVE
                              </button>
                           )}
                        </div>

                        {!showReject ? (
                           <button 
                              onClick={() => setShowReject(true)}
                              className="w-full text-center text-white/20 hover:text-rose-500 text-[10px] font-black uppercase tracking-[0.3em] transition-all"
                           >
                              Isolation Protocol (Reject Proof)
                           </button>
                        ) : (
                           <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-black/60 border border-rose-500/20 rounded-3xl p-8 space-y-6 shadow-2xl"
                           >
                              <div className="space-y-2">
                                 <label className="text-[9px] font-black uppercase tracking-[0.4em] text-rose-500 ml-1">Isolation Rationale</label>
                                 <textarea 
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-white text-sm focus:outline-none focus:border-rose-500 transition-all font-bold min-h-[120px]"
                                    placeholder="e.g. Manifest corruption, identification mismatch..."
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                 />
                              </div>
                              <div className="flex gap-4">
                                 <button 
                                    onClick={() => handleAction('reject')}
                                    className="flex-1 py-4 bg-rose-500 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-rose-600 transition-colors"
                                 >
                                    Execute Rejection
                                 </button>
                                 <button 
                                    onClick={() => setShowReject(false)}
                                    className="px-8 py-4 text-white/30 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors"
                                 >
                                    Decline
                                 </button>
                              </div>
                           </motion.div>
                        )}
                     </div>
                  )}
               </div>
            </section>

            <motion.section 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="bg-white/[0.01] border border-white/5 rounded-[3rem] p-10 space-y-8 shadow-sm backdrop-blur-3xl relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/[0.01] rounded-full blur-[60px]" />
               <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Protocol Alignment Numbers</h3>
               <div className="flex gap-4 flex-wrap">
                  {result.draws.drawn_numbers.map((n: number, i: number) => (
                    <div key={i} className="w-12 h-12 bg-green-500 text-black border-b-4 border-green-700/50 rounded-2xl flex items-center justify-center font-black text-lg shadow-lg hover:-translate-y-1 transition-transform">
                       {n}
                    </div>
                  ))}
               </div>
               <div className="h-px bg-white/5 mx-2 my-4" />
               <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest leading-relaxed">Performance alignment verified for the <span className="text-green-500">{drawDate}</span> cycle via cryptographic node consensus.</p>
            </motion.section>
         </div>

      </div>
    </div>
  );
}

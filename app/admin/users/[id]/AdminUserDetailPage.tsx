'use client';

// Administrative user detail interface with high-fidelity control protocols using Green brand theme
import { useState } from 'react';
import { updateUserSubscriptionStatus, deleteUserScore } from '@/app/actions/admin/users';
import Link from 'next/link';
import { motion } from 'framer-motion';

type SubscriptionStatus = 'active' | 'inactive' | 'lapsed' | 'cancelled';

interface UserProfile {
  id: string;
  full_name?: string;
  email?: string;
  created_at?: string;
  subscription_status?: SubscriptionStatus;
  charities?: { name?: string } | null;
}

interface Score {
  id: string;
  score: number;
  played_at: string;
}

interface DrawResult {
  id: string;
  match_count: number;
  prize_amount: number | string;
  draws: { month: string };
}

export default function AdminUserDetailPage({ 
  user, 
  scores, 
  drawResults 
}: { 
  user: UserProfile, 
  scores: Score[], 
  drawResults: DrawResult[] 
}) {
  const [status, setStatus] = useState(user.subscription_status);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: SubscriptionStatus) => {
    setIsUpdating(true);
    const res = await updateUserSubscriptionStatus(user.id, newStatus);
    if (!res?.error) setStatus(newStatus);
    setIsUpdating(false);
  };

  const handleDeleteScore = async (scoreId: string) => {
    if (!confirm('Permanently remove this score entry from the high-fidelity registry?')) return;
    await deleteUserScore(scoreId, user.id);
  };

  return (
    <div className="space-y-16 py-10 max-w-7xl mx-auto px-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out">
      
      {/* Header and Strategic Controls */}
      <div className="flex flex-col xl:flex-row items-start justify-between gap-12 border-b border-white/5 pb-16">
        <div className="space-y-6">
           <Link href="/admin/users" className="text-[10px] font-black uppercase tracking-[0.4em] text-green-500/60 hover:text-green-400 flex items-center gap-3 transition-all group">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:-translate-x-1.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M15 19l-7-7 7-7" /></svg>
              <span>Return to Global Registry</span>
           </Link>
           <div className="space-y-2">
              <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-black text-white tracking-tighter leading-none">{user.full_name}</h1>
              <p className="text-white/30 font-bold text-xl flex flex-wrap items-center gap-x-6 gap-y-2">
                 <span className="text-white/60 tracking-tight">{user.email}</span>
                 <span className="hidden md:inline opacity-20">•</span>
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-white/5 px-4 py-1.5 rounded-full border border-white/10">Joined {new Date(user.created_at ?? Date.now()).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </p>
           </div>
        </div>

        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="bg-white/[0.01] border border-white/5 rounded-[2.5rem] p-10 space-y-8 min-w-[360px] shadow-2xl backdrop-blur-3xl relative overflow-hidden"
        >
           <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/[0.02] rounded-full blur-[60px]" />
           <div className="space-y-3 relative z-10">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 ml-2">Protocol Alignment</label>
              <div className="relative group">
                <select 
                   value={status} 
                   disabled={isUpdating}
                   onChange={(e) => handleStatusChange(e.target.value as SubscriptionStatus)}
                   className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 px-8 text-white font-black text-sm focus:outline-none focus:border-green-500 transition-all appearance-none cursor-pointer group-hover:bg-black/60 shadow-inner"
                >
                   <option value="active" className="bg-neutral-900">ACTIVE STATUS</option>
                   <option value="inactive" className="bg-neutral-900">INACTIVE / PENDING</option>
                   <option value="lapsed" className="bg-neutral-900">LAPSED ALIGNMENT</option>
                   <option value="cancelled" className="bg-neutral-900">TERMINATED STATUS</option>
                </select>
                <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-white/20 group-hover:text-green-500 transition-colors">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
           </div>
           
           <div className="h-px bg-white/5 mx-2" />
           
           <div className="flex items-center justify-between px-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20">System Integrity</span>
              <span className={`inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest ${isUpdating ? 'text-green-500 animate-pulse' : 'text-green-500/40'}`}>
                 {isUpdating ? 'Synchronizing...' : 'Verified Node'}
              </span>
           </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-16">
         
         {/* Score Management Intelligence */}
         <div className="xl:col-span-2 space-y-10">
            <div className="flex items-center gap-6">
               <h2 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] shrink-0">Score Performance Index</h2>
               <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
               <span className="text-[10px] bg-white/[0.03] border border-white/5 px-6 py-2 rounded-full text-white/30 font-black uppercase tracking-widest shrink-0">{scores.length} / 5 Logged</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {scores.length === 0 ? (
                  <div className="col-span-full p-20 bg-white/[0.01] border border-white/5 border-dashed rounded-[3rem] text-center text-white/20 font-black uppercase tracking-widest text-xs">
                     No verified scores located in the node registry.
                  </div>
               ) : (
                  scores.map((s, idx) => (
                    <motion.div 
                       key={s.id} 
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: 0.2 + idx * 0.05 }}
                       className="bg-white/[0.01] border border-white/5 rounded-[2.5rem] p-8 flex items-center justify-between group hover:bg-white/[0.03] hover:border-white/10 transition-all shadow-xl backdrop-blur-3xl relative overflow-hidden"
                    >
                       <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/[0.01] rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity" />
                       <div className="space-y-2 relative z-10">
                          <div className="flex items-baseline gap-1.5">
                             <span className="text-5xl font-black text-white leading-none tracking-tighter group-hover:text-green-400 transition-colors">{s.score}</span>
                             <span className="text-[10px] font-black text-white/10 tracking-widest group-hover:text-green-500/20 transition-colors uppercase">PTS</span>
                          </div>
                          <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Entry Date: {new Date(s.played_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                       </div>
                       <button 
                          onClick={() => handleDeleteScore(s.id)}
                          className="p-4 text-white/10 hover:text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all border border-transparent hover:border-rose-500/20 active:scale-90"
                       >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                       </button>
                    </motion.div>
                  ))
               )}
            </div>
         </div>

         {/* Meta-Context and Behavioral History */}
         <div className="space-y-12">
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="bg-white/[0.01] border border-white/5 rounded-[3rem] p-10 space-y-10 shadow-2xl backdrop-blur-3xl relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/[0.01] rounded-full blur-[60px]" />
               <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Registry Global Context</h3>
               <div className="space-y-8">
                  <div className="group">
                     <span className="text-[9px] text-white/20 font-black uppercase tracking-widest block mb-1 group-hover:text-green-500/40 transition-colors">Assigned Charity Node</span>
                     <p className="text-white text-lg font-black tracking-tight group-hover:text-green-400 transition-colors uppercase leading-none">{user.charities?.name || 'Unmapped / Void'}</p>
                  </div>
                  <div className="group">
                     <span className="text-[9px] text-white/20 font-black uppercase tracking-widest block mb-1 group-hover:text-green-500/40 transition-colors">Current Verification State</span>
                     <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full shadow-lg ${status === 'active' ? 'bg-green-500 shadow-green-500/50' : 'bg-white/20 shadow-white/10'}`} />
                        <p className="text-white font-black text-sm uppercase tracking-widest">{status}</p>
                     </div>
                  </div>
               </div>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.1 }}
               className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 space-y-10 shadow-2xl backdrop-blur-3xl relative overflow-hidden"
            >
               <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-500/[0.01] rounded-full blur-[60px]" />
               <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Encoutered Prize Intersections</h3>
               {drawResults.length === 0 ? (
                  <p className="text-xs text-white/20 font-black uppercase tracking-widest italic leading-relaxed">No verified outcomes recorded in current cycle history.</p>
               ) : (
                  <div className="space-y-6">
                     {drawResults.map((dr, _idx) => (
                        <div key={dr.id} className="flex items-center justify-between border-b border-white/5 pb-6 last:border-0 last:pb-0 group">
                           <div className="space-y-1.5">
                              <span className="text-sm font-black text-white group-hover:text-green-400 transition-colors uppercase leading-none">{new Date(dr.draws.month + 'T00:00:00Z').toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                              <p className="text-[8px] text-white/20 font-black uppercase tracking-[0.3em]">{dr.match_count} Verified Alignment Matches</p>
                           </div>
                           <span className="text-lg font-black text-green-500 shadow-green-500/10 transition-transform group-hover:scale-110 tracking-tighter">£{Number(dr.prize_amount).toLocaleString()}</span>
                        </div>
                     ))}
                  </div>
               )}
            </motion.div>
         </div>

      </div>
    </div>
  );
}

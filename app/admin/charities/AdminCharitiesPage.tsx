'use client';

// Administrative command center for managing verified donor organizations registry
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { deleteCharity } from '@/app/actions/admin/charities';
import { motion } from 'framer-motion';

interface Charity {
  id: string;
  name: string;
  website_url: string;
  image_url?: string | null;
  is_featured: boolean;
  is_active: boolean;
  subscriberCount?: number;
}

export default function AdminCharitiesPage({ charities }: { charities: Charity[] }) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently de-activate this organization from the verified registry?')) return;
    setIsDeleting(id);
    const res = await deleteCharity(id);
    if (res?.error) alert(res.error);
    setIsDeleting(null);
  };

  return (
    <div className="space-y-16">
      
      {/* Header and Quick Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
        className="flex flex-col md:flex-row items-start md:items-end justify-between gap-10 border-b border-white/5 pb-16"
      >
        <div className="space-y-4">
           <span className="text-[10px] font-black uppercase tracking-[0.4em] text-green-500/60 ml-1">Registry Management</span>
           <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-black text-white tracking-tighter leading-none">Charity Portfolio</h1>
           <p className="text-white/30 font-bold max-w-2xl text-lg leading-relaxed">
              Synthesizing organizational alignments, spotlight featuring, and real-time registry status monitoring for all verified nonprofit partners.
           </p>
        </div>
        
        <Link 
           href="/admin/charities/new"
           className="px-10 py-5 bg-gradient-to-br from-green-400 to-green-600 hover:from-green-300 hover:to-green-500 text-neutral-950 font-black text-lg tracking-tight rounded-[2rem] shadow-[0_20px_40px_-10px_rgba(34,197,94,0.4)] transition-all hover:scale-[1.03] active:scale-95 flex items-center gap-4 group"
        >
           <div className="w-8 h-8 rounded-full bg-neutral-950/20 flex items-center justify-center group-hover:rotate-90 transition-transform duration-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M12 4v16m8-8H4" /></svg>
           </div>
           <span>Register Node</span>
        </Link>
      </motion.div>

      {/* Main Registry Ledger */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 1 }}
        className="bg-white/[0.01] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-3xl relative"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/[0.02] rounded-full blur-[100px] pointer-events-none" />
        
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left whitespace-nowrap text-sm">
            <thead>
              <tr className="bg-white/[0.02] text-white/40 text-[10px] font-black uppercase tracking-[0.3em] border-b border-white/5">
                <th className="px-10 py-8">Entity Identifier</th>
                <th className="px-8 py-8 text-center">Engagement Metrics</th>
                <th className="px-8 py-8 text-center">Spotlight Activation</th>
                <th className="px-8 py-8 text-center">Registry Status</th>
                <th className="px-10 py-8 text-right">System Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {charities.map((charity, idx) => (
                <motion.tr 
                  key={charity.id} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.05 }}
                  className="hover:bg-white/[0.03] transition-all group"
                >
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-6">
                       <div className="w-14 h-14 rounded-2xl bg-neutral-950 border border-white/5 p-1 flex items-center justify-center overflow-hidden shrink-0 group-hover:border-green-500/20 transition-colors shadow-lg">
                          {charity.image_url ? (
                             <Image src={charity.image_url!} alt={charity.name} width={56} height={56} className="w-full h-full object-cover rounded-xl" />
                          ) : (
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                          )}
                       </div>
                       <div className="flex flex-col">
                          <span className="font-black text-white text-lg tracking-tight leading-none mb-1 group-hover:text-green-400 transition-colors">{charity.name}</span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/20 truncate max-w-xs">{charity.website_url.replace(/(^\w+:|^)\/\//, '')}</span>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-8 text-center">
                     <span className="bg-white/[0.03] border border-white/5 px-4 py-2 rounded-xl font-black text-white/60 text-[10px] uppercase tracking-widest">
                        {charity.subscriberCount} Active
                     </span>
                  </td>
                  <td className="px-8 py-8 text-center">
                    {charity.is_featured ? (
                       <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-500/10 text-green-500 border border-green-500/30 rounded-full text-[9px] font-black uppercase tracking-[0.2em] leading-none shadow-[0_0_20px_rgba(34,197,94,0.15)] animate-pulse">
                          Featured
                       </span>
                    ) : (
                       <div className="w-1.5 h-1.5 rounded-full bg-white/5 mx-auto" />
                    )}
                  </td>
                  <td className="px-8 py-8 text-center">
                    {charity.is_active ? (
                       <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-500/10 text-green-500 border border-green-500/30 rounded-full text-[9px] font-black uppercase tracking-[0.2em] leading-none">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_#22C55E]" />
                          Online
                       </span>
                    ) : (
                       <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/[0.03] text-white/20 border border-white/5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] leading-none">
                          System Idle
                       </span>
                    )}
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                       <Link 
                          href={`/admin/charities/${charity.id}/edit`}
                          className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.05] rounded-xl border border-transparent hover:border-white/10 transition-all"
                       >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                       </Link>
                       <button 
                          onClick={() => handleDelete(charity.id)}
                          disabled={isDeleting === charity.id}
                          className="w-10 h-10 flex items-center justify-center text-white/20 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl border border-transparent hover:border-rose-500/20 transition-all disabled:opacity-10"
                       >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                       </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

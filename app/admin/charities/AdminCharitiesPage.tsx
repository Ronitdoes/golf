'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { deleteCharity } from '@/app/actions/admin/charities';
import { motion, AnimatePresence } from 'framer-motion';

interface DrawBreakdownItem {
  month: string;
  amount: number;
  source: string;
}

interface Charity {
  id: string;
  name: string;
  website_url: string;
  image_url?: string | null;
  is_featured: boolean;
  is_active: boolean;
  subscriberCount?: number;
  monthlyContribution?: number;
  drawContributions?: number;
  drawBreakdown?: DrawBreakdownItem[];
}

function formatMonth(monthStr: string) {
  try {
    return new Date(monthStr + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
  } catch { return monthStr; }
}

function formatSource(source: string) {
  if (source === 'match4_unclaimed') return 'Match 4';
  if (source === 'match3_unclaimed') return 'Match 3';
  return source;
}

export default function AdminCharitiesPage({ charities }: { charities: Charity[] }) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently de-activate this organization from the verified registry?')) return;
    setIsDeleting(id);
    const res = await deleteCharity(id);
    if (res?.error) alert(res.error);
    setIsDeleting(null);
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* High-Fidelity Header Section */}
      <div className="flex flex-col xl:flex-row items-start xl:items-end justify-between gap-10">
        <div className="space-y-3">
           <span className="text-[10px] font-black uppercase tracking-[0.4em] text-green-500/60 ml-1">Registry Management</span>
           <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-black text-white tracking-tighter leading-none">Charity Portfolio</h1>
           <p className="text-white/30 font-bold max-w-2xl text-lg leading-relaxed">
              Managing verified organizational alignments, impact metrics, and contribution flows across the global charity network.
           </p>
        </div>
        
        <Link 
          href="/admin/charities/new"
          className="px-10 py-5 bg-gradient-to-br from-green-400 to-green-600 hover:from-green-300 hover:to-green-500 text-neutral-950 font-black text-lg tracking-tight rounded-[2rem] shadow-[0_20px_40px_-10px_rgba(34,197,94,0.4)] transition-all hover:scale-[1.03] active:scale-95 flex items-center gap-4 group shrink-0"
        >
          <div className="w-6 h-6 rounded-full bg-neutral-950/20 flex items-center justify-center group-hover:rotate-90 transition-transform duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M12 4v16m8-8H4" /></svg>
          </div>
          <span>Register Node</span>
        </Link>
      </div>

      {/* Registry Table Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="bg-white/[0.01] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative backdrop-blur-3xl"
      >
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/[0.03] rounded-full blur-[100px] pointer-events-none" />
          
          <div className="overflow-x-auto relative z-10">
            <table className="w-full text-left whitespace-nowrap text-sm">
              <thead>
                <tr className="bg-white/[0.03] text-white/40 text-[9px] font-black uppercase tracking-[0.3em] border-b border-white/5">
                  <th className="px-8 py-5">Entity Identifier</th>
                  <th className="px-6 py-5 text-center">Subscribers</th>
                  <th className="px-6 py-5 text-center">Sub €/mo</th>
                  <th className="px-6 py-5 text-center">Draw Contributions</th>
                  <th className="px-8 py-5 text-right">Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {charities.map((charity, idx) => (
                  <React.Fragment key={charity.id}>
                    <motion.tr 
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + idx * 0.04 }}
                      className="hover:bg-white/[0.02] transition-all group cursor-pointer"
                      onClick={() => setExpandedId(expandedId === charity.id ? null : charity.id)}
                    >
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-neutral-950 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 group-hover:border-green-500/40 transition-colors shadow-xl">
                            {charity.image_url ? (
                              <Image src={charity.image_url!} alt={charity.name} width={40} height={40} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-black text-white text-base tracking-tight leading-none mb-1 group-hover:text-green-400 transition-colors">{charity.name}</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/20 truncate max-w-[240px]">{charity.website_url.replace(/(^\w+:|^)\/\//, '')}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-white/[0.03] border border-white/10 px-4 py-1.5 rounded-xl font-black text-white/60 text-[10px] uppercase tracking-widest shadow-inner">
                          {charity.subscriberCount ?? 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-4 py-1.5 rounded-xl font-black text-sm shadow-sm ${
                          (charity.monthlyContribution ?? 0) > 0
                            ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                            : 'bg-white/[0.03] border border-white/10 text-white/30'
                        }`}>
                          €{(charity.monthlyContribution ?? 0).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <span className={`px-4 py-1.5 rounded-xl font-black text-sm shadow-sm ${
                            (charity.drawContributions ?? 0) > 0
                              ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                              : 'bg-white/[0.03] border border-white/10 text-white/30'
                          }`}>
                            €{(charity.drawContributions ?? 0).toFixed(2)}
                          </span>
                          {(charity.drawBreakdown?.length ?? 0) > 0 && (
                            <span className="text-white/20 text-[10px] font-black uppercase tracking-widest bg-white/[0.05] w-6 h-6 flex items-center justify-center rounded-lg border border-white/5 group-hover:text-white transition-colors">
                              {expandedId === charity.id ? '▲' : '▼'}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <div className="flex items-center justify-end gap-3" onClick={e => e.stopPropagation()}>
                          <Link 
                            href={`/admin/charities/${charity.id}/edit`}
                            className="w-10 h-10 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.08] rounded-xl border border-white/5 hover:border-white/20 transition-all shadow-lg"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </Link>
                          <button 
                            onClick={() => handleDelete(charity.id)}
                            disabled={isDeleting === charity.id}
                            className="w-10 h-10 flex items-center justify-center text-white/20 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl border border-white/5 hover:border-rose-500/30 transition-all disabled:opacity-10 shadow-lg"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </motion.tr>

                    {/* Expandable Draw Breakdown */}
                    <AnimatePresence>
                      {expandedId === charity.id && (charity.drawBreakdown?.length ?? 0) > 0 && (
                        <motion.tr
                          key={`${charity.id}-breakdown`}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <td colSpan={5} className="px-8 pb-6 pt-0">
                            <div className="bg-rose-500/[0.03] border border-rose-500/10 rounded-[2rem] p-8 shadow-inner relative overflow-hidden">
                              <div className="absolute top-0 left-0 w-32 h-32 bg-rose-500/[0.02] rounded-full blur-[50px] pointer-events-none" />
                              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-400/60 mb-6 flex items-center gap-3">
                                 <div className="w-1 h-3 bg-rose-500 rounded-full" />
                                 Draw Contribution Breakdown
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {charity.drawBreakdown!.map((item, i) => (
                                  <div key={i} className="bg-white/[0.02] border border-white/5 rounded-[1.25rem] px-5 py-4 flex flex-col gap-1.5 hover:border-rose-500/20 transition-colors shadow-sm">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{formatMonth(item.month)}</span>
                                    <span className="text-[9px] font-black text-rose-400/40 uppercase tracking-widest">{formatSource(item.source)}</span>
                                    <span className="text-lg font-black text-rose-400 tracking-tighter">€{item.amount.toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
    </div>
  );
}

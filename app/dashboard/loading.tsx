'use client';

import { motion } from 'framer-motion';

export default function DashboardLoading() {
  return (
    <div className="space-y-12 animate-pulse">
      
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-4">
           <div className="flex flex-col gap-1">
              <div className="h-2 w-32 bg-white/5 rounded-full" />
              <div className="flex items-center gap-4 mt-2">
                <div className="h-16 w-64 bg-white/10 rounded-2xl" />
              </div>
           </div>
          <div className="h-3 w-96 bg-white/5 rounded-full" />
        </div>
        <div className="flex items-center gap-4 pb-2">
          <div className="h-14 w-40 bg-green-500/10 rounded-[1.25rem] border border-green-500/20" />
          <div className="h-14 w-40 bg-white/5 rounded-[1.25rem] border border-white/5" />
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[...Array(4)].map((_, i) => (
           <div key={i} className="bg-white/[0.01] border border-white/5 rounded-[2rem] p-8 h-48 space-y-6">
              <div className="flex items-center justify-between">
                <div className="h-2 w-20 bg-white/5 rounded-full" />
                <div className="h-10 w-10 bg-white/10 rounded-xl" />
              </div>
              <div className="space-y-2">
                <div className="h-8 w-24 bg-white/10 rounded-full" />
                <div className="h-2 w-32 bg-white/5 rounded-full" />
              </div>
           </div>
        ))}
      </div>

      {/* Large Content Skeleton */}
      <div className="bg-white/[0.01] border border-white/5 rounded-[3rem] h-[500px] relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent" />
         
         <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
            className="absolute inset-y-0 w-48 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent skew-x-12"
         />
         
         <div className="p-12 space-y-10">
            <div className="flex justify-between items-center">
              <div className="h-3 w-48 bg-white/10 rounded-full" />
              <div className="h-10 w-10 bg-white/10 rounded-xl" />
            </div>
            <div className="space-y-8">
               {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-8">
                     <div className="w-14 h-14 bg-white/5 rounded-2xl shrink-0" />
                     <div className="flex-1 space-y-3">
                        <div className="h-3 w-64 bg-white/10 rounded-full" />
                        <div className="h-2 w-32 bg-white/5 rounded-full" />
                     </div>
                     <div className="h-6 w-32 bg-white/5 rounded-full" />
                     <div className="h-12 w-12 bg-white/5 rounded-2xl" />
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}

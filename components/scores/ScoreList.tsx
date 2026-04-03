'use client';

// List component distributing score payloads seamlessly interacting with layout engines 
import { useState } from 'react';
import ScoreCard from './ScoreCard';
import type { Score } from '@/hooks/useScores';
import { motion, AnimatePresence } from 'framer-motion';

interface ScoreListProps {
  scores: Score[];
  onDelete: (id: string) => Promise<{ error?: string; success?: boolean }>;
  onEdit: (id: string, score: number) => Promise<{ error?: string; success?: boolean }>;
}

export default function ScoreList({ scores, onDelete, onEdit }: ScoreListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  };

  if (scores.length === 0) {
    return (
      <div className="bg-white/[0.01] border border-white/5 border-dashed rounded-[2.5rem] p-16 text-center mt-12 group hover:border-green-500/20 transition-colors duration-1000">
        <div className="w-16 h-16 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center mx-auto mb-6 relative">
           <div className="absolute inset-0 bg-white/5 blur-xl rounded-full" />
           <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
           </svg>
        </div>
        <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Zero Performance Stream</h3>
        <p className="text-white/20 font-bold uppercase tracking-widest text-[10px] max-w-xs mx-auto leading-relaxed">System awaiting initial score intake to authorize draw participation.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-col gap-4 w-full">
      <AnimatePresence initial={false} mode="popLayout">
        {scores.map((score) => (
          <motion.div
            key={score.id}
            layout
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', stiffness: 500, damping: 30, layout: { duration: 0.3 } }}
          >
            <ScoreCard 
               score={score} 
               onDelete={handleDelete} 
               onEdit={onEdit}
               isDeleting={deletingId === score.id}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

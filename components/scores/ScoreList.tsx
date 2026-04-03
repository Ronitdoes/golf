'use client';

// List component distributing score payloads seamlessly interacting with layout engines 
import { useState } from 'react';
import ScoreCard from './ScoreCard';
import type { Score } from '@/hooks/useScores';
import { motion, AnimatePresence } from 'framer-motion';

interface ScoreListProps {
  scores: Score[];
  onDelete: (id: string) => Promise<void>;
}

export default function ScoreList({ scores, onDelete }: ScoreListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  };

  if (scores.length === 0) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 border-dashed rounded-xl p-8 text-center mt-6">
        <p className="text-neutral-400">No scores yet. Enter your first score to participate securely in automated draws.</p>
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-col gap-0 w-full overflow-hidden px-1 py-1">
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
               isDeleting={deletingId === score.id}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

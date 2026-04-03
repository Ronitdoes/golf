import { useState } from 'react';
import type { Score } from '@/hooks/useScores';

interface ScoreCardProps {
  score: Score;
  onDelete: (id: string) => void;
  onEdit: (id: string, score: number) => Promise<any>;
  isDeleting?: boolean;
}

export default function ScoreCard({ score, onDelete, onEdit, isDeleting }: ScoreCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedScore, setEditedScore] = useState(score.score);
  const [isUpdating, setIsUpdating] = useState(false);

  const dateObj = new Date(score.played_at);
  const dateStr = dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  });

  const percentage = Math.min(100, Math.max(0, (score.score / 45) * 100));

  const handleSave = async () => {
    if (editedScore === score.score) {
      setIsEditing(false);
      return;
    }
    setIsUpdating(true);
    await onEdit(score.id, editedScore);
    setIsUpdating(false);
    setIsEditing(false);
  };

  return (
    <div className="bg-white/[0.01] border border-white/5 rounded-[1.5rem] p-6 flex items-center justify-between mb-2 shadow-xl hover:border-green-500/20 hover:bg-green-500/[0.01] transition-all group overflow-hidden relative">
      <div className="absolute top-0 left-0 w-24 h-24 bg-green-500/[0.01] blur-2xl rounded-full -ml-12 -mt-12 pointer-events-none" />
      
      <div className="flex-1 mr-8 relative z-10">
        <div className="flex items-end justify-between mb-3 leading-none px-1">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input 
                type="number"
                min="1"
                max="45"
                value={editedScore}
                onChange={(e) => setEditedScore(Number(e.target.value))}
                className="w-16 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-white font-black text-xl focus:outline-none focus:border-green-500/40"
                autoFocus
              />
              <span className="text-white/20 font-black text-[10px] uppercase tracking-widest mt-1">pts</span>
            </div>
          ) : (
            <div className="flex items-end gap-1.5">
              <span className="text-3xl font-black text-white tracking-tighter leading-none">{score.score}</span>
              <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Stability Units</span>
            </div>
          )}
          <div className="flex flex-col items-end">
            <span className="text-white/30 font-black text-[9px] uppercase tracking-[0.3em] mb-1">Operational Date</span>
            <span className="text-white font-black text-[10px] uppercase tracking-widest leading-none">{dateStr}</span>
          </div>
        </div>
        <div className="w-full bg-white/[0.03] h-2 rounded-full overflow-hidden border border-white/5 p-[1px]">
          <div 
             className="bg-gradient-to-r from-green-500 to-emerald-400 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(34,197,94,0.3)]"
             style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2 shrink-0 relative z-10">
        {isEditing ? (
          <>
            <button 
              onClick={handleSave}
              disabled={isUpdating}
              className="p-3 text-green-500 bg-green-500/5 hover:bg-green-500/10 border border-green-500/20 rounded-xl transition-all"
              title="Commit Changes"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </button>
            <button 
              onClick={() => { setIsEditing(false); setEditedScore(score.score); }}
              className="p-3 text-white/30 hover:bg-white/5 border border-white/5 rounded-xl transition-all"
              title="Abort"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={() => setIsEditing(true)}
              disabled={isDeleting || score.id.startsWith('temp')}
              className="p-3 text-white/20 hover:text-white hover:bg-white/5 border border-white/5 rounded-xl transition-all lg:opacity-0 group-hover:opacity-100"
              title="Modify Node"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </button>
            <button 
              onClick={() => onDelete(score.id)}
              disabled={isDeleting || score.id.startsWith('temp')}
              className="p-3 text-white/20 hover:text-red-500 hover:bg-red-500/10 border border-white/5 rounded-xl transition-all lg:opacity-0 group-hover:opacity-100"
              title="Purge Node"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

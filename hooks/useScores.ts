'use client';

// Client hook for conceptually managing scores, tightly wrapped around optimistic interactions
import { useState, useEffect, useCallback } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { getUserScores, addScore as addScoreAction, deleteScore as deleteScoreAction, updateScore as updateScoreAction } from '@/app/actions/scores';

export interface Score {
  id: string;
  user_id: string;
  score: number;
  played_at: string;
  created_at: string;
}

export function useScores() {
  const [scores, setScores] = useState<Score[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const fetchScores = useCallback(async () => {
    setIsLoading(true);
    const supabase = createBrowserSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      setUserId(user.id);
      try {
        const data = await getUserScores(user.id);
        setScores(data as Score[]);
      } catch (e) {
        console.error(e);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  const addScore = async (score: number, playedAt: Date) => {
    if (!userId) return { error: 'User missing' };
    
    // Optimistic Insertion explicitly modeling the backend trigger logic behavior
    const optimisticScore: Score = {
      id: `temp-${Date.now()}`,
      user_id: userId,
      score,
      played_at: playedAt.toISOString().split('T')[0],
      created_at: new Date().toISOString()
    };
    
    setScores(prev => {
      // Re-sort factoring newly injected transient instance
      const newScores = [optimisticScore, ...prev].sort((a, b) => new Date(b.played_at).getTime() - new Date(a.played_at).getTime());
      
      // Enforce the 5-score physical length constraint identically to the DB trigger natively in the UI
      return newScores.slice(0, 5); 
    });

    const res = await addScoreAction(score, playedAt);
    
    if (res?.error) {
       // Graceful rollback handling via forced synchronisation fetching
       await fetchScores();
       return res;
    }
    
    // Verify sync definitively
    await fetchScores();
    return { success: true };
  };

  const deleteScore = async (scoreId: string) => {
    // Optimistic Deletion
    setScores(prev => prev.filter(s => s.id !== scoreId));
    
    const res = await deleteScoreAction(scoreId);
    
    if (res?.error) {
       await fetchScores();
       return res;
    }
    
    await fetchScores();
    return { success: true };
  };

  const editScore = async (scoreId: string, score: number) => {
    // Optimistic Update
    setScores(prev => prev.map(s => s.id === scoreId ? { ...s, score } : s));
    
    const res = await updateScoreAction(scoreId, score);
    
    if (res?.error) {
       await fetchScores();
       return res;
    }
    
    await fetchScores();
    return { success: true };
  };

  return { scores, isLoading, addScore, deleteScore, editScore, refresh: fetchScores };
}

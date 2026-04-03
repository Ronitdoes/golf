'use client';

// Administrative interface for logic selection, simulation, and publication of monthly draws
import { useState } from 'react';
import DrawPreview from './DrawPreview';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

interface SimulationData {
  drawnNumbers: number[];
  winners: { match5: number; match4: number; match3: number };
  pool: { totalPrizePool: number; charityTotal: number };
  jackpotRollover: number;
}

export default function DrawControl({ drawId }: { drawId: string }) {
  const [logicType, setLogicType] = useState<'random' | 'algorithmic'>('random');
  const [isSimulating, setIsSimulating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [simulationData, setSimulationData] = useState<SimulationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // Initialize Supabase client for session retrieval
  const supabase = createBrowserSupabaseClient();

  const runSimulation = async () => {
    setIsSimulating(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      const res = await fetch('/api/draws/run', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ drawId, mode: 'simulation', logicType })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSimulationData(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsSimulating(false);
    }
  };

  const publishResults = async () => {
    setIsPublishing(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const res = await fetch('/api/draws/run', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ drawId, mode: 'publish', logicType })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      // Successfully published
      window.location.reload(); 
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
      setShowConfirm(false);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 max-w-2xl mx-auto shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6">Draw Controls</h2>
        
        <div className="space-y-6">
          <div className="space-y-3">
             <span className="text-sm font-medium text-neutral-400">Logic Type</span>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setLogicType('random')}
                className={`flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border-2 transition-all font-bold ${logicType === 'random' ? 'border-green-500 bg-green-500/10 text-white' : 'border-neutral-800 bg-neutral-950 text-neutral-500 hover:border-neutral-700'}`}
              >
                <div className={`w-4 h-4 rounded-full border-2 ${logicType === 'random' ? 'border-green-500 bg-green-500' : 'border-neutral-700'}`} />
                Random
              </button>
              <button 
                onClick={() => setLogicType('algorithmic')}
                className={`flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border-2 transition-all font-bold ${logicType === 'algorithmic' ? 'border-green-500 bg-green-500/10 text-white' : 'border-neutral-800 bg-neutral-950 text-neutral-500 hover:border-neutral-700'}`}
              >
                <div className={`w-4 h-4 rounded-full border-2 ${logicType === 'algorithmic' ? 'border-green-500 bg-green-500' : 'border-neutral-700'}`} />
                Weighted
              </button>
            </div>
          </div>

          <button 
            onClick={runSimulation}
            disabled={isSimulating || isPublishing}
            className="w-full py-4 bg-neutral-800 hover:bg-neutral-700 text-white font-black text-lg tracking-wider rounded-2xl border border-neutral-700 transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {isSimulating ? 'Simulating Physics...' : 'RUN SIMULATION'}
          </button>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 text-red-500 text-sm font-bold rounded-xl text-center">
            {error}
          </div>
        )}
      </div>

      {simulationData && (
        <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-700">
           <hr className="border-neutral-800" />
           
           <div className="text-center">
              <div className="inline-block px-4 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/30 text-xs font-black uppercase tracking-widest rounded-full mb-4">
                 Simulation Results Preview
              </div>
              <h2 className="text-4xl font-black text-white tracking-tighter">Draft Results Preview</h2>
           </div>

           <DrawPreview 
             drawnNumbers={simulationData.drawnNumbers} 
             winners={simulationData.winners} 
             pool={simulationData.pool} 
             rollover={simulationData.jackpotRollover}
           />

           <div className="flex flex-col items-center gap-4">
              <button 
                onClick={() => setShowConfirm(true)}
                disabled={isPublishing}
                className="px-12 py-5 bg-green-500 hover:bg-green-400 text-neutral-950 font-black text-xl tracking-tight rounded-2xl shadow-[0_20px_40px_-10px_rgba(34,197,94,0.5)] transition-all active:scale-95 disabled:opacity-50"
              >
                OFFICIALLY PUBLISH RESULTS
              </button>
              <p className="text-neutral-500 text-sm">Validates alignment and broadcasts to all verified subscribers.</p>
           </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-neutral-950/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-10 max-w-lg shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] text-center animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-amber-500/20 border-2 border-amber-500/50 rounded-full flex items-center justify-center mx-auto mb-8">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h3 className="text-3xl font-black text-white tracking-tight mb-4">Critical Alignment</h3>
            <p className="text-neutral-400 mb-10 leading-relaxed text-lg">
               Publishing results is <strong>irreversible</strong>. 
               This will process all prize allocations and notify established winners immediately. 
            </p>
            <div className="flex flex-col gap-4">
               <button 
                  onClick={publishResults}
                  disabled={isPublishing}
                  className="w-full py-5 bg-green-500 hover:bg-green-400 text-neutral-950 font-black text-xl rounded-2xl transition-all shadow-lg active:scale-95 disabled:opacity-50"
               >
                  {isPublishing ? 'Broadcasting...' : 'YES, PUBLISH NOW'}
               </button>
               <button 
                  onClick={() => setShowConfirm(false)}
                  disabled={isPublishing}
                  className="w-full py-4 text-neutral-500 hover:text-white font-bold transition-all"
               >
                  Cancel & Review
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

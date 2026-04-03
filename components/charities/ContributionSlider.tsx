'use client';

import { useState } from 'react';

interface ContributionSliderProps {
  initialValue: number;
  updateAction: (formData: FormData) => Promise<void>;
}

export default function ContributionSlider({ initialValue, updateAction }: ContributionSliderProps) {
  const [value, setValue] = useState(initialValue);

  return (
    <form action={updateAction} className="mt-auto space-y-6 relative z-10">
      <div className="flex items-end gap-1">
        <span className="text-5xl font-black text-white tracking-tighter">{value}</span>
        <span className="text-lg font-black text-green-500 mb-1.5 uppercase tracking-widest">%</span>
      </div>
      
      <div className="relative pt-2 pb-2">
        <input 
          type="range" 
          id="percentage" 
          name="percentage"
          min="10" 
          max="100" 
          step="5"
          value={value}
          onChange={(e) => setValue(parseInt(e.target.value))}
          className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-green-500 hover:accent-green-400 transition-all border border-white/5"
        />
        <div className="flex justify-between text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mt-3">
          <span>Min (10%)</span>
          <span>Max (100%)</span>
        </div>
      </div>

      <button type="submit" className="w-full py-4 bg-white text-neutral-950 font-black rounded-xl hover:bg-green-500 transition-all text-[10px] uppercase tracking-[0.2em] shadow-xl hover:shadow-green-500/20 active:scale-95">
        Update Allocation
      </button>
    </form>
  );
}

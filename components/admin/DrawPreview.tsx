'use client';

// styled display for lottery numbers with standard ball aesthetics
export default function DrawPreview({ 
  drawnNumbers, 
  winners, 
  pool, 
  rollover 
}: { 
  drawnNumbers: number[] | null, 
  winners: { match5: number, match4: number, match3: number },
  pool?: { totalPrizePool: number },
  rollover?: number
}) {
  if (!drawnNumbers) return null;

  const pool5 = (pool?.totalPrizePool || 0) * 0.40 + (rollover || 0);
  const pool4 = (pool?.totalPrizePool || 0) * 0.35;
  const pool3 = (pool?.totalPrizePool || 0) * 0.25;

  const payout5 = winners.match5 > 0 ? pool5 : 0;
  const payout4 = winners.match4 > 0 ? pool4 : 0;
  const payout3 = winners.match3 > 0 ? pool3 : 0;
  const totalPayout = payout5 + payout4 + payout3;

  // Unclaimed tiers go to charity
  const charityFromDraw = (winners.match4 === 0 ? pool4 : 0) + (winners.match3 === 0 ? pool3 : 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Visual Ball Display */}
      <div className="flex flex-col items-center justify-center p-8 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-inner shadow-black/50">
        <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-neutral-500 mb-6">Verified Winning Alignment</h3>
        <div className="flex gap-4 sm:gap-6 flex-wrap justify-center">
          {drawnNumbers.map((num, i) => (
            <div 
              key={i} 
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-neutral-950 text-2xl sm:text-3xl font-black shadow-[0_10px_30px_-5px_rgba(34,197,94,0.4)] border-b-4 border-green-800 ring-4 ring-neutral-950"
            >
              {num}
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Winner Breakdown</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-neutral-500 border-b border-neutral-800 text-left">
                <th className="pb-2">Match Type</th>
                <th className="pb-2 text-center">Winners</th>
                <th className="pb-2 text-right">Prize (ea)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              <tr className="text-white">
                <td className="py-3 font-medium">Match 5 (Jackpot)</td>
                <td className="py-3 text-center">{winners.match5}</td>
                <td className="py-3 text-right text-green-400 font-bold">
                  {winners.match5 > 0
                    ? `€${(pool5 / winners.match5).toFixed(2)}`
                    : 'Rolled Over'}
                </td>
              </tr>
              <tr className="text-white">
                <td className="py-3 font-medium">Match 4</td>
                <td className="py-3 text-center">{winners.match4}</td>
                <td className="py-3 text-right">
                  {winners.match4 > 0 
                    ? <span className="text-white">€{(pool4 / winners.match4).toFixed(2)}</span>
                    : <span className="text-rose-400 font-bold text-xs">→ Charity</span>}
                </td>
              </tr>
              <tr className="text-white">
                <td className="py-3 font-medium">Match 3</td>
                <td className="py-3 text-center">{winners.match3}</td>
                <td className="py-3 text-right">
                  {winners.match3 > 0 
                    ? <span className="text-white">€{(pool3 / winners.match3).toFixed(2)}</span>
                    : <span className="text-rose-400 font-bold text-xs">→ Charity</span>}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="space-y-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h4 className="text-sm font-medium text-neutral-500 mb-1">Total Payout to Winners</h4>
            <div className="text-3xl font-black text-white">
              €{totalPayout.toFixed(2)}
            </div>
          </div>

          {charityFromDraw > 0 && (
            <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-6">
              <h4 className="text-sm font-medium text-neutral-500 mb-1">Unclaimed → Charity Pool</h4>
              <div className="text-3xl font-black text-rose-400">
                €{charityFromDraw.toFixed(2)}
              </div>
              <p className="text-[10px] text-neutral-600 mt-2 uppercase tracking-widest font-bold">
                Distributed proportionally to participants&apos; charities
              </p>
            </div>
          )}

          {winners.match5 === 0 && (
             <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-center">
                Jackpot Rollover Activated
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

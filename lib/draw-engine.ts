// Core backend draw engine defining deterministic and pseudo-random mathematical lotteries without framework dependencies
// Provides exact calculations for algorithmic frequency targeting and payout distribution safely natively

export function generateRandomDraw(): number[] {
  const numbers = new Set<number>();
  while (numbers.size < 5) {
    const randomNum = Math.floor(Math.random() * 45) + 1;
    numbers.add(randomNum);
  }
  return Array.from(numbers).sort((a, b) => a - b);
}

export function generateAlgorithmicDraw(allUserScores: number[]): number[] {
  // Graceful fallback mimicking algorithmic bounds reliably if inadequate data pool sizes exist
  if (allUserScores.length < 10) {
    return generateRandomDraw();
  }

  // Calculate raw absolute frequencies across all 1-45 bounded integers securely
  const frequencies: Record<number, number> = {};
  for (let i = 1; i <= 45; i++) {
    frequencies[i] = 0;
  }
  
  for (const score of allUserScores) {
    if (frequencies[score] !== undefined) {
      frequencies[score]++;
    }
  }

  // Map explicitly requested weighted algorithms merging dense and sparse mapping values natively
  const weights = new Map<number, number>();
  let totalWeight = 0;

  for (let i = 1; i <= 45; i++) {
    const frequency = frequencies[i];
    // Specific algorithmic weighting parameter isolated: balances frequent mapping while reserving chance artificially
    // Weight = frequency + (1 / (frequency + 1))
    const weight = frequency + (1 / (frequency + 1));
    weights.set(i, weight);
    totalWeight += weight;
  }

  const drawn = new Set<number>();
  
  // Weighted Random Generation bounded up optimally targeting exactly 5 unique selections
  while (drawn.size < 5) {
    let randomThreshold = Math.random() * totalWeight;
    let selectedNum = -1;

    for (let i = 1; i <= 45; i++) {
      if (drawn.has(i)) continue;

      const w = weights.get(i)!;
      randomThreshold -= w;

      // Track every valid candidate so the last one serves as float-precision fallback,
      // preventing systematic bias toward the lowest available number.
      selectedNum = i;

      if (randomThreshold <= 0) break;
    }

    drawn.add(selectedNum);

    // Recalculate accurately bounded totalWeight exclusively excluding inherently drawn items strictly securely.
    totalWeight = 0;
    for (let i = 1; i <= 45; i++) {
       if (!drawn.has(i)) {
          totalWeight += weights.get(i)!;
       }
    }
  }

  return Array.from(drawn).sort((a, b) => a - b);
}

export function calculateMatches(drawnNumbers: number[], userScores: number[]): number {
  const drawnSet = new Set(drawnNumbers);
  let matches = 0;
  for (const score of userScores) {
    if (drawnSet.has(score)) {
      matches++;
    }
  }
  return matches;
}

export function calculatePrizeAmount(
  matchCount: 3 | 4 | 5, 
  totalPool: number, 
  winnerCount: number, 
  jackpotRollover: number
): number {
  if (winnerCount === 0) return 0;

  let allocation = 0;
  
  switch (matchCount) {
    case 5:
      // 40% of standard monthly pool actively integrated + Historical rolled over Jackpots
      allocation = (totalPool * 0.40) + jackpotRollover;
      break;
    case 4:
      // 35% explicitly defined
      allocation = totalPool * 0.35;
      break;
    case 3:
      // 25% explicitly defined
      allocation = totalPool * 0.25;
      break;
    default:
      return 0;
  }

  return allocation / winnerCount;
}

export function calculateTotalPrizePool(
  activeSubscriberCount: number, // Total aggregate uniquely tracking logical bounds conditionally
  monthlyPlanPrice: number, 
  yearlyPlanPrice: number, 
  monthlyCount: number, 
  yearlyCount: number
): number {
  // Aggregate specific logic bounding correctly accounting yearly as a fraction explicitly natively logically internally
  const monthlyRevenue = monthlyCount * monthlyPlanPrice;
  const yearlyProratedRevenue = yearlyCount * (yearlyPlanPrice / 12);
  const totalEstimatedRevenue = monthlyRevenue + yearlyProratedRevenue;

  // 60% of absolute generated mathematically aggregated revenue globally allocated precisely targeting the prize pool securely natively
  return totalEstimatedRevenue * 0.60;
}

import { createClient } from '@supabase/supabase-js';
import { calculateMonthlyPrizePool, getPreviousJackpot } from './prize-pool';
import { generateRandomDraw, generateAlgorithmicDraw, calculateMatches, calculatePrizeAmount } from './draw-engine';
import { sendDrawResultsEmail } from '@/emails/draw-results';
import { sendWinnerNotification } from '@/emails/winner-notification';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function runDraw(drawId: string, mode: 'simulation' | 'publish', logicType: 'random' | 'algorithmic', preDrawnNumbers: number[] | null = null) {
  // 1. Target profiles with both ID and metadata for email notifications
  const { data: profiles } = await supabaseAdmin
    .from('profiles')
    .select('id, full_name, email, subscription_status')
    .eq('subscription_status', 'active')
    .eq('is_admin', false);
    
  if (!profiles || profiles.length === 0) {
      throw new Error('Globally explicit target set fundamentally empty mathematically.');
  }

  const subscriberIds = profiles.map(p => p.id);

  // 2. Extrapolate sequentially bounded physical metrics inherently securely 
  const { data: allScores } = await supabaseAdmin
    .from('scores')
    .select('user_id, score')
    .in('user_id', subscriberIds);

  const scoreMap = new Map<string, number[]>();
  subscriberIds.forEach(id => scoreMap.set(id, []));
  
  if (allScores) {
    for (const row of allScores) {
      scoreMap.get(row.user_id)?.push(row.score);
    }
  }

  // Quantify eligibility boundaries extracting explicitly 5-bound integers dynamically universally natively
  const eligibleSubscribers: string[] = [];
  const allAlgorithmScores: number[] = [];

  for (const [userId, scores] of scoreMap.entries()) {
    if (scores.length === 5) {
      eligibleSubscribers.push(userId);
      allAlgorithmScores.push(...scores);
    }
  }

  // Map backend dynamically explicit formulas structurally intrinsically correctly automatically generating financial routes
  let poolStats;
  try {
     poolStats = await calculateMonthlyPrizePool();
  } catch (_error) {
     throw new Error('Explicit Stripe-emulated mathematical projection universally dropped globally explicitly natively.');
  }
  
  const rollover = await getPreviousJackpot();
  
  // On publish: use the pre-simulated numbers so the admin publishes exactly what they reviewed.
  // On simulation: generate fresh numbers.
  const drawnNumbers = (mode === 'publish' && preDrawnNumbers && preDrawnNumbers.length === 5)
    ? preDrawnNumbers
    : (logicType === 'algorithmic' && eligibleSubscribers.length >= 5) 
      ? generateAlgorithmicDraw(allAlgorithmScores)
      : generateRandomDraw();

  const results = [];
  let match5Count = 0;
  let match4Count = 0;
  let match3Count = 0;

  // Pass 1: Aggregate global structurally unique boundaries identifying matching quantities dynamically 
  const userMatches = new Map<string, number>();
  for (const userId of eligibleSubscribers) {
     const matches = calculateMatches(drawnNumbers, scoreMap.get(userId)!);
     userMatches.set(userId, matches);
     if (matches === 5) match5Count++;
     else if (matches === 4) match4Count++;
     else if (matches === 3) match3Count++;
  }

  // Pass 2: Physically route payouts conditionally sequentially extracting fractions algorithmically safely 
  for (const [userId, matches] of userMatches.entries()) {
     if (matches >= 3 && matches <= 5) {
         const countForTier = matches === 5 ? match5Count : matches === 4 ? match4Count : match3Count;
         const amount = calculatePrizeAmount(matches as 3|4|5, poolStats.totalPrizePool, countForTier, rollover);
         
         results.push({
            user_id: userId,
            match_count: matches,
            prize_amount: Number(amount.toFixed(2)) // Force explicitly numerical natively logically globally inherently safely 
         });
     }
  }

  const summary = {
      drawId,
      logicType,
      mode,
      totalEligible: eligibleSubscribers.length,
      drawnNumbers,
      pool: poolStats,
      jackpotRollover: rollover,
      winners: {
         match5: match5Count,
         match4: match4Count,
         match3: match3Count
      },
      results
  };

  // Calculate outgoing rollover to save to the database for the NEXT draw to pick up
  const outgoingRollover = match5Count === 0
      ? Number((poolStats.totalPrizePool * 0.40).toFixed(2)) + rollover
      : 0;

  // Determine implicit isolated update strategies mathematically strictly bounding
  if (mode === 'simulation') {
      await supabaseAdmin.from('draws').update({
         status: 'simulation',
         logic_type: logicType,
         drawn_numbers: drawnNumbers,
         total_prize_pool: poolStats.totalPrizePool,
         jackpot_rollover_amount: outgoingRollover,
      }).eq('id', drawId); 
      
  } else if (mode === 'publish') {
      await supabaseAdmin.from('draws').update({
         status: 'published',
         logic_type: logicType,
         drawn_numbers: drawnNumbers,
         total_prize_pool: poolStats.totalPrizePool,
         jackpot_rollover_amount: outgoingRollover,
         published_at: new Date().toISOString()
      }).eq('id', drawId);

      // Batch mapping explicitly natively injecting structurally securely 
      if (results.length > 0) {
         const dbResults = results.map(r => ({
             draw_id: drawId,
             user_id: r.user_id,
             match_count: r.match_count,
             prize_amount: r.prize_amount,
             payment_status: 'pending'
         }));
         await supabaseAdmin.from('draw_results').insert(dbResults);
      }

      // Distribute unclaimed Match 4 and Match 3 prize pools equally across all active charities
      const charityInserts: { draw_id: string; charity_id: string; amount: number; source: string }[] = [];

      const unclaimedSources: { source: 'match4_unclaimed' | 'match3_unclaimed'; amount: number }[] = [];
      if (match4Count === 0) {
        const match4Amount = Number((poolStats.totalPrizePool * 0.35).toFixed(2));
        if (match4Amount > 0) unclaimedSources.push({ source: 'match4_unclaimed', amount: match4Amount });
      }
      if (match3Count === 0) {
        const match3Amount = Number((poolStats.totalPrizePool * 0.25).toFixed(2));
        if (match3Amount > 0) unclaimedSources.push({ source: 'match3_unclaimed', amount: match3Amount });
      }

      if (unclaimedSources.length > 0) {
        // Fetch all active charities — split equally regardless of participant support
        const { data: activeCharities } = await supabaseAdmin
          .from('charities')
          .select('id')
          .eq('is_active', true);

        const charityIds = (activeCharities || []).map(c => c.id);
        const numCharities = charityIds.length;

        if (numCharities > 0) {
          for (const { source, amount } of unclaimedSources) {
            const equalShare = Number((amount / numCharities).toFixed(2));
            for (const charityId of charityIds) {
              if (equalShare > 0) {
                charityInserts.push({ draw_id: drawId, charity_id: charityId, amount: equalShare, source });
              }
            }
          }
        }

        if (charityInserts.length > 0) {
          await supabaseAdmin.from('charity_draw_contributions').insert(charityInserts);
        }
      }


      // 4. TRIGGER EMAILS
      const { data: drawRecord } = await supabaseAdmin.from('draws').select('month').eq('id', drawId).single();
      const monthName = drawRecord?.month ? new Date(drawRecord.month + 'T00:00:00Z').toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : 'this month';

      for (const profile of profiles) {
        const matches = userMatches.get(profile.id) || 0;
        const scores = scoreMap.get(profile.id) || [];
        
        // Notify all active participants of results
        await sendDrawResultsEmail(
          profile.email, 
          profile.full_name, 
          monthName, 
          drawnNumbers, 
          scores, 
          matches
        );

        // If winner (3+ matches), send specific winner notification
        if (matches >= 3) {
          const result = results.find(r => r.user_id === profile.id);
          if (result) {
            await sendWinnerNotification(
              profile.email,
              profile.full_name,
              result.prize_amount,
              matches as 3|4|5,
              monthName
            );
          }
        }
      }
  }

  return summary;
}

// Serverside route for specific draw management session (Simulation/Publishing)
import { getDrawById } from '@/app/actions/draws';
import { getPreviousJackpot, calculateMonthlyPrizePool } from '@/lib/prize-pool';
import { createServerSupabaseClient } from '@/lib/supabase';
import AdminDrawDetailPage from './AdminDrawDetailPage';
import { notFound } from 'next/navigation';

interface ProfileWithScores {
  id: string;
  scores: { id: string }[];
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getDrawById(id);
  
  if (result.error) {
    console.error('[DRAW_PAGE_ERROR]', { id, error: result.error });
    return (
       <div className="p-10 text-red-500 font-bold border border-red-500/20 bg-red-500/10 rounded-2xl">
          Error retrieving draw: {result.error}
          <div className="mt-2 text-xs opacity-50">ID Attempted: {id}</div>
       </div>
    );
  }

  const { draw, results } = result;
  if (!draw) return notFound();

  const supabase = await createServerSupabaseClient();
  
  // Count eligible users: Active Subscription and exactly 5 scores
  const { data: eligibleUsers } = await supabase
    .from('profiles')
    .select('id, scores!inner(id)')
    .eq('subscription_status', 'active')
    .returns<ProfileWithScores[]>();
    
  // Filter to profiles with exactly 5 scores
  const count = eligibleUsers?.filter((u) => u.scores.length === 5).length || 0;
  
  // Load historical rollover (the incoming vault rollover for THIS draw)
  // Which is the outgoing jackpot_rollover_amount of the draw immediately preceding this one.
  const { data: previousDraw } = await supabase
    .from('draws')
    .select('jackpot_rollover_amount')
    .neq('id', id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
    
  const rollover = Number(previousDraw?.jackpot_rollover_amount || 0);

  // Compute winner counts:
  // - For published draws: read from draw_results rows
  // - For simulation draws: recompute by comparing drawn_numbers vs actual scores
  //   (draw_results rows are only inserted on publish, not simulation)
  const winnerCounts = { match5: 0, match4: 0, match3: 0 };

  if (draw.status === 'published') {
    for (const r of results || []) {
      if (r.match_count === 5) winnerCounts.match5++;
      else if (r.match_count === 4) winnerCounts.match4++;
      else if (r.match_count === 3) winnerCounts.match3++;
    }
  } else if (draw.status === 'simulation' && draw.drawn_numbers?.length === 5) {
    // Fetch all eligible users' scores
    const { data: allScores } = await supabase
      .from('scores')
      .select('user_id, score')
      .in('user_id', eligibleUsers?.filter(u => u.scores.length === 5).map(u => u.id) || []);

    // Group scores by user
    const scoreMap = new Map<string, Set<number>>();
    for (const row of allScores || []) {
      if (!scoreMap.has(row.user_id)) scoreMap.set(row.user_id, new Set());
      scoreMap.get(row.user_id)!.add(row.score);
    }

    const drawnSet = new Set(draw.drawn_numbers);
    for (const [, scores] of scoreMap) {
      let matches = 0;
      for (const s of scores) { if (drawnSet.has(s)) matches++; }
      if (matches === 5) winnerCounts.match5++;
      else if (matches === 4) winnerCounts.match4++;
      else if (matches === 3) winnerCounts.match3++;
    }
  }


  return (
    <AdminDrawDetailPage 
       draw={draw} 
       eligibleCount={count} 
       rollover={rollover}
     winnerCounts={winnerCounts}
    />
  );
}


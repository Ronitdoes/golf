// Serverside route for specific draw management session (Simulation/Publishing)
import { getDrawById } from '@/app/actions/draws';
import { getPreviousJackpot } from '@/lib/prize-pool';
import { createServerSupabaseClient } from '@/lib/supabase';
import AdminDrawDetailPage from './AdminDrawDetailPage';
import { notFound } from 'next/navigation';

interface ProfileWithScores {
  id: string;
  scores: { id: string }[];
}

export default async function Page({ params }: { params: { id: string } }) {
  const result = await getDrawById(params.id);
  
  if (result.error) {
    console.error('[DRAW_PAGE_ERROR]', { id: params.id, error: result.error });
    return (
       <div className="p-10 text-red-500 font-bold border border-red-500/20 bg-red-500/10 rounded-2xl">
          Error retrieving draw: {result.error}
          <div className="mt-2 text-xs opacity-50">ID Attempted: {params.id}</div>
       </div>
    );
  }

  const { draw } = result;
  if (!draw) return notFound();

  const supabase = createServerSupabaseClient();
  
  // Count eligible users: Active Subscription and exactly 5 scores
  const { data: eligibleUsers } = await supabase
    .from('profiles')
    .select('id, scores!inner(id)')
    .eq('subscription_status', 'active')
    .returns<ProfileWithScores[]>();
    
  // Filter to profiles with exactly 5 scores (Supabase join doesn't support count-filtering natively)
  const count = eligibleUsers?.filter((u) => u.scores.length === 5).length || 0;
  
  const rollover = await getPreviousJackpot();

  return (
    <AdminDrawDetailPage 
       draw={draw} 
       eligibleCount={count} 
       rollover={rollover} 
    />
  );
}

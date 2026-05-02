// Serverside route for administrative winner registry overview
import { getWinnersByStatus } from '@/app/actions/admin/winners';
import WinnersRegistryPage from './WinnersRegistryPage';

export default async function Page({ searchParams }: { searchParams: Promise<{ status?: 'pending' | 'paid' }> }) {
  const { status } = await searchParams;
  const winners = await getWinnersByStatus(status);
  return <WinnersRegistryPage winners={winners} />;
}

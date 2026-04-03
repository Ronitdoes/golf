// Serverside route for specific winner verification and payout tracking
import { getWinnerResultById } from '@/app/actions/admin/winners';
import WinnerDetailControl from './WinnerDetailControl';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
  try {
    const result = await getWinnerResultById(params.id);
    
    if (!result) return notFound();

    return (
      <WinnerDetailControl result={result} />
    );
  } catch (_e) {
    return notFound();
  }
}

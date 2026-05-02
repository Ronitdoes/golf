// Serverside route for specific winner verification and payout tracking
import { getWinnerResultById } from '@/app/actions/admin/winners';
import WinnerDetailControl from './WinnerDetailControl';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const result = await getWinnerResultById(id);
    
    if (!result) return notFound();

    return (
      <WinnerDetailControl result={result} />
    );
  } catch (_e) {
    return notFound();
  }
}

// Serverside route for specific user management detail view
import { getUserById } from '@/app/actions/admin/users';
import AdminUserDetailPage from './AdminUserDetailPage';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { profile, scores, drawResults } = await getUserById(id);
    
    if (!profile) return notFound();

    return (
      <AdminUserDetailPage 
         user={profile} 
         scores={scores} 
         drawResults={drawResults} 
      />
    );
  } catch (_e) {
    return notFound();
  }
}

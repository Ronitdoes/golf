// Serverside route for specific user management detail view
import { getUserById } from '@/app/actions/admin/users';
import AdminUserDetailPage from './AdminUserDetailPage';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
  try {
    const { profile, scores, drawResults } = await getUserById(params.id);
    
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

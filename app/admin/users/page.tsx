// Serverside route for user management list view
import { createServerSupabaseClient } from '@/lib/supabase';
import { getAllUsers } from '@/app/actions/admin/users';
import AdminUsersPage from './AdminUsersPage';

export default async function Page({ searchParams }: { searchParams: { page?: string, query?: string, status?: string, plan?: string } }) {
  const supabase = createServerSupabaseClient();
  const { data: { user: currentUser } } = await supabase.auth.getUser();

  const page = parseInt(searchParams.page || '1');
  const { users, totalCount, totalPages } = await getAllUsers(page, {
    query: searchParams.query,
    status: searchParams.status,
    plan: searchParams.plan,
  });

  return (
    <AdminUsersPage 
       users={users} 
       totalCount={totalCount} 
       totalPages={totalPages} 
       currentPage={page} 
       currentUserId={currentUser?.id}
    />
  );
}

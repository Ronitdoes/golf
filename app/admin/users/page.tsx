// Serverside route for user management list view
import { createServerSupabaseClient } from '@/lib/supabase';
import { getAllUsers } from '@/app/actions/admin/users';
import AdminUsersPage from './AdminUsersPage';

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string, query?: string, status?: string, plan?: string }> }) {
  const supabase = await createServerSupabaseClient();
  const { data: { user: currentUser } } = await supabase.auth.getUser();

  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || '1');
  const { users, totalCount, totalPages } = await getAllUsers(page, {
    query: resolvedSearchParams.query,
    status: resolvedSearchParams.status,
    plan: resolvedSearchParams.plan,
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

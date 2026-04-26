// Administrative root layout protecting admin routes and providing consistent sidebar/shell
import { requireAdmin } from '@/lib/auth-utils';
import { redirect } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  let profile;
  try {
    const auth = await requireAdmin();
    profile = auth.profile;
  } catch (e: any) {
    if (e.message.includes('Not authenticated')) {
      return redirect('/login');
    }
    return redirect('/dashboard');
  }

  return (
    <AdminLayout adminName={profile.full_name || 'Admin User'}>
      {children}
    </AdminLayout>
  );
}

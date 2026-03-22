import { cookies } from 'next/headers';

import AdminLoginCard from '@/components/admin/AdminLoginCard';
import AdminProductManager from '@/components/admin/AdminProductManager';
import { ADMIN_SESSION_COOKIE, hasAdminSession } from '@/lib/admin-session';

export default async function AdminRootPage() {
  const cookieStore = await cookies();
  const isAuthorized = hasAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);

  return (
    <div
      className={`container mx-auto flex min-h-screen justify-center px-4 py-10 ${
        isAuthorized ? 'items-start' : 'items-center'
      }`}
    >
      {isAuthorized ? <AdminProductManager /> : <AdminLoginCard />}
    </div>
  );
}

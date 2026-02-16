import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAdminAuthenticated, getAdminSession } from '@/lib/auth';
import { SITE_NAME } from '@/lib/constants';
import { AdminLogoutButton } from './AdminLogoutButton';

export const metadata = {
  title: {
    default: 'Admin',
    template: `%s | Admin | ${SITE_NAME}`,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  const currentPath = '/admin';

  // If not authenticated and not on login page, redirect
  // Note: This is a layout, actual route protection is in each page

  return (
    <div className="min-h-screen bg-gray-50">
      {session?.isAuthenticated && (
        <header className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-8">
                <Link href="/admin" className="font-medium text-lg">
                  {SITE_NAME} Admin
                </Link>
                <nav className="hidden md:flex space-x-6">
                  <Link
                    href="/admin/products"
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    Products
                  </Link>
                  <Link
                    href="/admin/orders"
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    Orders
                  </Link>
                  <Link
                    href="/admin/delivery"
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    Delivery
                  </Link>
                  <Link
                    href="/admin/settings"
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    Settings
                  </Link>
                </nav>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  href="/"
                  target="_blank"
                  className="text-sm text-gray-600 hover:text-black"
                >
                  View Store
                </Link>
                <AdminLogoutButton />
              </div>
            </div>
          </div>
        </header>
      )}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}

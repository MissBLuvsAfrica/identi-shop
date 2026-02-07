import type { Metadata } from 'next';
import { Header, Footer, WhatsAppButton } from '@/components/layout';
import { getCartItemCount } from '@/lib/cart';
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} | ${SITE_DESCRIPTION}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: 'Shop our curated collection of luxury handbags and shoes. Premium quality, timeless designs.',
  keywords: ['luxury handbags', 'designer shoes', 'Kenya fashion', 'premium accessories'],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: '#000000',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: SITE_NAME,
  },
  formatDetection: {
    telephone: true,
    email: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cartItemCount = await getCartItemCount();
  const whatsappPhone = process.env.WHATSAPP_E164 || '254700000000';

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header cartItemCount={cartItemCount} />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton phone={whatsappPhone} />
      </body>
    </html>
  );
}

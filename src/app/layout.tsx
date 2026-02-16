import type { Metadata, Viewport } from 'next';
import { Header, Footer, WhatsAppButton } from '@/components/layout';
import { getCartItemCount } from '@/lib/cart';
import { getResolvedContact, type ResolvedContact } from '@/lib/settings';
import { CONTACT_INFO_DEFAULTS, CONTACT_LINKS } from '@/config/contact';
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants';
import './globals.css';

// Avoid calling Google Sheets at build time (prevents ERR_OSSL_UNSUPPORTED on Vercel)
export const dynamic = 'force-dynamic';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#000000',
};

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} | ${SITE_DESCRIPTION}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: 'Shop our curated collection of luxury handbags and shoes. Premium quality, timeless designs.',
  keywords: ['luxury handbags', 'designer shoes', 'Kenya fashion', 'premium accessories'],
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

const FALLBACK_CONTACT: ResolvedContact = {
  email: CONTACT_INFO_DEFAULTS.email,
  phone: CONTACT_INFO_DEFAULTS.phone,
  phoneE164: CONTACT_INFO_DEFAULTS.phoneE164,
  address: CONTACT_INFO_DEFAULTS.address,
  hours: CONTACT_INFO_DEFAULTS.hours,
  instagramUrl: CONTACT_LINKS.instagram,
  tiktokUrl: CONTACT_LINKS.tiktok,
  whatsappE164: CONTACT_INFO_DEFAULTS.phoneE164.replace(/^\+/, ''),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let cartItemCount = 0;
  let contact: ResolvedContact = FALLBACK_CONTACT;

  try {
    const [cart, resolved] = await Promise.all([
      getCartItemCount(),
      getResolvedContact(),
    ]);
    cartItemCount = cart;
    contact = resolved;
  } catch (err) {
    console.error('Layout data failed, using fallbacks:', err);
  }

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header cartItemCount={cartItemCount} />
        <main className="flex-1">{children}</main>
        <Footer contact={contact} />
        <WhatsAppButton phone={contact.whatsappE164} />
      </body>
    </html>
  );
}

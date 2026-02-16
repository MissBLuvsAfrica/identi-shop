import Link from 'next/link';
import { SITE_NAME, FOOTER_LINKS } from '@/lib/constants';
import { CONTACT_INFO_DEFAULTS, CONTACT_LINKS } from '@/config/contact';
import type { ResolvedContact } from '@/lib/settings';

interface FooterProps {
  contact?: ResolvedContact | null;
}

const DEFAULT_CONTACT: ResolvedContact = {
  email: CONTACT_INFO_DEFAULTS.email,
  phone: CONTACT_INFO_DEFAULTS.phone,
  phoneE164: CONTACT_INFO_DEFAULTS.phoneE164,
  address: CONTACT_INFO_DEFAULTS.address,
  hours: CONTACT_INFO_DEFAULTS.hours,
  instagramUrl: CONTACT_LINKS.instagram,
  tiktokUrl: CONTACT_LINKS.tiktok,
  whatsappE164: CONTACT_INFO_DEFAULTS.phoneE164.replace(/^\+/, ''),
};

export function Footer({ contact }: FooterProps) {
  const c = contact ?? DEFAULT_CONTACT;
  const mailto = `mailto:${c.email}`;
  const tel = `tel:${c.phoneE164}`;

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h2 className="text-xl sm:text-2xl font-light tracking-[0.2em] sm:tracking-[0.3em] mb-3 sm:mb-4">{SITE_NAME}</h2>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
              Elevate your style with our curated collection of luxury handbags and shoes.
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-xs sm:text-sm font-medium tracking-wide mb-3 sm:mb-4">SHOP</h3>
            <ul className="space-y-2 sm:space-y-3">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-xs sm:text-sm hover:text-white active:text-white transition-colors touch-manipulation inline-block py-1"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-xs sm:text-sm font-medium tracking-wide mb-3 sm:mb-4">SUPPORT</h3>
            <ul className="space-y-2 sm:space-y-3">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-xs sm:text-sm hover:text-white active:text-white transition-colors touch-manipulation inline-block py-1"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-xs sm:text-sm font-medium tracking-wide mb-3 sm:mb-4">CONTACT</h3>
            <ul className="space-y-2 sm:space-y-3 text-gray-400 text-xs sm:text-sm">
              <li><a href={mailto} className="hover:text-white touch-manipulation">{c.email}</a></li>
              <li><a href={tel} className="hover:text-white touch-manipulation">{c.phone}</a></li>
              <li>{c.address}</li>
            </ul>

            {/* Social Links */}
            <div className="flex space-x-2 mt-4 sm:mt-6">
              <a
                href={c.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white active:text-white transition-colors p-2 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href={c.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white active:text-white transition-colors p-2 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="TikTok"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <p className="text-gray-400 text-xs sm:text-sm">
              &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 items-center">
              {FOOTER_LINKS.legal.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-400 text-xs sm:text-sm hover:text-white active:text-white transition-colors touch-manipulation py-1"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/admin/login"
                className="text-gray-500 text-xs sm:text-sm hover:text-white transition-colors touch-manipulation py-1"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

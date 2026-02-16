/**
 * Single source of truth for site contact information.
 * Display values and E164/links for mailto, tel, and social.
 */

export const EMAIL = 'hello@identionline.com';
export const PHONE_DISPLAY = '0716610156';
export const PHONE_E164 = '+254716610156';
export const INSTAGRAM_HANDLE = 'shopidenti';
export const TIKTOK_HANDLE = 'shopidenti';

/** E164 without + for wa.me links */
export const WHATSAPP_E164_DEFAULT = '254716610156';

export const CONTACT_LINKS = {
  mailto: `mailto:${EMAIL}`,
  tel: `tel:${PHONE_E164}`,
  instagram: `https://instagram.com/${INSTAGRAM_HANDLE.replace(/^@/, '')}`,
  tiktok: `https://tiktok.com/@${TIKTOK_HANDLE.replace(/^@/, '')}`,
} as const;

/** Default contact block for footer/contact page (address/hours are static) */
export const CONTACT_INFO_DEFAULTS = {
  email: EMAIL,
  phone: PHONE_DISPLAY,
  phoneE164: PHONE_E164,
  address: 'Nairobi, Kenya',
  hours: 'Mon-Fri: 9am - 6pm EAT',
} as const;

/** Default social links (Instagram, TikTok; no twitter/facebook in spec) */
export const SOCIAL_LINKS_DEFAULTS = {
  instagram: CONTACT_LINKS.instagram,
  tiktok: CONTACT_LINKS.tiktok,
} as const;

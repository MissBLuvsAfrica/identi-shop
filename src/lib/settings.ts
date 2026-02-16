import 'server-only';
import { unstable_cache } from 'next/cache';
import { CONTACT_INFO_DEFAULTS } from '@/config/contact';
import { getSettingsRows } from '@/lib/sheets';
import { mergeSettingsWithDefaults, DEFAULTS, type SiteSettings } from '@/lib/settingsMerge';

const CACHE_TAG = 'settings';

export type { SiteSettings };

export interface ResolvedContact {
  email: string;
  phone: string;
  phoneE164: string;
  address: string;
  hours: string;
  instagramUrl: string;
  tiktokUrl: string;
  whatsappE164: string;
}

/**
 * Fetch settings from Sheets and merge with defaults.
 * Cached with revalidateTag('settings').
 */
export async function getSettings(): Promise<SiteSettings> {
  const getCached = unstable_cache(
    async () => {
      const rows = await getSettingsRows();
      return mergeSettingsWithDefaults(rows);
    },
    ['settings'],
    { revalidate: 60, tags: [CACHE_TAG] }
  );
  return getCached();
}

/**
 * Resolved contact + social for display (used by Footer, Contact page).
 */
export async function getResolvedContact(): Promise<ResolvedContact> {
  const s = await getSettings();
  const instagramHandle = (s.instagram_handle || DEFAULTS.instagram_handle).replace(/^@/, '');
  const tiktokHandle = (s.tiktok_handle || DEFAULTS.tiktok_handle).replace(/^@/, '');
  return {
    email: s.contact_email || DEFAULTS.contact_email,
    phone: s.contact_phone_display || DEFAULTS.contact_phone_display,
    phoneE164: s.contact_phone_e164 || DEFAULTS.contact_phone_e164,
    address: CONTACT_INFO_DEFAULTS.address,
    hours: CONTACT_INFO_DEFAULTS.hours,
    instagramUrl: `https://instagram.com/${instagramHandle}`,
    tiktokUrl: `https://tiktok.com/@${tiktokHandle}`,
    whatsappE164: s.whatsapp_e164 || DEFAULTS.whatsapp_e164,
  };
}

export { CACHE_TAG as SETTINGS_CACHE_TAG };

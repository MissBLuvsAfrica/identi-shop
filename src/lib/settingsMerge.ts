/**
 * Pure merge logic for settings (defaults + overrides). Testable without server/sheets.
 */
import {
  CONTACT_INFO_DEFAULTS,
  WHATSAPP_E164_DEFAULT,
} from '@/config/contact';

export interface SiteSettings {
  contact_email: string;
  contact_phone_display: string;
  contact_phone_e164: string;
  instagram_handle: string;
  tiktok_handle: string;
  whatsapp_e164: string;
  payments_enabled: boolean;
  pay_on_delivery_enabled: boolean;
  payment_provider: 'flutterwave' | 'none';
  checkout_whatsapp_template: string;
}

export const DEFAULTS: SiteSettings = {
  contact_email: CONTACT_INFO_DEFAULTS.email,
  contact_phone_display: CONTACT_INFO_DEFAULTS.phone,
  contact_phone_e164: CONTACT_INFO_DEFAULTS.phoneE164,
  instagram_handle: 'shopidenti',
  tiktok_handle: 'shopidenti',
  whatsapp_e164: WHATSAPP_E164_DEFAULT,
  payments_enabled: true,
  pay_on_delivery_enabled: true,
  payment_provider: 'flutterwave',
  checkout_whatsapp_template: '',
};

function parseValue(key: string, value: string): string | boolean {
  if (key === 'payments_enabled' || key === 'pay_on_delivery_enabled') {
    return value?.toLowerCase() === 'true';
  }
  return value;
}

/**
 * Merge rows (key/value) with defaults. Used by getSettings().
 */
export function mergeSettingsWithDefaults(
  rows: Array<{ key: string; value: string }>
): SiteSettings {
  const overrides: Partial<SiteSettings> = {};
  for (const row of rows) {
    if (!row.key) continue;
    const k = row.key as keyof SiteSettings;
    if (k in DEFAULTS) {
      const v = parseValue(row.key, row.value);
      (overrides as Record<string, unknown>)[k] = typeof v === 'boolean' ? v : row.value;
    }
  }
  return { ...DEFAULTS, ...overrides };
}

import { describe, it, expect } from 'vitest';
import { mergeSettingsWithDefaults, DEFAULTS } from '../settingsMerge';

describe('settingsMerge', () => {
  it('returns defaults when rows are empty', () => {
    const result = mergeSettingsWithDefaults([]);
    expect(result.contact_email).toBe(DEFAULTS.contact_email);
    expect(result.payments_enabled).toBe(true);
    expect(result.payment_provider).toBe('flutterwave');
  });

  it('overrides contact_email from rows', () => {
    const result = mergeSettingsWithDefaults([
      { key: 'contact_email', value: 'custom@example.com' },
    ]);
    expect(result.contact_email).toBe('custom@example.com');
    expect(result.contact_phone_display).toBe(DEFAULTS.contact_phone_display);
  });

  it('parses payments_enabled and pay_on_delivery_enabled as boolean', () => {
    const result = mergeSettingsWithDefaults([
      { key: 'payments_enabled', value: 'false' },
      { key: 'pay_on_delivery_enabled', value: 'true' },
    ]);
    expect(result.payments_enabled).toBe(false);
    expect(result.pay_on_delivery_enabled).toBe(true);
  });

  it('merges multiple overrides with defaults', () => {
    const result = mergeSettingsWithDefaults([
      { key: 'instagram_handle', value: 'mybrand' },
      { key: 'payment_provider', value: 'none' },
    ]);
    expect(result.instagram_handle).toBe('mybrand');
    expect(result.payment_provider).toBe('none');
    expect(result.contact_email).toBe(DEFAULTS.contact_email);
  });

  it('ignores unknown keys', () => {
    const result = mergeSettingsWithDefaults([
      { key: 'unknown_key', value: 'x' },
    ]);
    expect(result).toEqual(DEFAULTS);
  });
});

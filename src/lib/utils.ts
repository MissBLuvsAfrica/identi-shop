import { CURRENCY_SYMBOL } from './constants';

/**
 * Format price in KES
 */
export function formatPrice(amount: number): string {
  return `${CURRENCY_SYMBOL} ${amount.toLocaleString('en-KE')}`;
}

/**
 * Generate a human-readable order number
 * Format: IDENTI-YYYYMMDD-XXXX
 */
export function generateOrderNumber(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `IDENTI-${dateStr}-${random}`;
}

/**
 * Calculate cart subtotal
 */
export function calculateSubtotal(
  items: Array<{ qty: number; unitPriceKes: number }>
): number {
  return items.reduce((sum, item) => sum + item.qty * item.unitPriceKes, 0);
}

/**
 * Calculate total with delivery fee
 */
export function calculateTotal(subtotal: number, deliveryFee: number): number {
  return subtotal + deliveryFee;
}

/**
 * Validate Kenyan phone number
 */
export function isValidKenyanPhone(phone: string): boolean {
  // Remove spaces and dashes
  const cleaned = phone.replace(/[\s-]/g, '');
  
  // Check for valid formats: 07XXXXXXXX, 254XXXXXXXXX, +254XXXXXXXXX
  const regex = /^(?:\+?254|0)[17]\d{8}$/;
  return regex.test(cleaned);
}

/**
 * Format phone to E164 format for Kenya
 */
export function formatPhoneE164(phone: string): string {
  const cleaned = phone.replace(/[\s-]/g, '');
  
  if (cleaned.startsWith('+254')) {
    return cleaned;
  }
  
  if (cleaned.startsWith('254')) {
    return `+${cleaned}`;
  }
  
  if (cleaned.startsWith('0')) {
    return `+254${cleaned.slice(1)}`;
  }
  
  return `+254${cleaned}`;
}

/**
 * Generate WhatsApp link with prefilled message
 */
export function generateWhatsAppLink(
  phone: string,
  message: string
): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Get stock status label
 */
export function getStockStatus(stock: number, threshold: number = 2): {
  label: string;
  color: string;
} {
  if (stock === 0) {
    return { label: 'Out of Stock', color: 'text-red-600' };
  }
  
  if (stock <= threshold) {
    return { label: `Only ${stock} left`, color: 'text-orange-600' };
  }
  
  return { label: 'In Stock', color: 'text-green-600' };
}

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Slugify text for URLs
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Parse comma-separated string to array
 */
export function parseCommaSeparated(value: string): string[] {
  if (!value) return [];
  return value.split(',').map((s) => s.trim()).filter(Boolean);
}

/**
 * Join array to comma-separated string
 */
export function toCommaSeparated(values: string[]): string {
  return values.join(', ');
}

/**
 * Delay/sleep utility for async operations
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if running on server
 */
export function isServer(): boolean {
  return typeof window === 'undefined';
}

/**
 * Safe JSON parse
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format date with time
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

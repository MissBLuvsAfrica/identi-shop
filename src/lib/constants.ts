// Site Configuration
export const SITE_NAME = 'IDENTI';
export const SITE_DESCRIPTION = 'Luxury Handbags & Shoes';
export const SITE_TAGLINE = 'Elevate Your Style';

// Currency
export const CURRENCY = 'KES';
export const CURRENCY_SYMBOL = 'KES';

// Product Categories
export const CATEGORIES = [
  { key: 'handbags', label: 'Handbags', description: 'Luxury handbags for every occasion' },
  { key: 'shoes', label: 'Shoes', description: 'Premium footwear collection' },
] as const;

// Order Status Labels
export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: 'Pending Payment',
  PAID: 'Paid',
  PAY_ON_DELIVERY: 'Pay on Delivery',
  PROCESSING: 'Processing',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

// Order Status Colors (Tailwind classes)
export const ORDER_STATUS_COLORS: Record<string, string> = {
  PENDING_PAYMENT: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-green-100 text-green-800',
  PAY_ON_DELIVERY: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

// Payment Methods
export const PAYMENT_METHODS = [
  { key: 'CARD', label: 'Card Payment', description: 'Pay with Visa, Mastercard' },
  { key: 'MPESA', label: 'M-Pesa', description: 'Pay with M-Pesa mobile money' },
  { key: 'AIRTEL', label: 'Airtel Money', description: 'Pay with Airtel Money' },
  { key: 'POD', label: 'Pay on Delivery', description: 'Pay when you receive your order' },
] as const;

// Returns Policy
export const RETURNS_POLICY = {
  title: 'Returns & Exchanges',
  summary: 'No returns. Exchanges allowed within 24 hours.',
  details: [
    'We do not accept returns on any items.',
    'Exchanges are allowed within 24 hours of delivery.',
    'Items must be in original condition with tags attached.',
    'Contact us via WhatsApp to initiate an exchange.',
  ],
};

// Contact Information (from config/contact.ts)
import {
  CONTACT_INFO_DEFAULTS,
  SOCIAL_LINKS_DEFAULTS,
  CONTACT_LINKS,
} from '@/config/contact';

export const CONTACT_INFO = {
  email: CONTACT_INFO_DEFAULTS.email,
  phone: CONTACT_INFO_DEFAULTS.phone,
  phoneE164: CONTACT_INFO_DEFAULTS.phoneE164,
  address: CONTACT_INFO_DEFAULTS.address,
  hours: CONTACT_INFO_DEFAULTS.hours,
};

export { CONTACT_LINKS };

// Social Links (Instagram, TikTok)
export const SOCIAL_LINKS = {
  instagram: SOCIAL_LINKS_DEFAULTS.instagram,
  tiktok: SOCIAL_LINKS_DEFAULTS.tiktok,
};

// Navigation Links
export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export const FOOTER_LINKS = {
  shop: [
    { href: '/shop?category=handbags', label: 'Handbags' },
    { href: '/shop?category=shoes', label: 'Shoes' },
  ],
  support: [
    { href: '/faqs', label: 'FAQs' },
    { href: '/returns', label: 'Returns & Exchanges' },
    { href: '/contact', label: 'Contact Us' },
  ],
  legal: [
    { href: '/terms', label: 'Terms of Service' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/cookies', label: 'Cookie Policy' },
  ],
};

// Cart Settings
export const MAX_CART_ITEM_QTY = 10;

// Low Stock Threshold
export const DEFAULT_LOW_STOCK_THRESHOLD = 2;

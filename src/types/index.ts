// Product Types
export type ProductCategory = 'handbags' | 'shoes';

export interface Product {
  id: string;
  sku: string;
  category: ProductCategory;
  name: string;
  description: string;
  priceKes: number;
  images: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Variant {
  id: string;
  productId: string;
  size: string;
  color: string;
  stock: number;
  lowStockThreshold: number;
  isActive: boolean;
  updatedAt: string;
}

export interface ProductWithVariants extends Product {
  variants: Variant[];
}

// Delivery Types
export interface DeliveryLocation {
  locationKey: string;
  label: string;
  feeKes: number;
  etaDays: string;
}

// Order Types
export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PAID'
  | 'PAY_ON_DELIVERY'
  | 'PROCESSING'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentMethod = 'CARD' | 'MPESA' | 'AIRTEL' | 'POD';
export type PaymentProvider = 'FLUTTERWAVE' | 'NONE';

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryLocationKey: string;
  deliveryAddress: string;
  deliveryFeeKes: number;
  subtotalKes: number;
  totalKes: number;
  paymentMethod: PaymentMethod;
  paymentProvider: PaymentProvider;
  paymentRef: string;
  notes: string;
  whatsappPrefill: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId: string;
  sku: string;
  name: string;
  size: string;
  color: string;
  qty: number;
  unitPriceKes: number;
  lineTotalKes: number;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

// Cart Types
export interface CartItem {
  productId: string;
  variantId: string;
  sku: string;
  name: string;
  size: string;
  color: string;
  qty: number;
  unitPriceKes: number;
  image: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
}

// Checkout Types
export interface CheckoutData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryLocationKey: string;
  deliveryAddress: string;
  paymentMethod: PaymentMethod;
  notes?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Admin Types
export interface AdminSession {
  isAuthenticated: boolean;
  username: string;
}

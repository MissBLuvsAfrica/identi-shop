import { z } from 'zod';

// Product Schemas
export const productCategorySchema = z.enum(['handbags', 'shoes']);

export const productSchema = z.object({
  id: z.string().uuid(),
  sku: z.string().min(1, 'SKU is required'),
  category: productCategorySchema,
  name: z.string().min(1, 'Name is required'),
  description: z.string(),
  priceKes: z.number().positive('Price must be positive'),
  images: z.array(z.string().url()),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const createProductSchema = productSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateProductSchema = createProductSchema.partial();

// Variant Schemas
export const variantSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  size: z.string(),
  color: z.string().min(1, 'Color is required'),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  lowStockThreshold: z.number().int().min(0).default(2),
  isActive: z.boolean(),
  updatedAt: z.string().datetime(),
});

export const createVariantSchema = variantSchema.omit({
  id: true,
  updatedAt: true,
});

export const updateVariantSchema = createVariantSchema.partial();

// Delivery Schemas
export const deliveryLocationSchema = z.object({
  locationKey: z.string().min(1),
  label: z.string().min(1),
  feeKes: z.number().min(0),
  etaDays: z.string(),
});

// Order Schemas
export const orderStatusSchema = z.enum([
  'PENDING_PAYMENT',
  'PAID',
  'PAY_ON_DELIVERY',
  'PROCESSING',
  'DELIVERED',
  'CANCELLED',
]);

export const paymentMethodSchema = z.enum(['CARD', 'MPESA', 'AIRTEL', 'POD']);
export const paymentProviderSchema = z.enum(['FLUTTERWAVE', 'NONE']);

export const orderSchema = z.object({
  id: z.string().uuid(),
  orderNumber: z.string(),
  createdAt: z.string().datetime(),
  status: orderStatusSchema,
  customerName: z.string().min(1, 'Name is required'),
  customerEmail: z.string().email('Invalid email'),
  customerPhone: z.string().min(10, 'Phone number is required'),
  deliveryLocationKey: z.string().min(1),
  deliveryAddress: z.string().min(1, 'Address is required'),
  deliveryFeeKes: z.number().min(0),
  subtotalKes: z.number().min(0),
  totalKes: z.number().min(0),
  paymentMethod: paymentMethodSchema,
  paymentProvider: paymentProviderSchema,
  paymentRef: z.string(),
  notes: z.string(),
  whatsappPrefill: z.string(),
});

export const orderItemSchema = z.object({
  id: z.string().uuid(),
  orderId: z.string().uuid(),
  productId: z.string().uuid(),
  variantId: z.string().uuid(),
  sku: z.string(),
  name: z.string(),
  size: z.string(),
  color: z.string(),
  qty: z.number().int().positive(),
  unitPriceKes: z.number().min(0),
  lineTotalKes: z.number().min(0),
});

// Cart Schemas
export const cartItemSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid(),
  sku: z.string(),
  name: z.string(),
  size: z.string(),
  color: z.string(),
  qty: z.number().int().positive(),
  unitPriceKes: z.number().min(0),
  image: z.string(),
});

export const cartSchema = z.object({
  items: z.array(cartItemSchema),
  subtotal: z.number().min(0),
});

// Checkout Schemas
export const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerEmail: z.string().email('Please enter a valid email'),
  customerPhone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^[+]?[0-9]+$/, 'Invalid phone number format'),
  deliveryLocationKey: z.string().min(1, 'Please select a delivery location'),
  deliveryAddress: z.string().min(5, 'Please enter your full address'),
  paymentMethod: paymentMethodSchema,
  notes: z.string().optional(),
});

// Admin Schemas
export const adminLoginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export const updateOrderStatusSchema = z.object({
  orderId: z.string().uuid(),
  status: orderStatusSchema,
  paymentRef: z.string().optional(),
});

// Add to Cart Schema
export const addToCartSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid(),
  qty: z.number().int().positive().default(1),
});

export const updateCartItemSchema = z.object({
  variantId: z.string().uuid(),
  qty: z.number().int().min(0),
});

// Type exports
export type ProductCategory = z.infer<typeof productCategorySchema>;
export type Product = z.infer<typeof productSchema>;
export type CreateProduct = z.infer<typeof createProductSchema>;
export type UpdateProduct = z.infer<typeof updateProductSchema>;
export type Variant = z.infer<typeof variantSchema>;
export type CreateVariant = z.infer<typeof createVariantSchema>;
export type UpdateVariant = z.infer<typeof updateVariantSchema>;
export type DeliveryLocation = z.infer<typeof deliveryLocationSchema>;
export type OrderStatus = z.infer<typeof orderStatusSchema>;
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
export type PaymentProvider = z.infer<typeof paymentProviderSchema>;
export type Order = z.infer<typeof orderSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type Cart = z.infer<typeof cartSchema>;
export type CheckoutData = z.infer<typeof checkoutSchema>;
export type AdminLogin = z.infer<typeof adminLoginSchema>;
export type UpdateOrderStatus = z.infer<typeof updateOrderStatusSchema>;
export type AddToCart = z.infer<typeof addToCartSchema>;
export type UpdateCartItem = z.infer<typeof updateCartItemSchema>;

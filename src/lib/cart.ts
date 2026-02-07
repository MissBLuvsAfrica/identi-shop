import 'server-only';
import { cookies } from 'next/headers';
import type { Cart, CartItem } from '@/types';
import { safeJsonParse } from './utils';

const CART_COOKIE_NAME = 'identi_cart';
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * Get cart from cookies
 */
export async function getCart(): Promise<Cart> {
  const cookieStore = await cookies();
  const cartCookie = cookieStore.get(CART_COOKIE_NAME);

  if (!cartCookie?.value) {
    return { items: [], subtotal: 0 };
  }

  const cart = safeJsonParse<Cart>(cartCookie.value, { items: [], subtotal: 0 });
  return cart;
}

/**
 * Save cart to cookies
 */
export async function saveCart(cart: Cart): Promise<void> {
  const cookieStore = await cookies();

  // Calculate subtotal
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.qty * item.unitPriceKes,
    0
  );

  const cartWithSubtotal: Cart = {
    ...cart,
    subtotal,
  };

  cookieStore.set(CART_COOKIE_NAME, JSON.stringify(cartWithSubtotal), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: CART_COOKIE_MAX_AGE,
    path: '/',
  });
}

/**
 * Add item to cart
 */
export async function addToCart(item: CartItem): Promise<Cart> {
  const cart = await getCart();

  // Check if item already exists in cart
  const existingIndex = cart.items.findIndex(
    (i) => i.variantId === item.variantId
  );

  if (existingIndex >= 0) {
    // Update quantity
    cart.items[existingIndex].qty += item.qty;
  } else {
    // Add new item
    cart.items.push(item);
  }

  await saveCart(cart);
  return cart;
}

/**
 * Update item quantity in cart
 */
export async function updateCartItemQty(
  variantId: string,
  qty: number
): Promise<Cart> {
  const cart = await getCart();

  if (qty <= 0) {
    // Remove item if qty is 0 or less
    cart.items = cart.items.filter((i) => i.variantId !== variantId);
  } else {
    // Update quantity
    const item = cart.items.find((i) => i.variantId === variantId);
    if (item) {
      item.qty = qty;
    }
  }

  await saveCart(cart);
  return cart;
}

/**
 * Remove item from cart
 */
export async function removeFromCart(variantId: string): Promise<Cart> {
  const cart = await getCart();
  cart.items = cart.items.filter((i) => i.variantId !== variantId);
  await saveCart(cart);
  return cart;
}

/**
 * Clear cart
 */
export async function clearCart(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(CART_COOKIE_NAME);
}

/**
 * Get cart item count
 */
export async function getCartItemCount(): Promise<number> {
  const cart = await getCart();
  return cart.items.reduce((sum, item) => sum + item.qty, 0);
}

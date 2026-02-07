'use server';

import { revalidatePath } from 'next/cache';
import {
  getCart,
  addToCart as addToCartLib,
  updateCartItemQty as updateCartItemQtyLib,
  removeFromCart as removeFromCartLib,
  clearCart as clearCartLib,
} from '@/lib/cart';
import { getProductById, checkStockAvailability } from '@/lib/sheets';
import { addToCartSchema, updateCartItemSchema } from '@/lib/schemas';
import type { Cart, CartItem, ApiResponse } from '@/types';
import { MAX_CART_ITEM_QTY } from '@/lib/constants';

export async function getCartAction(): Promise<Cart> {
  return getCart();
}

export async function addToCartAction(
  data: unknown
): Promise<ApiResponse<Cart>> {
  try {
    // Validate input
    const validated = addToCartSchema.parse(data);

    // Get product and variant details
    const product = await getProductById(validated.productId);
    if (!product) {
      return { success: false, error: 'Product not found' };
    }

    const variant = product.variants.find((v) => v.id === validated.variantId);
    if (!variant) {
      return { success: false, error: 'Variant not found' };
    }

    // Check stock
    const { available, currentStock } = await checkStockAvailability(
      validated.variantId,
      validated.qty
    );

    if (!available) {
      return {
        success: false,
        error: currentStock === 0
          ? 'This item is out of stock'
          : `Only ${currentStock} items available`,
      };
    }

    // Get current cart to check total quantity
    const currentCart = await getCart();
    const existingItem = currentCart.items.find(
      (i) => i.variantId === validated.variantId
    );
    const newTotalQty = (existingItem?.qty || 0) + validated.qty;

    // Check max quantity limit
    if (newTotalQty > MAX_CART_ITEM_QTY) {
      return {
        success: false,
        error: `Maximum ${MAX_CART_ITEM_QTY} items allowed per product`,
      };
    }

    // Check if new total would exceed stock
    if (newTotalQty > currentStock) {
      return {
        success: false,
        error: `Only ${currentStock} items available`,
      };
    }

    // Create cart item
    const cartItem: CartItem = {
      productId: product.id,
      variantId: variant.id,
      sku: product.sku,
      name: product.name,
      size: variant.size,
      color: variant.color,
      qty: validated.qty,
      unitPriceKes: product.priceKes,
      image: product.images[0] || '',
    };

    // Add to cart
    const cart = await addToCartLib(cartItem);

    revalidatePath('/cart');
    return { success: true, data: cart };
  } catch (error) {
    console.error('addToCartAction error:', error);
    return { success: false, error: 'Failed to add item to cart' };
  }
}

export async function updateCartItemAction(
  data: unknown
): Promise<ApiResponse<Cart>> {
  try {
    // Validate input
    const validated = updateCartItemSchema.parse(data);

    // If quantity is 0, remove item
    if (validated.qty === 0) {
      const cart = await removeFromCartLib(validated.variantId);
      revalidatePath('/cart');
      return { success: true, data: cart };
    }

    // Check max quantity
    if (validated.qty > MAX_CART_ITEM_QTY) {
      return {
        success: false,
        error: `Maximum ${MAX_CART_ITEM_QTY} items allowed`,
      };
    }

    // Check stock availability
    const { available, currentStock } = await checkStockAvailability(
      validated.variantId,
      validated.qty
    );

    if (!available) {
      return {
        success: false,
        error: currentStock === 0
          ? 'This item is out of stock'
          : `Only ${currentStock} items available`,
      };
    }

    // Update cart
    const cart = await updateCartItemQtyLib(validated.variantId, validated.qty);

    revalidatePath('/cart');
    return { success: true, data: cart };
  } catch (error) {
    console.error('updateCartItemAction error:', error);
    return { success: false, error: 'Failed to update cart' };
  }
}

export async function removeFromCartAction(
  variantId: string
): Promise<ApiResponse<Cart>> {
  try {
    const cart = await removeFromCartLib(variantId);
    revalidatePath('/cart');
    return { success: true, data: cart };
  } catch (error) {
    console.error('removeFromCartAction error:', error);
    return { success: false, error: 'Failed to remove item' };
  }
}

export async function clearCartAction(): Promise<ApiResponse<null>> {
  try {
    await clearCartLib();
    revalidatePath('/cart');
    return { success: true, data: null };
  } catch (error) {
    console.error('clearCartAction error:', error);
    return { success: false, error: 'Failed to clear cart' };
  }
}

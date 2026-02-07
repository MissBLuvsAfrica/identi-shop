import { describe, it, expect } from 'vitest';
import {
  checkoutSchema,
  addToCartSchema,
  updateCartItemSchema,
  adminLoginSchema,
} from '../schemas';

describe('checkoutSchema', () => {
  it('should validate correct checkout data', () => {
    const data = {
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerPhone: '0712345678',
      deliveryLocationKey: 'NAIROBI_CBD',
      deliveryAddress: '123 Main Street, Nairobi',
      paymentMethod: 'POD' as const,
    };

    const result = checkoutSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const data = {
      customerName: 'John Doe',
      customerEmail: 'invalid',
      customerPhone: '0712345678',
      deliveryLocationKey: 'NAIROBI_CBD',
      deliveryAddress: '123 Main Street, Nairobi',
      paymentMethod: 'POD' as const,
    };

    const result = checkoutSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('should reject short name', () => {
    const data = {
      customerName: 'J',
      customerEmail: 'john@example.com',
      customerPhone: '0712345678',
      deliveryLocationKey: 'NAIROBI_CBD',
      deliveryAddress: '123 Main Street',
      paymentMethod: 'POD' as const,
    };

    const result = checkoutSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('should validate all payment methods', () => {
    const methods = ['CARD', 'MPESA', 'AIRTEL', 'POD'] as const;

    methods.forEach((paymentMethod) => {
      const data = {
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerPhone: '0712345678',
        deliveryLocationKey: 'NAIROBI_CBD',
        deliveryAddress: '123 Main Street, Nairobi',
        paymentMethod,
      };

      const result = checkoutSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });
});

describe('addToCartSchema', () => {
  it('should validate correct add to cart data', () => {
    const data = {
      productId: '550e8400-e29b-41d4-a716-446655440000',
      variantId: '550e8400-e29b-41d4-a716-446655440001',
      qty: 1,
    };

    const result = addToCartSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('should reject invalid UUID', () => {
    const data = {
      productId: 'invalid',
      variantId: '550e8400-e29b-41d4-a716-446655440001',
      qty: 1,
    };

    const result = addToCartSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('should reject zero quantity', () => {
    const data = {
      productId: '550e8400-e29b-41d4-a716-446655440000',
      variantId: '550e8400-e29b-41d4-a716-446655440001',
      qty: 0,
    };

    const result = addToCartSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('should reject negative quantity', () => {
    const data = {
      productId: '550e8400-e29b-41d4-a716-446655440000',
      variantId: '550e8400-e29b-41d4-a716-446655440001',
      qty: -1,
    };

    const result = addToCartSchema.safeParse(data);
    expect(result.success).toBe(false);
  });
});

describe('updateCartItemSchema', () => {
  it('should validate correct update data', () => {
    const data = {
      variantId: '550e8400-e29b-41d4-a716-446655440000',
      qty: 5,
    };

    const result = updateCartItemSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('should allow zero quantity (for removal)', () => {
    const data = {
      variantId: '550e8400-e29b-41d4-a716-446655440000',
      qty: 0,
    };

    const result = updateCartItemSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('should reject negative quantity', () => {
    const data = {
      variantId: '550e8400-e29b-41d4-a716-446655440000',
      qty: -5,
    };

    const result = updateCartItemSchema.safeParse(data);
    expect(result.success).toBe(false);
  });
});

describe('adminLoginSchema', () => {
  it('should validate correct login data', () => {
    const data = {
      username: 'admin',
      password: 'password123',
    };

    const result = adminLoginSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('should reject empty username', () => {
    const data = {
      username: '',
      password: 'password123',
    };

    const result = adminLoginSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('should reject empty password', () => {
    const data = {
      username: 'admin',
      password: '',
    };

    const result = adminLoginSchema.safeParse(data);
    expect(result.success).toBe(false);
  });
});

import { describe, it, expect } from 'vitest';
import {
  formatPrice,
  generateOrderNumber,
  calculateSubtotal,
  calculateTotal,
  isValidKenyanPhone,
  formatPhoneE164,
  getStockStatus,
  isValidEmail,
} from '../utils';

describe('formatPrice', () => {
  it('should format price in KES', () => {
    expect(formatPrice(1000)).toBe('KES 1,000');
    expect(formatPrice(5000)).toBe('KES 5,000');
    expect(formatPrice(15000)).toBe('KES 15,000');
  });

  it('should handle zero', () => {
    expect(formatPrice(0)).toBe('KES 0');
  });

  it('should handle large numbers', () => {
    expect(formatPrice(1000000)).toBe('KES 1,000,000');
  });
});

describe('generateOrderNumber', () => {
  it('should generate order number in correct format', () => {
    const orderNumber = generateOrderNumber();
    expect(orderNumber).toMatch(/^IDENTI-\d{8}-[A-Z0-9]{4}$/);
  });

  it('should generate unique order numbers', () => {
    const orderNumbers = new Set();
    for (let i = 0; i < 100; i++) {
      orderNumbers.add(generateOrderNumber());
    }
    expect(orderNumbers.size).toBe(100);
  });
});

describe('calculateSubtotal', () => {
  it('should calculate subtotal correctly', () => {
    const items = [
      { qty: 2, unitPriceKes: 1000 },
      { qty: 1, unitPriceKes: 5000 },
    ];
    expect(calculateSubtotal(items)).toBe(7000);
  });

  it('should return 0 for empty cart', () => {
    expect(calculateSubtotal([])).toBe(0);
  });

  it('should handle single item', () => {
    const items = [{ qty: 3, unitPriceKes: 1500 }];
    expect(calculateSubtotal(items)).toBe(4500);
  });
});

describe('calculateTotal', () => {
  it('should add delivery fee to subtotal', () => {
    expect(calculateTotal(5000, 300)).toBe(5300);
  });

  it('should handle zero delivery fee', () => {
    expect(calculateTotal(5000, 0)).toBe(5000);
  });
});

describe('isValidKenyanPhone', () => {
  it('should validate 07XX format', () => {
    expect(isValidKenyanPhone('0712345678')).toBe(true);
    expect(isValidKenyanPhone('0798765432')).toBe(true);
  });

  it('should validate 01XX format', () => {
    expect(isValidKenyanPhone('0112345678')).toBe(true);
  });

  it('should validate +254 format', () => {
    expect(isValidKenyanPhone('+254712345678')).toBe(true);
  });

  it('should validate 254 format without +', () => {
    expect(isValidKenyanPhone('254712345678')).toBe(true);
  });

  it('should reject invalid numbers', () => {
    expect(isValidKenyanPhone('1234567')).toBe(false);
    expect(isValidKenyanPhone('0812345678')).toBe(false);
  });
});

describe('formatPhoneE164', () => {
  it('should convert 07XX to E164', () => {
    expect(formatPhoneE164('0712345678')).toBe('+254712345678');
  });

  it('should handle already formatted E164', () => {
    expect(formatPhoneE164('+254712345678')).toBe('+254712345678');
  });

  it('should handle 254 without +', () => {
    expect(formatPhoneE164('254712345678')).toBe('+254712345678');
  });
});

describe('getStockStatus', () => {
  it('should return out of stock for 0', () => {
    const result = getStockStatus(0);
    expect(result.label).toBe('Out of Stock');
    expect(result.color).toContain('red');
  });

  it('should return low stock warning', () => {
    const result = getStockStatus(2, 2);
    expect(result.label).toBe('Only 2 left');
    expect(result.color).toContain('orange');
  });

  it('should return in stock for adequate quantity', () => {
    const result = getStockStatus(10);
    expect(result.label).toBe('In Stock');
    expect(result.color).toContain('green');
  });

  it('should respect custom threshold', () => {
    const result = getStockStatus(5, 5);
    expect(result.label).toBe('Only 5 left');
  });
});

describe('isValidEmail', () => {
  it('should validate correct emails', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user.name@domain.co.ke')).toBe(true);
  });

  it('should reject invalid emails', () => {
    expect(isValidEmail('invalid')).toBe(false);
    expect(isValidEmail('test@')).toBe(false);
    expect(isValidEmail('@domain.com')).toBe(false);
  });
});

'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import {
  verifyAdminCredentials,
  createAdminSession,
  destroyAdminSession,
  isAdminAuthenticated,
} from '@/lib/auth';
import {
  upsertProduct,
  upsertVariant,
  updateOrderStatus as updateOrderStatusLib,
  getOrderById,
  decrementStock,
} from '@/lib/sheets';
import { sendPaymentConfirmedEmail, sendOrderDeliveredEmail } from '@/lib/email';
import {
  adminLoginSchema,
  createProductSchema,
  createVariantSchema,
  updateOrderStatusSchema,
} from '@/lib/schemas';
import type { ApiResponse, Product, Variant, OrderStatus } from '@/types';

// Logging helper
function logAdmin(operation: string, details?: Record<string, unknown>) {
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      service: 'admin',
      operation,
      ...details,
    })
  );
}

// Auth check helper
async function requireAuth(): Promise<void> {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    redirect('/admin/login');
  }
}

// Login/Logout actions
export async function adminLoginAction(
  formData: FormData
): Promise<ApiResponse<null>> {
  try {
    const data = {
      username: formData.get('username') as string,
      password: formData.get('password') as string,
    };

    const validated = adminLoginSchema.parse(data);

    const isValid = await verifyAdminCredentials(validated.username, validated.password);

    if (!isValid) {
      logAdmin('login:failed', { username: validated.username });
      return { success: false, error: 'Invalid credentials' };
    }

    await createAdminSession(validated.username);
    logAdmin('login:success', { username: validated.username });

    return { success: true, data: null };
  } catch (error) {
    logAdmin('login:error', { error: String(error) });
    return { success: false, error: 'Login failed' };
  }
}

export async function adminLogoutAction(): Promise<void> {
  await destroyAdminSession();
  logAdmin('logout');
  redirect('/admin/login');
}

// Product actions
export async function createProductAction(
  formData: FormData
): Promise<ApiResponse<Product>> {
  await requireAuth();

  try {
    const imagesString = formData.get('images') as string;
    const images = imagesString
      ? imagesString.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const data = {
      sku: formData.get('sku') as string,
      category: formData.get('category') as 'handbags' | 'shoes',
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      priceKes: parseFloat(formData.get('priceKes') as string) || 0,
      images,
      isActive: formData.get('isActive') === 'true',
    };

    const validated = createProductSchema.parse(data);

    const product = await upsertProduct(validated);
    logAdmin('createProduct', { productId: product.id, sku: product.sku });

    revalidatePath('/admin/products');
    revalidatePath('/shop');

    return { success: true, data: product };
  } catch (error) {
    logAdmin('createProduct:error', { error: String(error) });
    return { success: false, error: 'Failed to create product' };
  }
}

export async function updateProductAction(
  productId: string,
  formData: FormData
): Promise<ApiResponse<Product>> {
  await requireAuth();

  try {
    const imagesString = formData.get('images') as string;
    const images = imagesString
      ? imagesString.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const data = {
      id: productId,
      sku: formData.get('sku') as string,
      category: formData.get('category') as 'handbags' | 'shoes',
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      priceKes: parseFloat(formData.get('priceKes') as string) || 0,
      images,
      isActive: formData.get('isActive') === 'true',
    };

    const product = await upsertProduct(data);
    logAdmin('updateProduct', { productId: product.id });

    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/${productId}`);
    revalidatePath('/shop');
    revalidatePath(`/product/${productId}`);

    return { success: true, data: product };
  } catch (error) {
    logAdmin('updateProduct:error', { error: String(error), productId });
    return { success: false, error: 'Failed to update product' };
  }
}

// Variant actions
export async function createVariantAction(
  formData: FormData
): Promise<ApiResponse<Variant>> {
  await requireAuth();

  try {
    const data = {
      productId: formData.get('productId') as string,
      size: formData.get('size') as string || '',
      color: formData.get('color') as string,
      stock: parseInt(formData.get('stock') as string) || 0,
      lowStockThreshold: parseInt(formData.get('lowStockThreshold') as string) || 2,
      isActive: formData.get('isActive') === 'true',
    };

    const validated = createVariantSchema.parse(data);

    const variant = await upsertVariant(validated);
    logAdmin('createVariant', { variantId: variant.id, productId: variant.productId });

    revalidatePath(`/admin/products/${data.productId}`);
    revalidatePath('/shop');

    return { success: true, data: variant };
  } catch (error) {
    logAdmin('createVariant:error', { error: String(error) });
    return { success: false, error: 'Failed to create variant' };
  }
}

export async function updateVariantAction(
  variantId: string,
  formData: FormData
): Promise<ApiResponse<Variant>> {
  await requireAuth();

  try {
    const stock = parseInt(formData.get('stock') as string);

    if (stock < 0) {
      return { success: false, error: 'Stock cannot be negative' };
    }

    const data = {
      id: variantId,
      productId: formData.get('productId') as string,
      size: formData.get('size') as string || '',
      color: formData.get('color') as string,
      stock,
      lowStockThreshold: parseInt(formData.get('lowStockThreshold') as string) || 2,
      isActive: formData.get('isActive') === 'true',
    };

    const variant = await upsertVariant(data);
    logAdmin('updateVariant', { variantId: variant.id });

    revalidatePath(`/admin/products/${data.productId}`);
    revalidatePath('/shop');

    return { success: true, data: variant };
  } catch (error) {
    logAdmin('updateVariant:error', { error: String(error), variantId });
    return { success: false, error: 'Failed to update variant' };
  }
}

// Order actions
export async function updateOrderStatusAction(
  formData: FormData
): Promise<ApiResponse<null>> {
  await requireAuth();

  try {
    const data = {
      orderId: formData.get('orderId') as string,
      status: formData.get('status') as OrderStatus,
      paymentRef: formData.get('paymentRef') as string | undefined,
    };

    const validated = updateOrderStatusSchema.parse(data);

    // Get current order
    const order = await getOrderById(validated.orderId);
    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    const previousStatus = order.status;

    // Update status
    const success = await updateOrderStatusLib(
      validated.orderId,
      validated.status,
      validated.paymentRef
    );

    if (!success) {
      return { success: false, error: 'Failed to update order status' };
    }

    logAdmin('updateOrderStatus', {
      orderId: validated.orderId,
      previousStatus,
      newStatus: validated.status,
    });

    // Send appropriate email based on status change
    if (validated.status === 'PAID' && previousStatus !== 'PAID') {
      // Decrement stock if transitioning to PAID
      for (const item of order.items) {
        await decrementStock(item.variantId, item.qty);
      }
      await sendPaymentConfirmedEmail({ ...order, status: validated.status });
    } else if (validated.status === 'DELIVERED' && previousStatus !== 'DELIVERED') {
      await sendOrderDeliveredEmail({ ...order, status: validated.status });
    }

    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/${validated.orderId}`);

    return { success: true, data: null };
  } catch (error) {
    logAdmin('updateOrderStatus:error', { error: String(error) });
    return { success: false, error: 'Failed to update order status' };
  }
}

import 'server-only';
import { google, sheets_v4 } from 'googleapis';
import { v4 as uuidv4 } from 'uuid';
import type {
  Product,
  ProductWithVariants,
  Variant,
  DeliveryLocation,
  Order,
  OrderItem,
  OrderWithItems,
  OrderStatus,
} from '@/types';
import { generateOrderNumber } from './utils';

// Sheet Names
const SHEETS = {
  PRODUCTS: 'products',
  VARIANTS: 'variants',
  DELIVERY_FEES: 'delivery_fees',
  ORDERS: 'orders',
  ORDER_ITEMS: 'order_items',
  SETTINGS: 'settings',
} as const;

export type SettingRow = { key: string; value: string; updated_at: string };

// Initialize Google Sheets client
function getGoogleSheetsClient(): sheets_v4.Sheets {
  const base64Credentials = process.env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64;

  if (!base64Credentials) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON_BASE64 environment variable is not set');
  }

  const credentials = JSON.parse(Buffer.from(base64Credentials, 'base64').toString('utf-8'));

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}

function getSpreadsheetId(): string {
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

  if (!spreadsheetId) {
    throw new Error('GOOGLE_SHEETS_ID environment variable is not set');
  }

  return spreadsheetId;
}

// Logging helper
function logOperation(operation: string, details?: Record<string, unknown>) {
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      service: 'sheets',
      operation,
      ...details,
    })
  );
}

// Row parsing helpers
function parseProductRow(row: string[]): Product {
  return {
    id: row[0] || '',
    sku: row[1] || '',
    category: (row[2] as 'handbags' | 'shoes') || 'handbags',
    name: row[3] || '',
    description: row[4] || '',
    priceKes: parseFloat(row[5]) || 0,
    images: row[6] ? row[6].split(',').map((s) => s.trim()) : [],
    isActive: row[7]?.toUpperCase() === 'TRUE',
    createdAt: row[8] || new Date().toISOString(),
    updatedAt: row[9] || new Date().toISOString(),
  };
}

function parseVariantRow(row: string[]): Variant {
  return {
    id: row[0] || '',
    productId: row[1] || '',
    size: row[2] || '',
    color: row[3] || '',
    stock: parseInt(row[4]) || 0,
    lowStockThreshold: parseInt(row[5]) || 2,
    isActive: row[6]?.toUpperCase() === 'TRUE',
    updatedAt: row[7] || new Date().toISOString(),
  };
}

function parseDeliveryLocationRow(row: string[]): DeliveryLocation {
  return {
    locationKey: row[0] || '',
    label: row[1] || '',
    feeKes: parseFloat(row[2]) || 0,
    etaDays: row[3] || '',
  };
}

function parseOrderRow(row: string[]): Order {
  return {
    id: row[0] || '',
    orderNumber: row[1] || '',
    createdAt: row[2] || new Date().toISOString(),
    status: (row[3] as OrderStatus) || 'PENDING_PAYMENT',
    customerName: row[4] || '',
    customerEmail: row[5] || '',
    customerPhone: row[6] || '',
    deliveryLocationKey: row[7] || '',
    deliveryAddress: row[8] || '',
    deliveryFeeKes: parseFloat(row[9]) || 0,
    subtotalKes: parseFloat(row[10]) || 0,
    totalKes: parseFloat(row[11]) || 0,
    paymentMethod: (row[12] as Order['paymentMethod']) || 'POD',
    paymentProvider: (row[13] as Order['paymentProvider']) || 'NONE',
    paymentRef: row[14] || '',
    notes: row[15] || '',
    whatsappPrefill: row[16] || '',
  };
}

function parseOrderItemRow(row: string[]): OrderItem {
  return {
    id: row[0] || '',
    orderId: row[1] || '',
    productId: row[2] || '',
    variantId: row[3] || '',
    sku: row[4] || '',
    name: row[5] || '',
    size: row[6] || '',
    color: row[7] || '',
    qty: parseInt(row[8]) || 0,
    unitPriceKes: parseFloat(row[9]) || 0,
    lineTotalKes: parseFloat(row[10]) || 0,
  };
}

// Row serialization helpers
function productToRow(product: Product): string[] {
  return [
    product.id,
    product.sku,
    product.category,
    product.name,
    product.description,
    product.priceKes.toString(),
    product.images.join(','),
    product.isActive ? 'TRUE' : 'FALSE',
    product.createdAt,
    product.updatedAt,
  ];
}

function variantToRow(variant: Variant): string[] {
  return [
    variant.id,
    variant.productId,
    variant.size,
    variant.color,
    variant.stock.toString(),
    variant.lowStockThreshold.toString(),
    variant.isActive ? 'TRUE' : 'FALSE',
    variant.updatedAt,
  ];
}

function orderToRow(order: Order): string[] {
  return [
    order.id,
    order.orderNumber,
    order.createdAt,
    order.status,
    order.customerName,
    order.customerEmail,
    order.customerPhone,
    order.deliveryLocationKey,
    order.deliveryAddress,
    order.deliveryFeeKes.toString(),
    order.subtotalKes.toString(),
    order.totalKes.toString(),
    order.paymentMethod,
    order.paymentProvider,
    order.paymentRef,
    order.notes,
    order.whatsappPrefill,
  ];
}

function orderItemToRow(item: OrderItem): string[] {
  return [
    item.id,
    item.orderId,
    item.productId,
    item.variantId,
    item.sku,
    item.name,
    item.size,
    item.color,
    item.qty.toString(),
    item.unitPriceKes.toString(),
    item.lineTotalKes.toString(),
  ];
}

// Read operations
export async function getAllProducts(): Promise<Product[]> {
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  logOperation('getAllProducts', { spreadsheetId });

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${SHEETS.PRODUCTS}!A2:J`,
    });

    const rows = response.data.values || [];
    return rows.map(parseProductRow);
  } catch (error) {
    logOperation('getAllProducts:error', { error: String(error) });
    throw error;
  }
}

export async function getActiveProducts(): Promise<Product[]> {
  const products = await getAllProducts();
  return products.filter((p) => p.isActive);
}

export async function getAllVariants(): Promise<Variant[]> {
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  logOperation('getAllVariants', { spreadsheetId });

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${SHEETS.VARIANTS}!A2:H`,
    });

    const rows = response.data.values || [];
    return rows.map(parseVariantRow);
  } catch (error) {
    logOperation('getAllVariants:error', { error: String(error) });
    throw error;
  }
}

export async function getActiveProductsWithVariants(): Promise<ProductWithVariants[]> {
  const [products, variants] = await Promise.all([getActiveProducts(), getAllVariants()]);

  logOperation('getActiveProductsWithVariants', {
    productCount: products.length,
    variantCount: variants.length,
  });

  return products.map((product) => ({
    ...product,
    variants: variants.filter((v) => v.productId === product.id && v.isActive),
  }));
}

export async function getProductById(productId: string): Promise<ProductWithVariants | null> {
  const [products, variants] = await Promise.all([getAllProducts(), getAllVariants()]);

  const product = products.find((p) => p.id === productId);

  if (!product) {
    logOperation('getProductById:notFound', { productId });
    return null;
  }

  logOperation('getProductById', { productId, found: true });

  return {
    ...product,
    variants: variants.filter((v) => v.productId === productId),
  };
}

export async function getDeliveryLocations(): Promise<DeliveryLocation[]> {
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  logOperation('getDeliveryLocations', { spreadsheetId });

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${SHEETS.DELIVERY_FEES}!A2:D`,
    });

    const rows = response.data.values || [];
    return rows.map(parseDeliveryLocationRow);
  } catch (error) {
    logOperation('getDeliveryLocations:error', { error: String(error) });
    throw error;
  }
}

export async function getDeliveryLocationByKey(
  locationKey: string
): Promise<DeliveryLocation | null> {
  const locations = await getDeliveryLocations();
  return locations.find((l) => l.locationKey === locationKey) || null;
}

// Delivery fee write operations
function deliveryLocationToRow(loc: DeliveryLocation): string[] {
  return [loc.locationKey, loc.label, loc.feeKes.toString(), loc.etaDays];
}

export async function upsertDeliveryLocation(
  location: DeliveryLocation
): Promise<DeliveryLocation> {
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = getSpreadsheetId();
  const locations = await getDeliveryLocations();
  const rowIndex = locations.findIndex((l) => l.locationKey === location.locationKey);

  logOperation('upsertDeliveryLocation', { locationKey: location.locationKey });

  if (rowIndex === -1) {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${SHEETS.DELIVERY_FEES}!A:D`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [deliveryLocationToRow(location)],
      },
    });
  } else {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${SHEETS.DELIVERY_FEES}!A${rowIndex + 2}:D${rowIndex + 2}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [deliveryLocationToRow(location)],
      },
    });
  }
  return location;
}

export async function deleteDeliveryLocation(locationKey: string): Promise<boolean> {
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = getSpreadsheetId();
  const locations = await getDeliveryLocations();
  const filtered = locations.filter((l) => l.locationKey !== locationKey);
  if (filtered.length === locations.length) {
    logOperation('deleteDeliveryLocation:notFound', { locationKey });
    return false;
  }

  logOperation('deleteDeliveryLocation', { locationKey });

  const rows = filtered.map(deliveryLocationToRow);
  await sheets.spreadsheets.values.clear({ spreadsheetId, range: `${SHEETS.DELIVERY_FEES}!A2:D` });
  if (rows.length > 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${SHEETS.DELIVERY_FEES}!A2:D${rows.length + 1}`,
      valueInputOption: 'RAW',
      requestBody: { values: rows },
    });
  }
  return true;
}

// Settings (key/value) - tab columns: key, value, updated_at
export async function getSettingsRows(): Promise<SettingRow[]> {
  try {
    const sheets = getGoogleSheetsClient();
    const spreadsheetId = getSpreadsheetId();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${SHEETS.SETTINGS}!A2:C`,
    });
    const rows = (response.data.values || []) as string[][];
    return rows.map((r) => ({
      key: r[0] || '',
      value: r[1] || '',
      updated_at: r[2] || '',
    }));
  } catch (error) {
    logOperation('getSettingsRows:error', { error: String(error) });
    return [];
  }
}

export async function setSettingRow(key: string, value: string): Promise<void> {
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = getSpreadsheetId();
  const now = new Date().toISOString();
  const rows = await getSettingsRows();
  const index = rows.findIndex((r) => r.key === key);

  logOperation('setSettingRow', { key });

  if (index === -1) {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${SHEETS.SETTINGS}!A:C`,
      valueInputOption: 'RAW',
      requestBody: { values: [[key, value, now]] },
    });
  } else {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${SHEETS.SETTINGS}!A${index + 2}:C${index + 2}`,
      valueInputOption: 'RAW',
      requestBody: { values: [[key, value, now]] },
    });
  }
}

// Write operations
export async function upsertProduct(
  product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
): Promise<Product> {
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  const now = new Date().toISOString();
  const isNew = !product.id;
  const fullProduct: Product = {
    id: product.id || uuidv4(),
    sku: product.sku,
    category: product.category,
    name: product.name,
    description: product.description,
    priceKes: product.priceKes,
    images: product.images,
    isActive: product.isActive,
    createdAt: isNew ? now : now,
    updatedAt: now,
  };

  logOperation('upsertProduct', { productId: fullProduct.id, isNew });

  if (isNew) {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${SHEETS.PRODUCTS}!A:J`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [productToRow(fullProduct)],
      },
    });
  } else {
    // Find and update existing row
    const products = await getAllProducts();
    const rowIndex = products.findIndex((p) => p.id === product.id);

    if (rowIndex === -1) {
      throw new Error(`Product with id ${product.id} not found`);
    }

    // Keep original createdAt
    fullProduct.createdAt = products[rowIndex].createdAt;

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${SHEETS.PRODUCTS}!A${rowIndex + 2}:J${rowIndex + 2}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [productToRow(fullProduct)],
      },
    });
  }

  return fullProduct;
}

export async function upsertVariant(
  variant: Omit<Variant, 'id' | 'updatedAt'> & { id?: string }
): Promise<Variant> {
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  const now = new Date().toISOString();
  const isNew = !variant.id;
  const fullVariant: Variant = {
    id: variant.id || uuidv4(),
    productId: variant.productId,
    size: variant.size,
    color: variant.color,
    stock: variant.stock,
    lowStockThreshold: variant.lowStockThreshold,
    isActive: variant.isActive,
    updatedAt: now,
  };

  logOperation('upsertVariant', { variantId: fullVariant.id, isNew });

  if (isNew) {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${SHEETS.VARIANTS}!A:H`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [variantToRow(fullVariant)],
      },
    });
  } else {
    const variants = await getAllVariants();
    const rowIndex = variants.findIndex((v) => v.id === variant.id);

    if (rowIndex === -1) {
      throw new Error(`Variant with id ${variant.id} not found`);
    }

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${SHEETS.VARIANTS}!A${rowIndex + 2}:H${rowIndex + 2}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [variantToRow(fullVariant)],
      },
    });
  }

  return fullVariant;
}

export async function decrementStock(
  variantId: string,
  qty: number
): Promise<{ success: boolean; newStock: number }> {
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  logOperation('decrementStock', { variantId, qty });

  const variants = await getAllVariants();
  const rowIndex = variants.findIndex((v) => v.id === variantId);

  if (rowIndex === -1) {
    logOperation('decrementStock:variantNotFound', { variantId });
    return { success: false, newStock: 0 };
  }

  const variant = variants[rowIndex];
  const newStock = variant.stock - qty;

  if (newStock < 0) {
    logOperation('decrementStock:insufficientStock', {
      variantId,
      currentStock: variant.stock,
      requested: qty,
    });
    return { success: false, newStock: variant.stock };
  }

  const updatedVariant: Variant = {
    ...variant,
    stock: newStock,
    updatedAt: new Date().toISOString(),
  };

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${SHEETS.VARIANTS}!A${rowIndex + 2}:H${rowIndex + 2}`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [variantToRow(updatedVariant)],
    },
  });

  logOperation('decrementStock:success', { variantId, newStock });
  return { success: true, newStock };
}

// Order operations
export async function createOrder(
  orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'whatsappPrefill'>,
  items: Omit<OrderItem, 'id' | 'orderId'>[]
): Promise<OrderWithItems> {
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  const orderId = uuidv4();
  const orderNumber = generateOrderNumber();
  const now = new Date().toISOString();

  // Generate WhatsApp prefill message
  const itemsList = items.map((i) => `${i.name} (${i.color}${i.size ? `, ${i.size}` : ''}) x${i.qty}`).join('\n');
  const whatsappPrefill = encodeURIComponent(
    `Hi! I just placed order ${orderNumber}.\n\nItems:\n${itemsList}\n\nTotal: KES ${orderData.totalKes.toLocaleString()}\n\nDelivery to: ${orderData.deliveryAddress}\n\nExchanges within 24 hours; no returns.`
  );

  const order: Order = {
    ...orderData,
    id: orderId,
    orderNumber,
    createdAt: now,
    whatsappPrefill,
  };

  const orderItems: OrderItem[] = items.map((item) => ({
    ...item,
    id: uuidv4(),
    orderId,
  }));

  logOperation('createOrder', { orderId, orderNumber, itemCount: items.length });

  try {
    // Insert order
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${SHEETS.ORDERS}!A:Q`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [orderToRow(order)],
      },
    });

    // Insert order items
    if (orderItems.length > 0) {
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${SHEETS.ORDER_ITEMS}!A:K`,
        valueInputOption: 'RAW',
        requestBody: {
          values: orderItems.map(orderItemToRow),
        },
      });
    }

    return { ...order, items: orderItems };
  } catch (error) {
    logOperation('createOrder:error', { error: String(error), orderId });
    throw error;
  }
}

export async function getAllOrders(): Promise<Order[]> {
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  logOperation('getAllOrders', { spreadsheetId });

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${SHEETS.ORDERS}!A2:Q`,
    });

    const rows = response.data.values || [];
    return rows.map(parseOrderRow);
  } catch (error) {
    logOperation('getAllOrders:error', { error: String(error) });
    throw error;
  }
}

export async function getOrderByNumber(orderNumber: string): Promise<OrderWithItems | null> {
  const [orders, allItems] = await Promise.all([getAllOrders(), getAllOrderItems()]);

  const order = orders.find((o) => o.orderNumber === orderNumber);

  if (!order) {
    logOperation('getOrderByNumber:notFound', { orderNumber });
    return null;
  }

  const items = allItems.filter((i) => i.orderId === order.id);

  logOperation('getOrderByNumber', { orderNumber, found: true, itemCount: items.length });

  return { ...order, items };
}

export async function getOrderById(orderId: string): Promise<OrderWithItems | null> {
  const [orders, allItems] = await Promise.all([getAllOrders(), getAllOrderItems()]);

  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    logOperation('getOrderById:notFound', { orderId });
    return null;
  }

  const items = allItems.filter((i) => i.orderId === order.id);

  return { ...order, items };
}

async function getAllOrderItems(): Promise<OrderItem[]> {
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${SHEETS.ORDER_ITEMS}!A2:K`,
    });

    const rows = response.data.values || [];
    return rows.map(parseOrderItemRow);
  } catch (error) {
    logOperation('getAllOrderItems:error', { error: String(error) });
    throw error;
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  paymentRef?: string
): Promise<boolean> {
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  logOperation('updateOrderStatus', { orderId, status, paymentRef });

  try {
    const orders = await getAllOrders();
    const rowIndex = orders.findIndex((o) => o.id === orderId);

    if (rowIndex === -1) {
      logOperation('updateOrderStatus:orderNotFound', { orderId });
      return false;
    }

    const order = orders[rowIndex];
    const updatedOrder: Order = {
      ...order,
      status,
      paymentRef: paymentRef || order.paymentRef,
    };

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${SHEETS.ORDERS}!A${rowIndex + 2}:Q${rowIndex + 2}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [orderToRow(updatedOrder)],
      },
    });

    logOperation('updateOrderStatus:success', { orderId, status });
    return true;
  } catch (error) {
    logOperation('updateOrderStatus:error', { error: String(error), orderId });
    return false;
  }
}

// Variant lookup helper
export async function getVariantById(variantId: string): Promise<Variant | null> {
  const variants = await getAllVariants();
  return variants.find((v) => v.id === variantId) || null;
}

// Check stock availability
export async function checkStockAvailability(
  variantId: string,
  requestedQty: number
): Promise<{ available: boolean; currentStock: number }> {
  const variant = await getVariantById(variantId);

  if (!variant) {
    return { available: false, currentStock: 0 };
  }

  return {
    available: variant.stock >= requestedQty,
    currentStock: variant.stock,
  };
}

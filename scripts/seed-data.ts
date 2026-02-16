/**
 * Seed data for identi-shop products
 * 
 * To use this data:
 * 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1-vmhUWJo4C3YLWn9eqsjJtSZng-7mvpiP5L9znfqsYY
 * 2. Copy the data below into the appropriate tabs
 */

import { v4 as uuidv4 } from 'uuid';

// Generate UUIDs for products
const handbag1Id = uuidv4();
const handbag2Id = uuidv4();
const handbag3Id = uuidv4();
const heels1Id = uuidv4();
const heels2Id = uuidv4();
const heels3Id = uuidv4();

// Generate UUIDs for variants
const variant1Id = uuidv4();
const variant2Id = uuidv4();
const variant3Id = uuidv4();
const variant4Id = uuidv4();
const variant5Id = uuidv4();
const variant6Id = uuidv4();
const variant7Id = uuidv4();
const variant8Id = uuidv4();
const variant9Id = uuidv4();
const variant10Id = uuidv4();
const variant11Id = uuidv4();
const variant12Id = uuidv4();

const now = new Date().toISOString();

// Product data
export const products = [
  {
    id: handbag1Id,
    sku: 'HB-001',
    category: 'handbags',
    name: 'Milano Quilted Tote',
    description: 'Elegant quilted leather tote bag with gold-tone hardware. Features a spacious interior with multiple compartments, perfect for everyday luxury.',
    price_kes: 12500,
    images: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800',
    is_active: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: handbag2Id,
    sku: 'HB-002',
    category: 'handbags',
    name: 'Parisian Crossbody',
    description: 'Chic crossbody bag crafted from premium leather with an adjustable chain strap. Compact yet spacious enough for your essentials.',
    price_kes: 8900,
    images: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800',
    is_active: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: handbag3Id,
    sku: 'HB-003',
    category: 'handbags',
    name: 'Executive Satchel',
    description: 'Sophisticated structured satchel in croc-embossed leather. The perfect blend of professional elegance and modern style.',
    price_kes: 15800,
    images: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800',
    is_active: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: heels1Id,
    sku: 'SH-001',
    category: 'shoes',
    name: 'Crystal Stiletto Pumps',
    description: 'Stunning stiletto pumps adorned with delicate crystal embellishments. 4-inch heel with cushioned insole for comfort.',
    price_kes: 9500,
    images: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800',
    is_active: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: heels2Id,
    sku: 'SH-002',
    category: 'shoes',
    name: 'Classic Nude Heels',
    description: 'Timeless nude pointed-toe heels that elongate your silhouette. Versatile enough for office to evening wear.',
    price_kes: 7200,
    images: 'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=800',
    is_active: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: heels3Id,
    sku: 'SH-003',
    category: 'shoes',
    name: 'Strappy Block Heels',
    description: 'Modern strappy heels with a comfortable block heel. Features an ankle strap with gold buckle detail.',
    price_kes: 6800,
    images: 'https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?w=800',
    is_active: true,
    created_at: now,
    updated_at: now,
  },
];

// Variant data
export const variants = [
  // Milano Quilted Tote variants (handbags - color only)
  { id: variant1Id, product_id: handbag1Id, size: '', color: 'Black', stock: 5, low_stock_threshold: 2, is_active: true, updated_at: now },
  { id: variant2Id, product_id: handbag1Id, size: '', color: 'Tan', stock: 3, low_stock_threshold: 2, is_active: true, updated_at: now },
  
  // Parisian Crossbody variants
  { id: variant3Id, product_id: handbag2Id, size: '', color: 'Black', stock: 8, low_stock_threshold: 2, is_active: true, updated_at: now },
  { id: variant4Id, product_id: handbag2Id, size: '', color: 'Burgundy', stock: 4, low_stock_threshold: 2, is_active: true, updated_at: now },
  
  // Executive Satchel variants
  { id: variant5Id, product_id: handbag3Id, size: '', color: 'Black', stock: 2, low_stock_threshold: 2, is_active: true, updated_at: now },
  { id: variant6Id, product_id: handbag3Id, size: '', color: 'Cognac', stock: 6, low_stock_threshold: 2, is_active: true, updated_at: now },
  
  // Crystal Stiletto Pumps variants (shoes - size + color)
  { id: variant7Id, product_id: heels1Id, size: '37', color: 'Silver', stock: 3, low_stock_threshold: 2, is_active: true, updated_at: now },
  { id: variant8Id, product_id: heels1Id, size: '38', color: 'Silver', stock: 5, low_stock_threshold: 2, is_active: true, updated_at: now },
  { id: variant9Id, product_id: heels1Id, size: '39', color: 'Silver', stock: 4, low_stock_threshold: 2, is_active: true, updated_at: now },
  
  // Classic Nude Heels variants
  { id: variant10Id, product_id: heels2Id, size: '37', color: 'Nude', stock: 6, low_stock_threshold: 2, is_active: true, updated_at: now },
  { id: variant11Id, product_id: heels2Id, size: '38', color: 'Nude', stock: 4, low_stock_threshold: 2, is_active: true, updated_at: now },
  { id: variant12Id, product_id: heels2Id, size: '39', color: 'Nude', stock: 7, low_stock_threshold: 2, is_active: true, updated_at: now },
  
  // Strappy Block Heels variants
  { id: uuidv4(), product_id: heels3Id, size: '36', color: 'Black', stock: 3, low_stock_threshold: 2, is_active: true, updated_at: now },
  { id: uuidv4(), product_id: heels3Id, size: '37', color: 'Black', stock: 5, low_stock_threshold: 2, is_active: true, updated_at: now },
  { id: uuidv4(), product_id: heels3Id, size: '38', color: 'Black', stock: 4, low_stock_threshold: 2, is_active: true, updated_at: now },
  { id: uuidv4(), product_id: heels3Id, size: '39', color: 'Black', stock: 2, low_stock_threshold: 2, is_active: true, updated_at: now },
  { id: uuidv4(), product_id: heels3Id, size: '37', color: 'Tan', stock: 6, low_stock_threshold: 2, is_active: true, updated_at: now },
  { id: uuidv4(), product_id: heels3Id, size: '38', color: 'Tan', stock: 3, low_stock_threshold: 2, is_active: true, updated_at: now },
];

// Delivery fee data
export const deliveryFees = [
  { location_key: 'NAIROBI_CBD', label: 'Nairobi CBD', fee_kes: 300, eta_days: '1-2' },
  { location_key: 'NAIROBI_SUBURBS', label: 'Nairobi Suburbs', fee_kes: 400, eta_days: '1-2' },
  { location_key: 'MOMBASA', label: 'Mombasa', fee_kes: 600, eta_days: '2-3' },
  { location_key: 'KISUMU', label: 'Kisumu', fee_kes: 600, eta_days: '2-3' },
  { location_key: 'NAKURU', label: 'Nakuru', fee_kes: 500, eta_days: '2-3' },
  { location_key: 'ELDORET', label: 'Eldoret', fee_kes: 550, eta_days: '2-4' },
  { location_key: 'OTHER', label: 'Other Locations', fee_kes: 800, eta_days: '3-5' },
];

// Console output for easy copy-paste
console.log('\n=== PRODUCTS TAB ===');
console.log('id\tsku\tcategory\tname\tdescription\tprice_kes\timages\tis_active\tcreated_at\tupdated_at');
products.forEach(p => {
  console.log(`${p.id}\t${p.sku}\t${p.category}\t${p.name}\t${p.description}\t${p.price_kes}\t${p.images}\t${p.is_active}\t${p.created_at}\t${p.updated_at}`);
});

console.log('\n=== VARIANTS TAB ===');
console.log('id\tproduct_id\tsize\tcolor\tstock\tlow_stock_threshold\tis_active\tupdated_at');
variants.forEach(v => {
  console.log(`${v.id}\t${v.product_id}\t${v.size}\t${v.color}\t${v.stock}\t${v.low_stock_threshold}\t${v.is_active}\t${v.updated_at}`);
});

console.log('\n=== DELIVERY_FEES TAB ===');
console.log('location_key\tlabel\tfee_kes\teta_days');
deliveryFees.forEach(d => {
  console.log(`${d.location_key}\t${d.label}\t${d.fee_kes}\t${d.eta_days}`);
});

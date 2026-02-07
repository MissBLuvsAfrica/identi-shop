import 'server-only';
import { Resend } from 'resend';
import type { OrderWithItems } from '@/types';
import { formatPrice, formatDate } from './utils';
import { ORDER_STATUS_LABELS, RETURNS_POLICY, SITE_NAME } from './constants';

// Lazy-load Resend client to avoid build errors when API key is missing
let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

const FROM_EMAIL = process.env.EMAIL_FROM || 'orders@identi.co.ke';

// Logging helper
function logEmail(operation: string, details?: Record<string, unknown>) {
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      service: 'email',
      operation,
      ...details,
    })
  );
}

// Email templates
function getBaseTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${SITE_NAME}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8f8f8;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f8f8; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color: #000000; padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 4px;">${SITE_NAME}</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f8f8; padding: 30px; text-align: center; font-size: 12px; color: #666666;">
              <p style="margin: 0 0 10px 0;"><strong>${RETURNS_POLICY.summary}</strong></p>
              <p style="margin: 0;">© ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

function getOrderItemsTable(items: OrderWithItems['items']): string {
  const rows = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee;">
        <strong>${item.name}</strong><br>
        <span style="color: #666666; font-size: 14px;">
          ${item.color}${item.size ? ` | Size: ${item.size}` : ''} | Qty: ${item.qty}
        </span>
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; text-align: right; white-space: nowrap;">
        ${formatPrice(item.lineTotalKes)}
      </td>
    </tr>
  `
    )
    .join('');

  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
      ${rows}
    </table>
  `;
}

// Order Received Email (for POD or Pending Payment)
export async function sendOrderReceivedEmail(order: OrderWithItems): Promise<boolean> {
  logEmail('sendOrderReceivedEmail', { orderNumber: order.orderNumber, email: order.customerEmail });

  const content = `
    <h2 style="margin: 0 0 20px 0; font-weight: 400;">Order Received</h2>
    <p style="color: #666666; line-height: 1.6;">
      Hi ${order.customerName},<br><br>
      Thank you for your order! We've received your order and it's being processed.
    </p>
    
    <div style="background-color: #f8f8f8; padding: 20px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0; font-size: 14px; color: #666666;">Order Number</p>
      <p style="margin: 5px 0 0 0; font-size: 20px; font-weight: 500;">${order.orderNumber}</p>
    </div>

    <h3 style="margin: 30px 0 10px 0; font-weight: 500;">Order Details</h3>
    ${getOrderItemsTable(order.items)}
    
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding: 8px 0;">Subtotal</td>
        <td style="padding: 8px 0; text-align: right;">${formatPrice(order.subtotalKes)}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0;">Delivery</td>
        <td style="padding: 8px 0; text-align: right;">${formatPrice(order.deliveryFeeKes)}</td>
      </tr>
      <tr>
        <td style="padding: 12px 0; border-top: 2px solid #000000;"><strong>Total</strong></td>
        <td style="padding: 12px 0; border-top: 2px solid #000000; text-align: right;"><strong>${formatPrice(order.totalKes)}</strong></td>
      </tr>
    </table>

    <div style="margin-top: 30px; padding: 20px; background-color: #f8f8f8; border-radius: 4px;">
      <h4 style="margin: 0 0 10px 0; font-weight: 500;">Delivery Address</h4>
      <p style="margin: 0; color: #666666;">${order.deliveryAddress}</p>
    </div>

    <p style="margin-top: 30px; color: #666666; font-size: 14px;">
      Payment Method: <strong>${order.paymentMethod === 'POD' ? 'Pay on Delivery' : ORDER_STATUS_LABELS[order.status]}</strong>
    </p>
  `;

  try {
    const resend = getResendClient();
    if (!resend) {
      logEmail('sendOrderReceivedEmail:skipped', { orderNumber: order.orderNumber, reason: 'No API key configured' });
      return false;
    }
    await resend.emails.send({
      from: FROM_EMAIL,
      to: order.customerEmail,
      subject: `Order Received - ${order.orderNumber}`,
      html: getBaseTemplate(content),
    });
    logEmail('sendOrderReceivedEmail:success', { orderNumber: order.orderNumber });
    return true;
  } catch (error) {
    logEmail('sendOrderReceivedEmail:error', { orderNumber: order.orderNumber, error: String(error) });
    return false;
  }
}

// Payment Confirmed Email
export async function sendPaymentConfirmedEmail(order: OrderWithItems): Promise<boolean> {
  logEmail('sendPaymentConfirmedEmail', { orderNumber: order.orderNumber, email: order.customerEmail });

  const content = `
    <h2 style="margin: 0 0 20px 0; font-weight: 400;">Payment Confirmed</h2>
    <p style="color: #666666; line-height: 1.6;">
      Hi ${order.customerName},<br><br>
      Great news! Your payment has been confirmed and your order is now being prepared for delivery.
    </p>
    
    <div style="background-color: #f8f8f8; padding: 20px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0; font-size: 14px; color: #666666;">Order Number</p>
      <p style="margin: 5px 0 0 0; font-size: 20px; font-weight: 500;">${order.orderNumber}</p>
      ${order.paymentRef ? `<p style="margin: 10px 0 0 0; font-size: 12px; color: #999999;">Ref: ${order.paymentRef}</p>` : ''}
    </div>

    <h3 style="margin: 30px 0 10px 0; font-weight: 500;">Order Summary</h3>
    ${getOrderItemsTable(order.items)}
    
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding: 12px 0; border-top: 2px solid #000000;"><strong>Total Paid</strong></td>
        <td style="padding: 12px 0; border-top: 2px solid #000000; text-align: right;"><strong>${formatPrice(order.totalKes)}</strong></td>
      </tr>
    </table>

    <div style="margin-top: 30px; padding: 20px; background-color: #f8f8f8; border-radius: 4px;">
      <h4 style="margin: 0 0 10px 0; font-weight: 500;">Delivery Address</h4>
      <p style="margin: 0; color: #666666;">${order.deliveryAddress}</p>
    </div>

    <p style="margin-top: 30px; color: #666666; font-size: 14px; line-height: 1.6;">
      We'll notify you once your order has been dispatched. If you have any questions, 
      please don't hesitate to reach out via WhatsApp.
    </p>
  `;

  try {
    const resend = getResendClient();
    if (!resend) {
      logEmail('sendPaymentConfirmedEmail:skipped', { orderNumber: order.orderNumber, reason: 'No API key configured' });
      return false;
    }
    await resend.emails.send({
      from: FROM_EMAIL,
      to: order.customerEmail,
      subject: `Payment Confirmed - ${order.orderNumber}`,
      html: getBaseTemplate(content),
    });
    logEmail('sendPaymentConfirmedEmail:success', { orderNumber: order.orderNumber });
    return true;
  } catch (error) {
    logEmail('sendPaymentConfirmedEmail:error', { orderNumber: order.orderNumber, error: String(error) });
    return false;
  }
}

// Order Delivered Email
export async function sendOrderDeliveredEmail(order: OrderWithItems): Promise<boolean> {
  logEmail('sendOrderDeliveredEmail', { orderNumber: order.orderNumber, email: order.customerEmail });

  const content = `
    <h2 style="margin: 0 0 20px 0; font-weight: 400;">Order Delivered</h2>
    <p style="color: #666666; line-height: 1.6;">
      Hi ${order.customerName},<br><br>
      Your order has been delivered! We hope you love your new items.
    </p>
    
    <div style="background-color: #f8f8f8; padding: 20px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0; font-size: 14px; color: #666666;">Order Number</p>
      <p style="margin: 5px 0 0 0; font-size: 20px; font-weight: 500;">${order.orderNumber}</p>
      <p style="margin: 10px 0 0 0; font-size: 12px; color: #999999;">Delivered on ${formatDate(new Date().toISOString())}</p>
    </div>

    <h3 style="margin: 30px 0 10px 0; font-weight: 500;">Your Order</h3>
    ${getOrderItemsTable(order.items)}

    <div style="margin-top: 30px; padding: 20px; background-color: #fff8e6; border-radius: 4px; border-left: 4px solid #ffc107;">
      <h4 style="margin: 0 0 10px 0; font-weight: 500;">Exchange Policy</h4>
      <p style="margin: 0; color: #666666; font-size: 14px;">
        ${RETURNS_POLICY.summary}<br>
        Items must be in original condition with tags attached.
      </p>
    </div>

    <p style="margin-top: 30px; color: #666666; font-size: 14px; line-height: 1.6;">
      Thank you for shopping with ${SITE_NAME}. We'd love to see you again!
    </p>
  `;

  try {
    const resend = getResendClient();
    if (!resend) {
      logEmail('sendOrderDeliveredEmail:skipped', { orderNumber: order.orderNumber, reason: 'No API key configured' });
      return false;
    }
    await resend.emails.send({
      from: FROM_EMAIL,
      to: order.customerEmail,
      subject: `Order Delivered - ${order.orderNumber}`,
      html: getBaseTemplate(content),
    });
    logEmail('sendOrderDeliveredEmail:success', { orderNumber: order.orderNumber });
    return true;
  } catch (error) {
    logEmail('sendOrderDeliveredEmail:error', { orderNumber: order.orderNumber, error: String(error) });
    return false;
  }
}

# IDENTI Shop

A production-ready luxury e-commerce platform for handbags and shoes, built with Next.js 14+, TypeScript, and Google Sheets as the database.

## Features

- **Customer Storefront**
  - Luxury-focused design with responsive UI
  - Product catalog with category filtering and search
  - Size and color variant selection
  - Shopping cart with stock enforcement
  - Checkout with multiple payment options

- **Payment Integration**
  - Flutterwave gateway (Card, M-Pesa, Airtel Money)
  - Pay on Delivery option
  - WhatsApp order placement
  - Webhook-based payment verification

- **Admin Portal**
  - Secure authentication
  - Product and variant management
  - Order management with status updates
  - Stock tracking

- **Notifications**
  - Email confirmations via Resend
  - WhatsApp order summaries

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **Database**: Google Sheets API
- **Payments**: Flutterwave
- **Email**: Resend
- **Testing**: Vitest (unit), Playwright (e2e)
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel

## Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Google Sheets Configuration
GOOGLE_SERVICE_ACCOUNT_JSON_BASE64=<base64-encoded-service-account-json>
GOOGLE_SHEETS_ID=<your-spreadsheet-id>

# App Configuration
APP_BASE_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# WhatsApp
WHATSAPP_E164=254700000000

# Admin Auth
ADMIN_USER=admin
ADMIN_PASS_HASH=<bcrypt-hashed-password>

# Flutterwave Payment Gateway
FLW_PUBLIC_KEY=FLWPUBK-xxxxxxxxxxxxxxx-X
FLW_SECRET_KEY=FLWSECK-xxxxxxxxxxxxxxx-X
FLW_ENCRYPTION_KEY=xxxxxxxxxxxxxxxx
FLW_WEBHOOK_HASH=<your-webhook-hash>

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx
EMAIL_FROM=orders@yourdomain.com
```

## Google Sheets Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API

### 2. Create a Service Account

1. Go to IAM & Admin > Service Accounts
2. Click "Create Service Account"
3. Give it a name and description
4. Skip optional steps
5. Click on the created service account
6. Go to Keys > Add Key > Create new key > JSON
7. Download the JSON file

### 3. Encode the Service Account

```bash
# On macOS/Linux
cat service-account.json | base64

# On Windows (PowerShell)
[Convert]::ToBase64String([IO.File]::ReadAllBytes("service-account.json"))
```

Set this as `GOOGLE_SERVICE_ACCOUNT_JSON_BASE64` in your environment.

### 4. Create the Spreadsheet

1. Create a new Google Spreadsheet
2. Get the spreadsheet ID from the URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
3. Share the spreadsheet with the service account email (found in the JSON file)
4. Give it "Editor" access

### 5. Create the Required Sheets (Tabs)

Create these sheets with exact names and columns:

#### `products` Sheet
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Unique identifier |
| sku | string | Stock keeping unit |
| category | string | "handbags" or "shoes" |
| name | string | Product name |
| description | string | Product description |
| price_kes | number | Price in KES |
| images | string | Comma-separated URLs |
| is_active | boolean | TRUE/FALSE |
| created_at | datetime | ISO format |
| updated_at | datetime | ISO format |

#### `variants` Sheet
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Unique identifier |
| product_id | uuid | References products.id |
| size | string | Size (blank for handbags) |
| color | string | Color name |
| stock | number | Available quantity |
| low_stock_threshold | number | Alert threshold (default: 2) |
| is_active | boolean | TRUE/FALSE |
| updated_at | datetime | ISO format |

#### `delivery_fees` Sheet
| Column | Type | Description |
|--------|------|-------------|
| location_key | string | Unique key (e.g., NAIROBI_CBD) |
| label | string | Display name |
| fee_kes | number | Delivery fee in KES |
| eta_days | string | Estimated days (e.g., "1-2") |

Sample data:
```
NAIROBI_CBD | Nairobi CBD | 200 | 1-2
NAIROBI_OTHER | Greater Nairobi | 300 | 2-3
MOMBASA | Mombasa | 500 | 3-5
KISUMU | Kisumu | 500 | 3-5
OTHER | Other Locations | 700 | 5-7
```

#### `orders` Sheet
| Column | Type |
|--------|------|
| id | uuid |
| order_number | string |
| created_at | datetime |
| status | string |
| customer_name | string |
| customer_email | string |
| customer_phone | string |
| delivery_location_key | string |
| delivery_address | string |
| delivery_fee_kes | number |
| subtotal_kes | number |
| total_kes | number |
| payment_method | string |
| payment_provider | string |
| payment_ref | string |
| notes | string |
| whatsapp_prefill | string |

#### `order_items` Sheet
| Column | Type |
|--------|------|
| id | uuid |
| order_id | uuid |
| product_id | uuid |
| variant_id | uuid |
| sku | string |
| name | string |
| size | string |
| color | string |
| qty | number |
| unit_price_kes | number |
| line_total_kes | number |

## Admin Password Setup

Generate a bcrypt hash for your admin password:

```javascript
// Run this in Node.js
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('your-password', 12);
console.log(hash);
```

Or use an online bcrypt generator. Set the hash as `ADMIN_PASS_HASH`.

## Flutterwave Setup

1. Create a [Flutterwave account](https://dashboard.flutterwave.com/)
2. Get your API keys from Settings > API Keys
3. Set up the webhook URL: `https://yourdomain.com/api/payments/webhook`
4. Copy the webhook secret hash

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm run test

# Run e2e tests
npm run test:e2e

# Type check
npm run typecheck

# Lint
npm run lint

# Format code
npm run format
```

## Deployment to Vercel

1. Push your code to GitHub
2. Connect the repository to Vercel
3. Add all environment variables in Vercel dashboard
4. Deploy

### Production Checklist

- [ ] Set `APP_BASE_URL` to your production domain
- [ ] Update `NEXT_PUBLIC_APP_URL` for client-side
- [ ] Configure Flutterwave webhook URL
- [ ] Verify Google Sheets permissions
- [ ] Test payment flow end-to-end
- [ ] Set up email domain in Resend

## Common Issues & Fixes

### Google Sheets "Permission Denied"
- Ensure the service account email has Editor access to the spreadsheet
- Check that the spreadsheet ID is correct
- Verify the base64 encoding is correct

### Payments Not Processing
- Verify Flutterwave API keys are for the correct environment (test vs live)
- Check webhook URL is accessible and HTTPS in production
- Ensure `FLW_WEBHOOK_HASH` matches Flutterwave dashboard

### Build Fails
- Run `npm run typecheck` to find TypeScript errors
- Ensure all environment variables are set
- Check for missing dependencies

### Cart Not Persisting
- Cookies require HTTPS in production (unless localhost)
- Check browser cookie settings

## Project Structure

```
src/
├── actions/          # Server actions
├── app/             # Next.js pages
│   ├── admin/       # Admin portal
│   ├── api/         # API routes
│   ├── cart/        # Cart page
│   ├── checkout/    # Checkout page
│   ├── order/       # Order confirmation
│   ├── product/     # Product detail
│   └── shop/        # Shop listing
├── components/      # React components
│   ├── layout/      # Header, Footer, etc.
│   ├── product/     # Product components
│   └── ui/          # Base UI components
├── lib/             # Utilities & services
│   ├── auth.ts      # Admin authentication
│   ├── cart.ts      # Cart management
│   ├── constants.ts # App constants
│   ├── email.ts     # Email service
│   ├── schemas.ts   # Zod schemas
│   ├── sheets.ts    # Google Sheets API
│   └── utils.ts     # Utility functions
├── test/            # Test setup
└── types/           # TypeScript types

e2e/                 # Playwright e2e tests
```

## License

Private - All rights reserved.

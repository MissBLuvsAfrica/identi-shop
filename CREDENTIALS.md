# Admin & deployment credentials

Production is on **main**. Set these in **Vercel → Project → Settings → Environment Variables** for **Production** (and Preview if you use it).

---

## 1. Admin login (required for /admin)

| Variable | How to set |
|----------|------------|
| **ADMIN_USER** | Choose a username, e.g. `admin`. Set this exact value in Vercel. |
| **ADMIN_PASS_HASH** | Generate from **your** password (see below). |
| **ADMIN_SESSION_SECRET** | Generate a long random string (see below). |

### Generate ADMIN_PASS_HASH

Pick a strong password (e.g. `MyStr0ng!Pass`). Then run in your project folder:

```bash
node -e "const bcrypt = require('bcryptjs'); const h = bcrypt.hashSync(process.argv[1], 12); console.log(h);" "YOUR_PASSWORD_HERE"
```

Replace `YOUR_PASSWORD_HERE` with your real password. Copy the printed hash into Vercel as **ADMIN_PASS_HASH**.

**Your admin login will be:**

- **URL:** `https://your-site.vercel.app/admin/login` (or your custom domain)
- **Username:** whatever you set for `ADMIN_USER` (e.g. `admin`)
- **Password:** the password you used when generating the hash above

### If you see "Invalid credentials"

1. In Vercel, set **ADMIN_LOGIN_DEBUG** = `true` (Environment Variables), then **Redeploy**.
2. Try logging in again. The message will tell you:
   - **"ADMIN_USER or ADMIN_PASS_HASH not set"** → Add or fix those vars in Vercel and redeploy.
   - **"username does not match"** → Set **ADMIN_USER** to exactly what you type in the Username field (e.g. `hello@identionline.com`), no extra spaces.
   - **"password is incorrect"** → Generate a new **ADMIN_PASS_HASH** with the command above using the **exact** password you type, paste it into Vercel (no newline), and redeploy.
3. Remove **ADMIN_LOGIN_DEBUG** or set it to `false` after fixing.

### Generate ADMIN_SESSION_SECRET

Run:

```bash
openssl rand -base64 32
```

Copy the output into Vercel as **ADMIN_SESSION_SECRET**. If you don’t have `openssl`, use any long random string (at least 32 characters).

---

## 2. Other required env vars (Vercel Production)

- **GOOGLE_SERVICE_ACCOUNT_JSON_BASE64** – from your Google Cloud service account JSON (base64).
- **GOOGLE_SHEETS_ID** – your spreadsheet ID.
- **APP_BASE_URL** – e.g. `https://identi-shop.vercel.app` or your custom domain.
- **NEXT_PUBLIC_APP_URL** – same as `APP_BASE_URL`.
- **WHATSAPP_E164** – e.g. `254716610156` (no `+`).

Optional (if you use them):

- Flutterwave: **FLW_PUBLIC_KEY**, **FLW_SECRET_KEY**, **FLW_ENCRYPTION_KEY**, **FLW_WEBHOOK_HASH**
- Resend: **RESEND_API_KEY**, **EMAIL_FROM**

---

## 3. After changing env vars in Vercel

Redeploy the Production deployment (or trigger a new deploy from the Vercel dashboard) so the new values are used.

---

**Summary:** You choose the admin **username** and **password**. You generate **ADMIN_PASS_HASH** and **ADMIN_SESSION_SECRET** with the commands above and paste them into Vercel. Keep your password and `.env` files private; never commit them.

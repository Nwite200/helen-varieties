# Running Helen's Varieties

## Daily
- Sign in at `/admin/login`. **Products** adds/edits items (photos upload to storage). **All Orders** shows every order and lets you change its status; customers see updates on **Track Order**.
- Orders reach you in the admin panel only, so check it regularly. Customers also message you on WhatsApp.

## Change the admin password
```
npx wrangler secret put ADMIN_PROVISION_PASSWORD --name helen-varieties
```
Use a long, unique password. Changing it signs everyone out. Never paste it in chat or commit it.

## Backups (do weekly)
```
bash scripts/backup-d1.sh
```
Saves a dated SQL file in `backups/` (ignored by git). It contains customer data, so store it privately.

## Database setup / updates
```
npx wrangler d1 migrations apply helens-varieties-db --remote
```
Run after merging any change that adds a file in `migrations/` (this release adds `0003`).

## Protect the login (recommended, 2 minutes)
Cloudflare dashboard → your domain → Security → WAF → Rate limiting rules → create: URI path equals `/api/admin/login`, 5 requests per 1 minute per IP, action Block for 10 minutes. The app also blocks an IP after 8 failed logins.

## Know when the site is down
Create a free monitor (UptimeRobot or Cloudflare Health Checks) for `https://helensvarieties.com.ng/api/health`. Turn on Cloudflare Web Analytics for visitor numbers.

## Take payments (bank transfer)
In `wrangler.toml` fill `BANK_NAME`, `BANK_ACCOUNT_NUMBER` and `BANK_ACCOUNT_NAME`, then push. After checkout customers see a "Pay now" box with these details and a button to send proof of payment on WhatsApp. Until they are filled, customers are told to message you on WhatsApp for payment details. When a payment arrives, open **All Orders** and set the order to "Payment Confirmed".

## Not live yet
Automatic card payment (Paystack/Flutterwave) is not built in; payment is by bank transfer and confirmed by you. The WhatsApp Live Hub and AI Assistant config screens in admin are demonstrations, not connected to WhatsApp.

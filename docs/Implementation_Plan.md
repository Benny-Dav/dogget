# Dogget Implementation Plan (Phased)

**Source**: Synthesised from `docs/Dogget_PRD_v2.md` (§1.4 ground truth, §11 launch plan) against verified repo state as of 2026-04-24.
**Target**: 8 weeks, solo full-time. Each phase ends with a staging deploy.

---

## Stack decision — Auth vs. Database

- **Auth (identity, sessions, password reset, Google sign-in, ID tokens)** → **Firebase Auth**. Client uses Firebase Web SDK; server uses Firebase Admin SDK to verify ID tokens via `verifyFirebaseToken` middleware on every protected endpoint.
- **Primary database** → **Neon (managed Postgres)**, accessed via Prisma. Chosen over Firestore because the PRD requires `tsvector`/`pg_trgm` FTS, multi-filter queries, ACID split-order transactions, and FK integrity. Chosen over Supabase because the user's Supabase free tier is exhausted; Neon's branching + generous free tier replaces it 1:1.
- All earlier "Supabase" references in the PRD (§7, §8, NFR-24, A-6, §10.x) should be read as "Neon" for the host. Every other Postgres-specific decision (extensions, migrations, Prisma schema) stays exactly as written.
- Buyers, vendors, and admins **all** authenticate via Firebase. Role (`CUSTOMER` / `VENDOR` / `ADMIN`) lives in the Postgres `User` row, not in Firebase custom claims, and is set server-side.

---

## Design Constraint — Mobile-only viewport

Dogget is a mobile-first PWA. **Every page renders inside a fixed mobile-width frame on every device, including desktop.** No responsive desktop layout will be built.

- App-wide wrapper in `apps/web/src/App.jsx`: `mx-auto w-full max-w-[430px] min-h-svh bg-white shadow-xl`.
- Body background (`apps/web/src/index.css`) is a neutral surface (`#e9e9ef`) so the mobile frame is visible on wide screens.
- Authoring rule: write all components for ≤430px width. Do **not** use `sm:`, `md:`, `lg:` breakpoints to expand layout — only to *refine within* the mobile frame (e.g. slightly larger asset on roomier mobiles).
- `min-h-svh` on inner sections is preserved so mobile keyboard behaviour still works.
- Future PWA install (`vite-plugin-pwa`, Phase 8) targets standalone mobile install only.

---

## Phase 0 — Foundation & Cleanup (pre-Phase-1, 1–2 days)

Must be done before anything else. Today's code is blocking.

### Fix
- `src/firebase/firebaseconfig.js`: import `getAuth`, export `app` and `auth`, move keys into `VITE_FIREBASE_*` env vars (PRD §8.1).
- `src/firebase/firebaseAuth.js`: fix `./firebase/config` → `./firebaseconfig`, remove duplicate `auth` export, complete `signInWithEmailAndPassword(auth, email, password)` call.
- Add `.env.local` with populated Firebase web config.

### Decide
- Monorepo migration (`apps/web`, `apps/api`, `packages/shared`, `packages/email`) via pnpm — PRD §10.3 recommends doing this at Week 1 to avoid later paralysis.

**Exit criteria**: repo builds clean, Firebase SDK initialises, no runtime import errors.

---

## Phase 1 — Backend skeleton, Auth, Infra (Week 1)

### Frontend
- Monorepo layout. Move `src/` → `apps/web/src/`.
- Install Zustand, TanStack Query, React Hook Form, Zod.
- Stores: `authStore`, `cartStore` (localStorage-backed), `wishlistStore`, `uiStore`, `currencyStore`.
- Wire `Register.jsx` to real Firebase Auth (email+password + Google).

### Backend (new `apps/api`)
- Fastify 4 + Prisma + Postgres (Neon).
- Firebase Admin SDK, `verifyFirebaseToken` middleware.
- Endpoints: `POST /auth/session`, `POST /auth/register`, `GET/PATCH /users/me`.
- Prisma models for `User` and `Address`.
- Sentry (client + server), Pino JSON logs.

### Infra
- GitHub Actions: lint, typecheck, test, build, deploy to Vercel (web) + Railway (api) on push.

**Exit**: sign up with Firebase creates a `User` row on server; `/users/me` returns it.

---

## Phase 2 — Catalog data model & Shop page (Week 2)

### DB
- Full Prisma schema per PRD §6 (Vendor, Brand, Category, Subcategory, Product, ProductImage, Cart, CartItem, WishlistItem, Order, OrderItem, Payment, PayoutRun/Line, Review, PromoCode, FxRate, Notification, AuditLog, CheckoutSession, SearchQueryLog, HomeBanner).
- Raw migration: `tsvector` generated column + GIN index + `pg_trgm` (§6 bottom).
- Seed script: 4 categories, 10 brands, 2 sample vendors (1 = Dogget Official), 20 products, 1 admin.

### API
- `GET /products` with full filter/sort/pagination (FR-C01–C18).
- `GET /products/:slug`, `/categories`, `/brands`, `/vendors/:slug`, `/vendors/:slug/products`.

### Web
- Delete `src/content/products.js`; wire `Shop.jsx` + `ShopFilters.jsx` to API via TanStack Query.
- Extend filters: brand (multi), price range, life stage, breed size, dietary tags, min rating, in-stock toggle, vendor chips.
- Filter drawer (mobile bottom sheet), applied-filter chips, URL-encoded state, skeleton loaders, empty state.
- `ProductCard` rebuilt against real product shape (Cloudinary srcset, currency formatter).

**Exit**: Shop page renders from real DB, all filters + sort + pagination functional, deep-linkable.

---

## Phase 3 — Search, Product Detail, Cart, Wishlist (Week 3)

### Search
- `GET /products` with `q` param using weighted `tsvector` FTS.
- `GET /products/search/suggest` (debounced 250ms, top 5).
- `pg_trgm` fuzzy fallback when FTS < 3 results.
- Wire `Header.jsx` search bar.

### Product Detail (new route `/products/:slug`)
- Swiper image gallery, vendor badge, stock status, quantity stepper, Add to Cart + Buy Now, wishlist toggle, markdown description, attribute chips, rating + histogram, paginated reviews, related products, shipping accordion.

### Cart (new route `/cart`)
- Local-first Zustand + `dogget.cart.v1` localStorage key.
- Items grouped by vendor, per-vendor subtotal + shipping estimate.
- `POST /cart/sync` on login, merge by max(qty).
- `PATCH/DELETE /cart/items/:id`, drift warning if price snapshot differs >5%.

### Wishlist (new route `/wishlist`)
- `POST/DELETE /wishlist/:productId`, guest → local → merge on login.

**Exit**: can search, open a product, add to cart (guest + authed), checkout button enabled.

---

## Phase 4 — Checkout, Payments, Orders (Week 4)

### Checkout session
- `CheckoutSession` model (30-min TTL, cron cleanup).
- `POST /checkout/session` with split-order preview (one sub-order per vendor).
- Address entry (guest inline; authed picker), Ghana region dropdown, per-vendor shipping recompute, VAT 15% line, promo code validation, FX rate frozen onto session.

### Payments
- Paystack popup (cards + MoMo) in GHS; server converts total to GHS via frozen FX.
- Stripe Checkout Sessions (USD/EUR) behind `FEATURE_STRIPE` flag.
- COD path (only when every vendor has `codEnabled`).
- Webhooks: `POST /webhooks/paystack` (HMAC-SHA512 verify), `POST /webhooks/stripe` (signature verify). Idempotent by `providerRef`. Atomic PENDING → PAID across all sub-orders.
- Reconcile cron every 10 min for stuck sessions (E-05).

### Orders
- `/orders` list, `/orders/:id` detail (grouped by `orderGroupId`), status pills, receipt print CSS.
- Vendor `PATCH /orders/:id/status` transitions per §4.8.1 state machine; invalid → 422.
- Auto-cancel `PENDING > 2h` cron.

### Emails (Resend + React Email)
- `order-placed`, `vendor-new-order`, `payment-confirmed`, `order-cancelled`.

**Exit**: end-to-end purchase (Paystack + COD minimum) on staging with two vendors in one cart.

---

## Phase 5 — Vendor module (Week 5)

### Registration & approval
- `/vendor/apply` form (store name, slug, currency, region, logo, business type).
- `POST /vendors` → `approved=false`.

### Dashboard (`VendorLayout`, route guard role=VENDOR)
- `/vendor` overview: today orders, 7d orders, 30d GMV, pending count, low-stock count.
- `/vendor/products`: CRUD table + editor, Cloudinary signed upload (`POST /uploads/cloudinary-signature`), Zod validation, up to 6 images.
- `/vendor/orders`: table with status filter, detail drawer with transition buttons + tracking entry.
- `/vendor/settings`: shipping rule (FLAT / BY_REGION / FREE_OVER_THRESHOLD), COD toggle, display currency.
- `/vendor/payouts`: Gross / Commission (10%) / Net with recent runs.

### Public storefront (`/vendors/:slug`)
Header, badges (verified, COD, rating), product grid with filters, contact links.

**Exit**: a sample vendor can register, be approved, list 10 products, take an order, mark it shipped.

---

## Phase 6 — Admin panel (Week 5 continued / Week 6 start)

Route guard role=ADMIN. Admin role only assigned via backend (FR-A06).

- `/admin` dashboard (today orders, 30d GMV, active vendors, pending approvals, open flags).
- `/admin/vendors` approval queue (approve / reject + reason → email).
- `/admin/products` moderation (deactivate, delete, force-feature).
- `/admin/orders` all orders + force-cancel.
- `/admin/reviews` flagged queue, hide/unhide/delete.
- `/admin/fx` manual rate override (critical — do not ship without this, PRD FR-AD09).
- `/admin/payouts` payout runs (generate weekly, mark lines paid).
- `/admin/promos` CRUD (P1).
- `/admin/users` ban / role change (P1).
- `/admin/categories` + `/admin/brands` CRUD.
- AuditLog writes on every admin action.

**Exit**: all moderation, approval, and FX-override flows operable by a single admin.

---

## Phase 7 — Reviews, Profile, Multi-currency, FX cron (Week 6)

### Reviews
- `POST /reviews` (server enforces verified-purchase via `orderItemId`).
- Edit window 30 days; one per {user, product}.
- `POST /reviews/:id/reply` (vendor, one reply), `POST /reviews/:id/flag`.
- Denormalised `averageRating` + `reviewCount` recompute on create/update/delete/hide.
- "Review my order" email 3 days after DELIVERED.

### Profile (`/profile`)
- Name, phone, avatar upload, preferred currency.
- Addresses CRUD with default.
- Saved payment methods (Paystack `authorization_code`) — P1 if tight.
- Order history tab, wishlist tab, soft-delete account.

### Multi-currency + FX
- Daily cron `0 0 * * *` fetches `exchangerate.host` GHS base → USD/EUR/NGN, upserts `FxRate`.
- `formatMoney({amount, currency})` shows conversion tooltip everywhere.
- Persist buyer preference to `User.preferredCurrency` + localStorage.
- Admin FX override when live fetch fails (E-13).

### Remaining emails
`order-shipped`, `order-delivered`, `cod-paid`, `vendor-approved`, `vendor-rejected`, `vendor-new-review`, `review-reply`.

**Exit**: full review lifecycle works; any buyer can switch currencies and see live conversion.

---

## Phase 8 — PWA, Polish, Hardening, Launch (Weeks 7–8)

### PWA (`vite-plugin-pwa` + Workbox)
- Manifest: `theme #F4A52C`, `start_url /home`, icons 192/512 maskable.
- Runtime caching:
  - App shell → StaleWhileRevalidate
  - Cloudinary images → CacheFirst 30d / 200 entries
  - `GET /products|/categories|/brands` → NetworkFirst 3s / 24h
  - Writes → NetworkOnly
- `/offline.html`, global offline banner, SW update toast (`skipWaiting`), deferred custom install prompt after 2 visits.

### Performance
- Lighthouse mobile Perf ≥ 85, A11y ≥ 90 (NFR-04).
- Image `srcset` audit, eager only ATF, `f_auto,q_auto`.
- LCP < 2.5s p75 on 3G.

### Security (NFR-08 through NFR-14)
- `helmet` + strict CSP, CORS allowlist, rate limits (60/min products, 20/min auth, 10/min checkout), Zod on every endpoint, `dompurify` on markdown, Sentry source maps, CI secret-leak check.

### Accessibility
Keyboard nav, focus rings, ARIA labels, 4.5:1 contrast, 44×44 touch targets.

### Seed + ops
- Dogget Official 20–30 SKUs live.
- 3 pilot partner vendors onboarded with ≥10 products each.
- Privacy Policy + Terms published.
- UptimeRobot on `/healthz`, backup restore tested on staging.
- Rollback runbook written (Vercel promote previous, Railway retag, forward-only DB with compensating migrations).

### Launch gate
PRD §11.3 Go/No-Go (10 criteria); private beta (20 users) → public beta → GA.

---

## Cut-list if you slip (ordered by safety to drop)

1. Saved payment methods UI (FR-U03).
2. Promo codes UI (`/admin/promos`) — keep DB-only admin entry.
3. Review-CTA reminder email.
4. Admin `/admin/users`, `/admin/payouts` UIs — operable via DB in emergency (PRD A-4).
5. Stripe path (feature-flag off, Paystack + COD only).
6. Vendor review reply.
7. Variant group UI.

**Keep** (non-negotiable for launch): auth, catalog, cart, checkout (Paystack + COD), split orders, vendor CRUD + approvals, admin moderation, FX override, PWA, emails for order lifecycle.

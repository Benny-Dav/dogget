# Dogget Implementation Plan (Phased)

**Source**: Synthesised from `docs/Dogget_PRD_v2.md` (§1.4 ground truth, §11 launch plan) against verified repo state as of 2026-04-26.
**Target**: ~9 weeks, solo full-time. Each phase ends with a staging deploy.
**Strategy** *(revised 2026-04-26)*: **frontend-first.** Build all UI surfaces against a typed mock-API layer, then do a single backend integration phase, then payments + ops, then launch hardening. This avoids paying the integration tax while UI shapes are still in flux and lets each surface ship to staging the day it's done.

---

## Stack decision — Auth vs. Database

- **Auth (identity, sessions, password reset, Google sign-in, ID tokens)** → **Firebase Auth**. Client uses Firebase Web SDK; server (Phase 7+) uses Firebase Admin SDK to verify ID tokens via `verifyFirebaseToken` middleware on every protected endpoint.
- **Primary database** → **Neon (managed Postgres)**, accessed via Prisma. Chosen over Firestore because the PRD requires `tsvector`/`pg_trgm` FTS, multi-filter queries, ACID split-order transactions, and FK integrity. **Provisioning deferred to Phase 7** — no Neon project exists during the frontend sweep.
- All earlier "Supabase" references in the PRD (§7, §8, NFR-24, A-6, §10.x) should be read as "Neon" for the host. Every other Postgres-specific decision (extensions, migrations, Prisma schema) stays exactly as written.
- Buyers, vendors, and admins **all** authenticate via Firebase. Role (`CUSTOMER` / `VENDOR` / `ADMIN`) lives in the Postgres `User` row, not in Firebase custom claims, and is set server-side.

---

## Design Constraint — Mobile-only viewport

Dogget is a mobile-first PWA. **Every page renders inside a fixed mobile-width frame on every device, including desktop.** No responsive desktop layout will be built.

- App-wide wrapper in `apps/web/src/App.jsx`: `mx-auto w-full max-w-[430px] min-h-svh bg-white shadow-xl`.
- Body background (`apps/web/src/index.css`) is a neutral surface (`#e9e9ef`) so the mobile frame is visible on wide screens.
- Authoring rule: write all components for ≤430px width. Do **not** use `sm:`, `md:`, `lg:` breakpoints to expand layout — only to *refine within* the mobile frame (e.g. slightly larger asset on roomier mobiles).
- `min-h-svh` on inner sections is preserved so mobile keyboard behaviour still works.
- Future PWA install (`vite-plugin-pwa`, Phase 9) targets standalone mobile install only.

---

## The mock-API contract (used by every frontend phase)

The frontend talks to a single `api` facade exported from `apps/web/src/lib/api`.

- **Types** (`types.js`) — JSDoc typedefs for `Product`, `Category`, `Brand`, `Vendor`, `User`, `CartItem`, etc. Shapes match what the real API will return.
- **Mocks** (`mocks/*.js`) — fixture data conforming to the types.
- **Facade** (`index.js`) — selects implementation at module load: mock by default, real when `VITE_USE_MOCK_API=false`.
- **Mock impl** (`mock.js`) — in-memory filtering/sorting/pagination, ~200ms artificial latency.
- **Real impl** (`real.js`) — currently throws "not implemented"; filled in during Phase 7.
- **Hooks** (`hooks.js`) — TanStack Query wrappers (`useProducts`, `useCategories`, `useProduct`, `useVendor`, `useMe`, …). Components should prefer hooks over calling `api.*` directly.
- **Money** is `{ amount: <minor units>, currency: <code> }`. Display via `formatMoney(money)`. No price strings anywhere.

**Migration rule**: any new page that needs server data goes through `api.*` / hooks from day one. No new direct imports of `apps/web/src/content/*` — that folder is being retired.

---

## Phase 0 — Foundation & Cleanup ✅ DONE

- Firebase web config consolidated, env vars set up.
- Monorepo migration to `apps/web`, `apps/api`, `packages/*` via pnpm.
- Mobile-only frame applied app-wide.

---

## Phase 1A — Initial UI scaffolding ✅ DONE

Homepage, onboarding, login screen, Shop page scaffolding (against `content/products.js`). CTA section, footer.

---

## Phase 1B — Mock-API layer + Stores 🔄 IN PROGRESS

### API layer ✅
- `apps/web/src/lib/api/` scaffolded: types, format, mocks (products/categories/brands/vendors), mock impl, real placeholder, TanStack Query hooks.

### Migration of existing pages
- `Shop.jsx` + `ShopFilters.jsx`: drop `content/products.js` import, use `useProducts()` and `useCategories()`. Update `ProductCard` to take a `Product` object and render `formatMoney(product.price)`.
- `Home.jsx`: featured/recommended sections use `useFeaturedProducts()` and `useCategories()`.

### Stores (Zustand)
- `authStore` — current Firebase user + server User row + idToken.
- `cartStore` — `dogget.cart.v1` localStorage key, items, qty mutations, total. Guest-friendly.
- `wishlistStore` — local list of product IDs, swap-in to API on login.
- `uiStore` — drawer/modal/toast state.
- `currencyStore` — preferred currency, persisted to localStorage; once `User.preferredCurrency` is real, syncs both ways.

### Real Firebase Auth (client only)
- Fix `firebase/firebaseconfig.js` exports, wire `Register.jsx` and a Login screen to email+password and Google sign-in.
- On successful sign-in, call `api.auth.session(idToken)` (mock returns a fake `User`) and store the result in `authStore`.
- No backend = no `verifyFirebaseToken` yet. That's fine — the contract is what matters.

**Exit**: Shop and Home render entirely from `api.*`. A user can sign up / sign in via Firebase and see a "Hi, Demo User" greeting fed by the mock session call. Cart/wishlist persist across reloads via localStorage.

---

## Phase 2 — Catalog UI complete (on mocks)

### Filters
- Filter drawer (mobile bottom sheet): brand (multi), price range, life stage, breed size, dietary tags, min rating, in-stock toggle.
- Applied-filter chips, URL-encoded state, deep-linkable.
- Skeleton loaders, empty state, "show all" reset.

### Search
- Header search bar wired to `api.products.list({ q })` (mock does substring match).
- Suggest dropdown stub (`useDeferredValue`, debounced 250ms).

### Product Detail (`/products/:slug`)
- Swiper image gallery, vendor badge, stock status, quantity stepper.
- Add to Cart + Buy Now (Buy Now navigates to checkout draft).
- Wishlist toggle, markdown description, attribute chips (life stage / breed size / dietary).
- Rating + histogram, paginated reviews (mock fixtures), related products via `useRelatedProducts()`.
- Shipping accordion (static copy until Phase 8).

### ProductCard rebuild
- Takes a full `Product`. Cloudinary `srcset`. Wishlist heart wired to `wishlistStore`.

**Exit**: Shop is fully filterable/sortable/paginated. Any product opens a complete detail page. All flows are deep-linkable.

---

## Phase 3 — Cart, Wishlist, Checkout UI (on mocks)

### Cart (`/cart`)
- Items grouped by vendor, per-vendor subtotal + shipping placeholder.
- Quantity stepper, remove, "save for later" → wishlist.
- Empty state, drift warning placeholder (UI only).
- "Sync on login" stub: when authed, calls `api.cart.sync()` (mock no-op).

### Wishlist (`/wishlist`)
- Grid of saved items, "move to cart", "remove".

### Checkout flow (UI shells, no real payments)
- `/checkout/address` — guest inline form / authed picker, Ghana region dropdown.
- `/checkout/shipping` — per-vendor shipping line items.
- `/checkout/payment` — Paystack / Stripe / COD radio cards. No SDK calls — selection is just UI state.
- `/checkout/review` — totals (subtotal, VAT 15%, shipping, promo), terms checkbox, "Place order" button calls `api.checkout.session()` (mock returns a confirmation).
- `/checkout/confirmation/:id` — success screen.

### Orders (mock data)
- `/orders` list, `/orders/:id` detail (grouped by `orderGroupId`), status pills, receipt print CSS.

**Exit**: a guest can browse → cart → simulate checkout → land on a confirmation. An authed user sees their (mocked) order history.

---

## Phase 4 — Vendor module UI (on mocks)

### Registration
- `/vendor/apply` form (store name, slug, currency, region, logo upload stub, business type).

### Dashboard (`VendorLayout`, route guard `role=VENDOR` against mock user)
- `/vendor` overview: today orders, 7d orders, 30d GMV, pending count, low-stock count (all from mock aggregates).
- `/vendor/products`: CRUD table + editor, image upload stub (no real Cloudinary yet), Zod validation, up to 6 images.
- `/vendor/orders`: table with status filter, detail drawer with transition buttons + tracking entry.
- `/vendor/settings`: shipping rule (FLAT / BY_REGION / FREE_OVER_THRESHOLD), COD toggle, display currency.
- `/vendor/payouts`: Gross / Commission (10%) / Net with mock recent runs.

### Public storefront (`/vendors/:slug`)
- Header, badges (verified, COD, rating), product grid with filters, contact links.

**Exit**: every vendor screen renders against mocks; flipping a `mockUser.role` to `VENDOR` reveals the full module.

---

## Phase 5 — Admin panel UI (on mocks)

Route guard `role=ADMIN`. Admin role only assigned via backend (FR-A06) — in mock land, a dev toggle.

- `/admin` dashboard.
- `/admin/vendors` approval queue.
- `/admin/products` moderation.
- `/admin/orders` all orders + force-cancel.
- `/admin/reviews` flagged queue.
- `/admin/fx` manual rate override (PRD FR-AD09).
- `/admin/payouts` payout runs.
- `/admin/promos` CRUD (P1).
- `/admin/users` ban / role change (P1).
- `/admin/categories` + `/admin/brands` CRUD.

**Exit**: every admin screen renders + accepts input. AuditLog writes are stubbed (logged to console).

---

## Phase 6 — Profile, Reviews, Multi-currency UI (on mocks)

### Profile (`/profile`)
- Name, phone, avatar upload stub, preferred currency switcher (writes to `currencyStore` + mock `users.update`).
- Addresses CRUD with default.
- Saved payment methods placeholder (P1).
- Order history tab, wishlist tab, soft-delete account flow.

### Reviews UI
- Review form on Product Detail (gated by mock "owns this orderItem" flag).
- Edit window 30-day banner.
- Vendor reply UI (visible when `role=VENDOR` && owns the product).
- Flag-for-moderation UI.

### Multi-currency
- `formatMoney({amount, currency})` everywhere shows conversion tooltip when display currency ≠ source currency. Mock FX rates table.
- Persist buyer preference to `currencyStore` + (mocked) `User.preferredCurrency`.

**Exit**: ~80–90% of UI is built. Every screen the launch needs exists and is interactive on mock data. **This is the cutover gate to Phase 7.**

---

## Phase 7 — Backend integration (the big one)

Goal: replace the mock impl with a real one, end-to-end. No new UI in this phase.

### Database
- Provision Neon project (single `main` branch in production, branch-per-deploy only for previews).
- Apply full Prisma schema per PRD §6 (Vendor, Brand, Category, Subcategory, Product, ProductImage, Cart, CartItem, WishlistItem, Order, OrderItem, Payment, PayoutRun/Line, Review, PromoCode, FxRate, Notification, AuditLog, CheckoutSession, SearchQueryLog, HomeBanner).
- Raw migration: `tsvector` generated column + GIN index + `pg_trgm` (§6 bottom).
- Seed script: 4 categories, 10 brands, 2 sample vendors (1 = Dogget Official), 20 products, 1 admin.

### API server (resume `apps/api` skeleton)
- Fastify 5 + Prisma + Pino + Sentry. Existing `apps/api` plugins (`auth`, `error-handler`, `firebase-admin`, `prisma`) carry over.
- Endpoints (read): `GET /products` with full filter/sort/pagination + `q` FTS (weighted `tsvector`, `pg_trgm` fuzzy fallback when <3 hits) + `GET /products/search/suggest`, `GET /products/:slug`, `/categories`, `/brands`, `/vendors/:slug`, `/vendors/:slug/products`.
- Endpoints (auth): `POST /auth/session`, `POST /auth/register`, `GET/PATCH /users/me`.
- Endpoints (cart/wishlist): `POST /cart/sync`, `PATCH/DELETE /cart/items/:id`, `POST/DELETE /wishlist/:productId`.
- Zod on every endpoint, role guards from JWT-decoded `User.role`.

### Frontend swap
- Implement `apps/web/src/lib/api/real.js` mirroring the mock signatures exactly. Each method = one `fetch` against `VITE_API_BASE_URL` with the auth header.
- Set `VITE_USE_MOCK_API=false` in staging; mock stays default in dev.
- `cartStore.sync()` actually calls `api.cart.sync()`; same for wishlist.

### Infra
- Deploy `apps/api` (Railway or Vercel serverless — decide based on cold-start tolerance). DB env vars + Firebase service account on the API project, **not** on `dogget-web`.
- GitHub Actions: lint, typecheck, test, build, deploy web (Vercel) + api (chosen host) on push to `master`.

**Exit**: a fresh user can sign up → land on real Home/Shop → see DB-backed products → add to cart → see cart sync across devices. No payments yet; checkout still UI-only.

---

## Phase 8 — Payments, Webhooks, FX, Vendor/Admin backend, Emails

UI exists from Phases 4–6 — this phase wires the server-side logic behind the screens.

### Checkout
- `CheckoutSession` model (30-min TTL, cron cleanup).
- `POST /checkout/session` with split-order preview (one sub-order per vendor), per-vendor shipping recompute, VAT 15% line, promo code validation, FX rate frozen onto session.

### Payments
- Paystack popup (cards + MoMo) in GHS; server converts total to GHS via frozen FX.
- Stripe Checkout Sessions (USD/EUR) behind `FEATURE_STRIPE` flag.
- COD path (only when every vendor in cart has `codEnabled`).
- Webhooks: `POST /webhooks/paystack` (HMAC-SHA512 verify), `POST /webhooks/stripe` (signature verify). Idempotent by `providerRef`. Atomic PENDING → PAID across all sub-orders.
- Reconcile cron every 10 min for stuck sessions (E-05).
- Auto-cancel `PENDING > 2h` cron.

### Vendor backend
- Cloudinary signed upload (`POST /uploads/cloudinary-signature`).
- Products CRUD with Zod validation, image enforcement.
- Orders state machine per §4.8.1 (`PATCH /orders/:id/status`; invalid → 422).
- Settings persistence, payout aggregation queries.

### Admin backend
- Approval / rejection (with reason → email).
- Moderation actions, force-cancel, FX manual override (E-13 fallback).
- Payout runs (generate weekly, mark lines paid).
- AuditLog writes on every admin action.

### Reviews
- `POST /reviews` (server enforces verified-purchase via `orderItemId`).
- Edit window 30 days; one per `{user, product}`.
- `POST /reviews/:id/reply` (vendor, one reply), `POST /reviews/:id/flag`.
- Denormalised `averageRating` + `reviewCount` recompute on create/update/delete/hide.

### FX
- Daily cron `0 0 * * *` fetches `exchangerate.host` GHS base → USD/EUR/NGN, upserts `FxRate`.

### Emails (Resend + React Email)
- `order-placed`, `vendor-new-order`, `payment-confirmed`, `order-cancelled`, `order-shipped`, `order-delivered`, `cod-paid`, `vendor-approved`, `vendor-rejected`, `vendor-new-review`, `review-reply`, `review-cta` (3 days post-DELIVERED).

**Exit**: end-to-end purchase (Paystack + COD minimum) on staging with two vendors in one cart. Vendor and admin actions persist and trigger correct emails.

---

## Phase 9 — PWA, Polish, Hardening, Launch

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

## Calendar (target)

| Phase | Scope | Calendar |
| --- | --- | --- |
| 0–1A | Foundation + initial UI | DONE |
| 1B | Mock API + stores + Firebase Auth client | Week 1 (current) |
| 2 | Catalog UI complete | Week 2 |
| 3 | Cart + checkout UI | Week 3 |
| 4 | Vendor UI | Week 4 |
| 5 | Admin UI | Week 5 (first half) |
| 6 | Profile + reviews + multi-currency UI | Week 5 (second half) |
| 7 | Backend integration (DB, API, swap) | Weeks 6–7 |
| 8 | Payments + webhooks + vendor/admin backend + emails | Week 8 |
| 9 | PWA + hardening + launch | Week 9 |

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

---

## Risks introduced by frontend-first sequencing

- **API shape drift.** UI built against guessed shapes can need rework when the real schema lands. Mitigation: types in `apps/web/src/lib/api/types.js` mirror Prisma models exactly, and any new field added to a model must update the typedef in the same PR.
- **Search realism.** Mock substring matching ≠ `tsvector` ranking. Empty-state / no-results UX should be tested again post-Phase-7 with real FTS behavior.
- **Auth-gated flows.** Without a server, role enforcement is honor-system in dev. Phase 7 must include a pass through every guarded route to confirm 401/403 paths render correctly.
- **Performance illusion.** 200ms mock latency is uniform; real DB queries vary. Lighthouse / loading-state polish must be redone after Phase 7.
- **Big-bang integration.** Phase 7 swaps a lot at once. Mitigation: implement `real.js` method-by-method, gated behind per-method env flags if needed (`VITE_USE_MOCK_API_PRODUCTS=false` style) so the cutover is incremental.

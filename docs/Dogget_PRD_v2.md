# Product Requirements Document: Dogget (v2)

**A Multi-Vendor Dog & Pet Supply Marketplace PWA for Ghana**

| Field           | Value                                  |
|-----------------|----------------------------------------|
| Author          | Benedicta                              |
| Date            | 2026-04-24                             |
| Version         | 3.0 (supersedes v1/v2.0)               |
| Status          | Approved for Build                     |
| Confidentiality | Internal                               |
| Supersedes      | `docs/Dogget_PRD.md` (v2.0, 2026-02-11) |

> This document is the definitive, build-ready specification for the Dogget MVP. Every open question from v1 has been resolved inline. No decisions are deferred to the implementation phase unless explicitly marked "Phase 2" or "Phase 3". The target reader is the solo builder (Benedicta); the document should remove the need for re-deliberation during implementation.

---

## Table of Contents

- [1. Overview](#1-overview)
  - [1.1 Purpose](#11-purpose)
  - [1.2 Problem Statement](#12-problem-statement)
  - [1.3 Solution Summary](#13-solution-summary)
  - [1.4 Current Implementation State (Ground Truth)](#14-current-implementation-state-ground-truth)
  - [1.5 MVP Scope vs Non-Scope](#15-mvp-scope-vs-non-scope)
- [2. Goals & Success Metrics](#2-goals--success-metrics)
  - [2.1 Objectives & Key Results](#21-objectives--key-results)
  - [2.2 KPIs and Targets](#22-kpis-and-targets)
  - [2.3 Explicit Non-Goals (MVP)](#23-explicit-non-goals-mvp)
- [3. Users & Personas](#3-users--personas)
  - [3.1 User Segments](#31-user-segments)
  - [3.2 Personas](#32-personas)
  - [3.3 User Stories](#33-user-stories)
- [4. Functional Requirements](#4-functional-requirements)
  - [4.1 Authentication & Account Management](#41-authentication--account-management)
  - [4.2 Product Catalog, Filters, Search, Sorting, Discovery](#42-product-catalog-filters-search-sorting-discovery)
  - [4.3 Product Detail Page](#43-product-detail-page)
  - [4.4 Cart](#44-cart)
  - [4.5 Wishlist](#45-wishlist)
  - [4.6 Checkout](#46-checkout)
  - [4.7 Payments](#47-payments)
  - [4.8 Orders & Order Lifecycle](#48-orders--order-lifecycle)
  - [4.9 Reviews & Ratings](#49-reviews--ratings)
  - [4.10 User Profile / Pawfile](#410-user-profile--pawfile)
  - [4.11 Vendor Module](#411-vendor-module)
  - [4.12 Admin Panel](#412-admin-panel)
  - [4.13 Notifications (Email)](#413-notifications-email)
  - [4.14 PWA Behaviors](#414-pwa-behaviors)
  - [4.15 Multi-Currency & FX](#415-multi-currency--fx)
- [5. Non-Functional Requirements](#5-non-functional-requirements)
- [6. Data Requirements & Full Prisma Schema](#6-data-requirements--full-prisma-schema)
- [7. API Design](#7-api-design)
- [8. Integration Requirements](#8-integration-requirements)
- [9. User Experience](#9-user-experience)
  - [9.1 Key User Flows](#91-key-user-flows)
  - [9.2 Screen Inventory](#92-screen-inventory)
  - [9.3 Design System](#93-design-system)
  - [9.4 Edge Cases](#94-edge-cases)
- [10. Technical Architecture](#10-technical-architecture)
- [11. Launch Plan](#11-launch-plan)
- [12. Future Phases](#12-future-phases)
- [13. Assumptions & Risks](#13-assumptions--risks)
- [14. Appendix](#14-appendix)
  - [14.1 Glossary](#141-glossary)
  - [14.2 Environment Variables](#142-environment-variables)
  - [14.3 Reference Links](#143-reference-links)
  - [14.4 Changelog vs v1](#144-changelog-vs-v1)

---

## 1. Overview

### 1.1 Purpose

Dogget is a mobile-first, multi-vendor e-commerce Progressive Web App (PWA) for dog and pet supplies, launching in Ghana. This PRD (v3.0) is the single source of truth for the MVP build: product scope, user experience, data models, API surface, integrations, delivery plan, and operational posture. It supersedes the v1 PRD at `docs/Dogget_PRD.md`. Unlike v1, every ambiguity that caused mid-build blockers (currency, vendor model, filters, variants, fulfillment) is resolved inline. Phase 2 and Phase 3 features are scoped only to the extent that Phase 1 architecture must not preclude them.

### 1.2 Problem Statement

Dog owners in Ghana buy pet supplies through fragmented, low-trust channels: physical markets, Instagram vendors, and WhatsApp sellers. There is no centralized catalog, no consistent quality signal (no reviews, no verified vendors), no transparent pricing, no mobile-first checkout, and no reliable record of orders or delivery. Simultaneously, small and mid-sized pet product vendors lack an affordable digital storefront that reaches buyers beyond their local area, handles payment collection, and provides a basic operational surface (orders, inventory, payouts).

### 1.3 Solution Summary

Dogget provides:

1. A curated multi-vendor marketplace where Dogget Official (first-party) and approved third-party vendors list dog/pet products under a shared quality bar.
2. A mobile-first PWA (installable, offline-capable for browsing) optimized for 2G/3G conditions common in Ghana.
3. Guest-friendly checkout with Paystack as the primary online payment gateway for Mobile Money and cards. Cash on Delivery is deferred until Dogget has a reliable collection/remittance process.
4. Multi-currency display (vendors price in their currency; buyers see their preferred currency, converted at daily FX rates; FX locked at order placement).
5. Vendor self-service: registration, product CRUD, order management, and public storefront page.
6. Admin moderation: vendor approvals, product moderation, review moderation, promos, FX override.

Phase 2 will add pet services booking, community, and wellness tracker. Phase 3 will add AI, subscriptions, and livestream commerce. Those are outlined at high level in [Section 12](#12-future-phases).

### 1.4 Current Implementation State (Ground Truth)

The repo at `/Users/benedicta/Documents/dogget-pwa/dogget` contains a partial frontend. The table below is verified against the working tree as of 2026-04-24.

**Implemented and wired**

| Area | File(s) / Route | Notes |
|---|---|---|
| Router | `src/App.jsx` | Routes: `/` (Onboarding), `/home`, `/shop`, `/register`. No `/cart`, `/wishlist`, `/profile`, `/product/:id`, `/checkout`, `/orders`, `/vendor/*`, `/admin/*` yet. |
| Onboarding | `src/pages/Onboarding.jsx`, `src/features/HomePage/onboardingSlides.js`, `PawScatter.jsx` | 3-slide Swiper carousel, auto-advance. |
| Home | `src/pages/Home.jsx`, `src/layouts/HomeLayout.jsx` | Composes: `GreetingSection`, `HeroBanner`, `CategoriesSection`, `RecommendedSection`, `AdSection`, `TrustSection`, `CTASection`, `FeatureCards`. |
| Shop | `src/pages/Shop.jsx`, `src/features/shop/ShopFilters.jsx` | Category pills (All / Pet Food / Health / Grooming / Accessories) + sort dropdown (Featured, Price asc, Price desc, Name A–Z). No search, brand, price, rating, stage, breed, dietary, vendor, or in-stock filters yet. |
| Product Card | `src/reusableComponents/ProductCard.jsx` | Image, title, brief, quantity, price, wishlist heart icon, basket icon (not wired to any store). |
| Chrome | `Header.jsx` (search bar UI only, not functional), `BottomMenu.jsx`, `Footer.jsx` | Bottom nav routes exist for Home, Wishlist, Shop, Cart, Pawfile; Wishlist, Cart, Pawfile routes are dead links today. |
| Auth UI | `src/features/auth/Register.jsx` (referenced in router) | Toggle form shell. **Not wired to Firebase.** |
| Mock Data | `src/content/products.js`, `src/content/categories.js` | 11 products across 4 categories, prices in USD with `$` prefix, minimal fields (id, image, title, brief, quantity, price, category). |
| Components created but not wired | `VetSection.jsx`, `TestimonialsSection.jsx` | Exist in `src/features/HomePage/` but not rendered in any route. |

**Broken or missing (must fix during MVP)**

| Issue | File | Required Fix |
|---|---|---|
| Empty Firebase API keys | `src/firebase/firebaseconfig.js` | Populate from Firebase console; move into `VITE_FIREBASE_*` env vars. |
| `getAuth` used without import | `src/firebase/firebaseconfig.js` line 15 | `import { getAuth } from "firebase/auth"`; export `auth`. |
| Broken import `./firebase/config` | `src/firebase/firebaseAuth.js` line 1 | Fix to `./firebaseconfig`. |
| `export const auth = getAuth(app)` mid-file with undefined `app` | `src/firebase/firebaseAuth.js` line 18 | Remove; export `auth` from `firebaseconfig.js`. |
| `signInWithEmailAndPassword` call has no args | `src/firebase/firebaseAuth.js` line 22 | Complete the call; wire handlers to the Register form. |
| No state management | n/a | Add Zustand for `authStore`, `cartStore`, `wishlistStore`, `uiStore`. |
| No backend | n/a | Build Node.js/Fastify + Prisma + PostgreSQL per this PRD. |
| No PWA | `vite.config.js` | Install `vite-plugin-pwa`; configure manifest and Workbox runtime caching. |
| Product data shape | `src/content/products.js` | Replace with API-backed catalog; fields to expand per [Section 4.2](#42-product-catalog-filters-search-sorting-discovery). |

### 1.5 MVP Scope vs Non-Scope

**In scope (Phase 1 MVP)**

- Storefront (home, shop, product detail, vendor storefront `/vendors/:slug`)
- Multi-vendor catalog with hybrid seeding (Dogget Official + 3–5 partner vendors)
- Filters, server-side search with autocomplete, sorting, pagination
- Cart (local-first, server sync), wishlist (authenticated)
- Guest checkout + optional account creation at confirmation
- Paystack (GHS + Mobile Money + local/international cards, subject to Paystack approval)
- Multi-currency display with daily FX, FX frozen at order placement
- VAT 15% line item at checkout (Ghana)
- Cross-vendor cart → split into one order per vendor at checkout
- Orders & lifecycle with vendor-managed fulfillment, status model, immutable order-item snapshots
- Verified-purchase reviews (1–5 stars, optional text + photo); vendor reply; admin moderation
- Vendor registration, approval queue, dashboard (products, orders, payouts), public storefront
- Admin panel (dashboard, vendor approvals, product/review moderation, users, promos, FX override)
- Promo codes (percent / fixed / free shipping)
- Email notifications (Resend) for key lifecycle events
- PWA (installable, offline browsing, update prompt)
- Auth: Firebase email+password and Google, role assignment, server token verification
- Monitoring (Sentry) and privacy-friendly analytics (Plausible)

**Out of scope for MVP (documented only)**

- Pet services booking (vet, groomer, walker) — Phase 2
- Wellness tracker / pet identity records — Phase 2
- Community / forums / DogFlix / lost dog reporting — Phase 2
- Subscriptions, AI recs, livestream — Phase 3
- SMS and WhatsApp notifications — Phase 2
- Returns and refunds workflow (no-returns policy in MVP) — Phase 2
- Proper variant system (MVP uses separate products per variant)
- Multi-country expansion, multi-language UI
- Native iOS/Android apps

---

## 2. Goals & Success Metrics

### 2.1 Objectives & Key Results

**O1 — Ship a trustworthy commerce MVP in Ghana within 8 weeks.**
- KR1.1: End-to-end purchase flow live (browse → cart → checkout → Paystack → confirmation → vendor fulfillment) with at least one real transaction on launch day.
- KR1.2: Zero P0 bugs open at public-beta go-live; < 5 P1 bugs.
- KR1.3: Lighthouse mobile Performance > 85, Accessibility > 90.

**O2 — Seed the marketplace to avoid cold-start.**
- KR2.1: Dogget Official stocks ≥ 20 SKUs by launch.
- KR2.2: 3–5 partner vendors approved and listing ≥ 10 SKUs each by launch.
- KR2.3: ≥ 75 live products across ≥ 3 categories on launch day.

**O3 — Validate demand & retention in 90 days post-launch.**
- KR3.1: 200+ registered buyers.
- KR3.2: 50+ paid orders (card/MoMo via Paystack).
- KR3.3: Cart-to-order conversion ≥ 5% on returning visitors.
- KR3.4: Week-4 buyer retention ≥ 15%.

**O4 — Build a maintainable foundation for Phase 2.**
- KR4.1: API covered by contract tests (auth, products, cart, checkout, orders, reviews, vendor CRUD, admin).
- KR4.2: Every public route renders offline on return visit (Workbox runtime cache hit).
- KR4.3: No schema rewrites needed to add services booking in Phase 2 (confirmed by dry-run ERD review).

### 2.2 KPIs and Targets

| KPI | Target @ Launch +90d | Source |
|---|---|---|
| Registered buyers | 200 | `users` count where role = CUSTOMER |
| Approved vendors | 8+ (incl. Dogget Official) | `vendors` where approved = true |
| Live SKUs | 150+ | `products` where isActive = true & inventory > 0 |
| GMV (Gross Merchandise Value, GHS) | GHS 25,000 | Sum of `orders.totalAmount` in GHS-equivalent |
| Paid orders | 50 | `orders` where status in (PAID, DELIVERED) |
| Cart conversion rate | ≥ 5% | Orders / unique checkout-page visitors |
| PWA install rate | ≥ 10% returning users | `appinstalled` event |
| LCP p75 (mobile, 3G) | < 2.5s | Web Vitals |
| Error rate (5xx) | < 0.5% | Sentry |
| Uptime | 99.5% | UptimeRobot |
| Review coverage | ≥ 30% of delivered orders leave a review | `reviews` / delivered `order_items` |

### 2.3 Explicit Non-Goals (MVP)

| ID | Non-Goal | Rationale |
|---|---|---|
| NG-1 | Native iOS/Android apps | PWA covers install + offline |
| NG-2 | Multi-language UI | English-only; Ghana primary |
| NG-3 | Returns / refunds workflow | "No returns in MVP"; refunds handled manually by admin for payment-failed edge cases |
| NG-4 | Real variant system (one product, multiple SKUs) | MVP uses separate products with optional `variantGroupId` |
| NG-5 | Subscriptions / recurring billing | Phase 3 |
| NG-6 | Real-time chat buyer ↔ vendor | Use email + contact on storefront |
| NG-7 | AI recommendations | Phase 3; use featured + best-selling |
| NG-8 | SMS / WhatsApp notifications | Phase 2; email only in MVP |
| NG-9 | Pet services booking | Phase 2 |
| NG-10 | Multi-country | Ghana only; FX is for buyer display convenience, not international shipping |

---

## 3. Users & Personas

### 3.1 User Segments

| Segment | Priority | Size estimate (Year 1) |
|---|---|---|
| Buyers — urban dog owners, 22–45, Greater Accra / Ashanti | Primary | 2,000–5,000 |
| Buyers — expatriates in Accra (prefer USD display, card payment) | Secondary | 200–500 |
| Vendors — pet shops, importers, independent sellers | Primary | 10–30 |
| Admin — founder + (later) part-time operator | Internal | 1–2 |

### 3.2 Personas

**Persona A — Ama, Devoted Dog Mom**
- 28, marketing manager in Accra, owns a 2-year-old Golden Retriever.
- Pays with MTN Mobile Money and occasionally a Visa card.
- Wants: a trusted catalog, filter by life stage (adult) and dietary tag (grain-free), read reviews, buy in GHS, track delivery.

**Persona B — Kwame, Pet Shop Owner**
- 35, runs "Kwame's Pet Supplies" in Kumasi, 120 SKUs, sells via WhatsApp today.
- Wants: a simple dashboard on his phone, vendor-managed shipping rates, fast payouts, and a storefront URL he can share on Instagram.

**Persona C — Dogget Official (Benedicta, first-party seller)**
- Seed inventory of 20–30 curated SKUs.
- Sets the quality bar, absorbs early logistics lessons, gets first reviews flowing.

**Persona D — Ekow, Expat Buyer**
- 40, tech worker from the US living in Accra.
- Prefers prices in USD, pays with Visa through Paystack where international card acceptance is enabled, wants international brands (e.g., Royal Canin, Furminator).

**Persona E — Nana, Admin (Founder)**
- Reviews vendor apps within 48h, moderates reviews flagged by users, adjusts FX fallback when API is down, issues promo codes for launch.

### 3.3 User Stories

Priorities: **P0** must ship in MVP; **P1** should ship; **P2** deferred.

| ID | As a ... | I want to ... | So that ... | Priority |
|---|---|---|---|---|
| US-01 | Buyer | browse products by category and subcategory | I find the right kind of food quickly | P0 |
| US-02 | Buyer | filter by brand, price range, life stage, breed size, dietary tag, rating, in-stock | I narrow to exactly the products that fit my dog | P0 |
| US-03 | Buyer | see prices in my preferred currency with clear FX conversion | I do not have to compute exchange rates | P0 |
| US-04 | Buyer | search with autocomplete | I find items by brand or keyword | P0 |
| US-05 | Buyer | read verified-purchase reviews with photos | I trust the product before buying | P0 |
| US-06 | Buyer | add to cart without logging in | I do not hit friction early | P0 |
| US-07 | Buyer | check out as a guest and optionally create an account on the confirmation screen | I convert even if I do not want to register | P0 |
| US-08 | Buyer | pay with Mobile Money or card through Paystack | I use the method I already trust | P0 |
| US-09 | Buyer | save multiple addresses and reuse them | I switch between home and office shipping | P1 |
| US-10 | Buyer | save a payment method (tokenized) | checkout is faster next time | P1 |
| US-11 | Buyer | apply a promo code | I get a discount I received | P1 |
| US-12 | Buyer | buy from multiple vendors in one checkout | I am not forced to pay separately | P0 |
| US-13 | Buyer | track order status per vendor | I know when my package is coming | P0 |
| US-14 | Buyer | leave a review with photo after delivery | I help other owners and reward good vendors | P1 |
| US-15 | Buyer | install Dogget on my home screen | it feels like an app | P0 |
| US-16 | Buyer | browse product pages I have visited while offline | slow mobile connections do not block me | P1 |
| US-17 | Vendor | register and submit my store for approval | I can join the marketplace | P0 |
| US-18 | Vendor | receive a decision within 48h with reason on rejection | I know what to fix | P0 |
| US-19 | Vendor | create, edit, hide, and delete products with up to 6 images | my catalog stays fresh | P0 |
| US-20 | Vendor | set my display currency and shipping rules (flat, by region, free-over) | I control fulfillment economics | P0 |
| US-21 | Vendor | configure fulfillment and delivery terms | I only accept orders I can fulfill safely | P0 |
| US-22 | Vendor | manage orders and update status (processing, shipped, delivered) | buyers stay informed | P0 |
| US-23 | Vendor | reply to a review (once per review) | I can clarify or thank the buyer | P1 |
| US-24 | Vendor | view gross sales, 10% commission, net payout in my dashboard | I understand my earnings | P0 |
| US-25 | Vendor | have a public storefront URL `/vendors/:slug` | I can share it outside Dogget | P1 |
| US-26 | Admin | approve / reject vendor applications | I keep the marketplace trustworthy | P0 |
| US-27 | Admin | moderate products and reviews | I remove abusive content | P0 |
| US-28 | Admin | issue promo codes | I run launch campaigns | P1 |
| US-29 | Admin | override the FX rate if the API fails | pricing does not break during outages | P0 |
| US-30 | Admin | see a dashboard of orders today, GMV, pending approvals | I run the business | P1 |

---

## 4. Functional Requirements

Conventions:
- **FR-X** = functional requirement identifier. Each is testable.
- **P0 / P1 / P2** = priority.
- "Auth" column = which role must be authenticated to invoke. `Public` = no login required. `Guest-ok` = can be invoked anonymously; server treats anonymous session distinctly.

### 4.1 Authentication & Account Management

| ID | Requirement | Priority | Auth | Notes |
|---|---|---|---|---|
| FR-A01 | Register with email + password via Firebase Auth | P0 | Public | Client uses Firebase SDK; server creates `User` row on first `/users/me` call with valid ID token. |
| FR-A02 | Sign in with email + password | P0 | Public | Firebase SDK; ID token returned; client caches. |
| FR-A03 | Sign in with Google | P0 | Public | Firebase Google provider. |
| FR-A04 | Send password reset email | P0 | Public | Firebase `sendPasswordResetEmail`. |
| FR-A05 | Role assignment at registration: CUSTOMER (default) or VENDOR | P0 | Public | If VENDOR selected, user is routed to vendor onboarding; their `Vendor` row starts `approved=false`. |
| FR-A06 | Admin role assigned only via backend (direct DB or admin-only endpoint) | P0 | Admin | No UI for self-upgrade to Admin. |
| FR-A07 | Server verifies Firebase ID token on every protected API call using Firebase Admin SDK | P0 | Server | Middleware `verifyFirebaseToken` decodes token; loads `User` by `firebaseUid`; attaches to request. |
| FR-A08 | Client keeps token fresh via Firebase `onIdTokenChanged` | P0 | Client | Zustand `authStore` mirrors current ID token. |
| FR-A09 | Logout clears client token cache and Zustand state | P0 | Auth | Also clears cart-sync throttle. |
| FR-A10 | Protected client routes gate by role | P0 | Client | `/cart` guest-ok; `/checkout` requires checkout session (guest ok); `/profile`, `/orders`, `/wishlist` require auth; `/vendor/*` requires role = VENDOR; `/admin/*` requires role = ADMIN. |
| FR-A11 | Email not verified banner (non-blocking in MVP) | P2 | Auth | Firebase sends verification mail; reviews/orders still allowed. Tightened in Phase 2. |
| FR-A12 | Session persistence: survives browser restart | P0 | Auth | Firebase local persistence. |
| FR-A13 | Rate-limit password reset and registration at API gateway | P0 | Public | 5 req / 15 min / IP. |

### 4.2 Product Catalog, Filters, Search, Sorting, Discovery

#### 4.2.1 Product Fields (first-class)

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | uuid | yes | PK |
| `vendorId` | uuid (FK → Vendor) | yes | |
| `name` | string, 3–120 chars | yes | |
| `slug` | string, unique | yes | Auto-generated from name + short random suffix |
| `description` | rich text (markdown) | yes | Rendered with safe MD renderer |
| `brief` | string, ≤ 160 chars | yes | Shown on product cards |
| `brandId` | uuid (FK → Brand) | yes | |
| `categoryId` | uuid (FK → Category) | yes | Pet Food / Health / Grooming / Accessories (extensible) |
| `subcategoryId` | uuid (FK → Subcategory) | no | e.g., Kibble / Wet Food / Treats / Supplements |
| `priceAmount` | int (minor units) | yes | e.g., GHS 25.00 → 2500 |
| `priceCurrency` | enum Currency | yes | GHS / USD / EUR / NGN |
| `sizeLabel` | string | yes | "5kg", "12lb", "1pc" |
| `images` | ProductImage[] (1–6) | yes | Cloudinary URLs |
| `petLifeStage` | enum PetLifeStage | yes | PUPPY / ADULT / SENIOR / ALL |
| `breedSize` | enum BreedSize[] | yes | SMALL, MEDIUM, LARGE, GIANT, ALL (multi-select) |
| `dietaryTags` | enum DietaryTag[] | no | GRAIN_FREE, HYPOALLERGENIC, HIGH_PROTEIN, LOW_FAT, NATURAL, ORGANIC, PRESCRIPTION, WEIGHT_MANAGEMENT |
| `inventory` | int, ≥ 0 | yes | 0 ⇒ Out of stock |
| `lowStockThreshold` | int | no | Default 5; vendor sees warning |
| `variantGroupId` | uuid | no | Optional; links related size/flavor variants for display |
| `averageRating` | float (denormalized) | computed | 0–5, null when no reviews |
| `reviewCount` | int (denormalized) | computed | |
| `isActive` | boolean | yes | Vendor hides without delete |
| `isFeatured` | boolean | no | Admin-set; drives "Featured" sort |
| `searchVector` | tsvector (generated) | yes | Name + brief + description + brand.name + tags — English config |
| `createdAt`, `updatedAt` | timestamp | yes | |

#### 4.2.2 Catalog Listing (Shop page)

| ID | Requirement | Priority | Auth | Notes |
|---|---|---|---|---|
| FR-C01 | List products paginated (20/page) via `GET /products` | P0 | Public | Returns items + `pagination {page, pageSize, total, totalPages}`. |
| FR-C02 | Filter by one or more categories | P0 | Public | `category=slug` repeatable or `categoryIds=[]`. |
| FR-C03 | Filter by subcategory (dependent on category) | P0 | Public | UI dropdown collapses when no category selected. |
| FR-C04 | Filter by brand (multi-select) | P0 | Public | `brandIds=[]`. |
| FR-C05 | Filter by price range (min, max) in buyer's preferred currency | P0 | Public | API converts range to product's currency via today's FX before querying. |
| FR-C06 | Filter by pet life stage | P0 | Public | |
| FR-C07 | Filter by breed size (multi) | P0 | Public | Array containment; `ALL` matches any. |
| FR-C08 | Filter by dietary tags (multi) | P0 | Public | Array containment. |
| FR-C09 | Filter by minimum rating | P0 | Public | `minRating=4` → products with avg ≥ 4. |
| FR-C10 | In-stock only toggle | P0 | Public | `inStockOnly=true` → `inventory > 0`. |
| FR-C11 | Vendor filter (chip list) | P1 | Public | Shown when not on a vendor storefront. |
| FR-C12 | Sort: Featured (default) / Price ↑↓ / Newest / Best-selling / Highest-rated / Name A–Z | P0 | Public | Best-selling uses 30-day `order_items` count. |
| FR-C13 | Applied filters visible as removable chips above grid | P0 | Client | "Clear all" action. |
| FR-C14 | Filter drawer on mobile (slide-up sheet); sidebar on ≥ md | P0 | Client | Uses Framer Motion. |
| FR-C15 | Empty state when no products match | P0 | Client | CTA: "Clear filters" / "Browse All". |
| FR-C16 | Skeleton loaders while fetching | P0 | Client | Avoid CLS. |
| FR-C17 | URL state: all filters + sort + page encoded in query string | P0 | Client | Deep-linkable, back/forward works. |
| FR-C18 | Respect buyer's currency preference everywhere prices show | P0 | Client | Converts display at render time; stored rate shown on tooltip. |

#### 4.2.3 Search

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| FR-S01 | Header search bar autocompletes (debounce 250ms, min 2 chars) | P0 | `GET /products/search/suggest?q=...` returns top 5 {id, name, thumbnail, price}. |
| FR-S02 | Submit → `/shop?q=...` server-side FTS | P0 | `tsvector` on name + brief + description + brand + tags (weighted A/B/C). |
| FR-S03 | Query highlighted in results | P1 | `ts_headline` or client-side highlight. |
| FR-S04 | Queries logged to `SearchQueryLog` (userId nullable, q, resultsCount, timestamp) | P1 | Vendor insights in Phase 2. |
| FR-S05 | Zero-result state suggests top categories + popular products | P0 | |
| FR-S06 | Typo tolerance via `pg_trgm` similarity fallback when FTS returns < 3 | P1 | `SIMILARITY(name, q) > 0.3`. |

#### 4.2.4 Discovery surfaces (Home)

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| FR-D01 | Homepage hero banner (admin-configurable promo card) | P0 | Bannersource: admin-set `HomeBanner` or fallback to static. |
| FR-D02 | Category carousel | P0 | Existing `CategoriesSection`. |
| FR-D03 | Recommended products | P0 | MVP = most recent + featured; no personalization. |
| FR-D04 | Trust section (badges: verified vendors, Paystack, secure checkout) | P0 | Existing `TrustSection`. |
| FR-D05 | CTA section (email capture → Resend contact list, optional) | P1 | Nice-to-have. |
| FR-D06 | Ad section (internal promo slot, admin-set) | P1 | No third-party ads in MVP. |

### 4.3 Product Detail Page

Route: `/products/:slug`

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| FR-P01 | Hero: up to 6 images in swipeable gallery (Swiper), pinch-zoom on tap | P0 | Cloudinary `f_auto,q_auto,w_800`. |
| FR-P02 | Title, brief, price (converted to buyer currency), size label | P0 | |
| FR-P03 | Vendor badge with link to `/vendors/:slug` | P0 | |
| FR-P04 | Stock status: In stock / Only N left (if ≤ lowStockThreshold) / Out of stock | P0 | |
| FR-P05 | Quantity stepper (1 to min(inventory, 10)) | P0 | |
| FR-P06 | Add to Cart + Buy Now buttons | P0 | Buy Now goes straight to checkout with a one-item cart. |
| FR-P07 | Wishlist heart toggle | P0 | Auth required to save server-side; else local. |
| FR-P08 | Rich description (markdown render) | P0 | `react-markdown`; sanitize. |
| FR-P09 | Attributes section (life stage, breed size, dietary tags, brand) | P0 | Pill chips. |
| FR-P10 | Rating summary + distribution histogram (5/4/3/2/1 star bars with counts) | P0 | Pulled from `reviews`. |
| FR-P11 | Paginated reviews (10/page), newest first by default; sort by Highest / Lowest / Newest | P0 | Shows verified badge, reviewer first name + initial, photo if present, vendor reply. |
| FR-P12 | Related products (same category, different product, top 8) | P1 | |
| FR-P13 | Variant group links (if `variantGroupId` present, show sibling variants as size chips) | P1 | |
| FR-P14 | Share button (Web Share API fallback to copy link) | P1 | |
| FR-P15 | "Shipping & Returns" accordion showing vendor's shipping rules and return policy | P0 | Computed from Vendor settings. |
| FR-P16 | Breadcrumb: Home › Category › Subcategory › Product | P1 | |

### 4.4 Cart

The cart is **local-first**: source of truth is `localStorage` (key `dogget.cart.v1`) until login, then it syncs with the server.

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| FR-CT01 | Add to cart stores {productId, vendorId, quantity, priceSnapshot, currency} in Zustand + localStorage | P0 | Price snapshot is informational; server recomputes at checkout. |
| FR-CT02 | Cart icon badge shows item count | P0 | |
| FR-CT03 | Cart page shows items grouped by vendor with per-vendor subtotal and shipping estimate | P0 | Prepares buyer for split-order. |
| FR-CT04 | Quantity +/− respects inventory; hitting 0 removes item | P0 | |
| FR-CT05 | Remove item action | P0 | |
| FR-CT06 | Save for later (moves to wishlist) | P1 | |
| FR-CT07 | On login, client calls `POST /cart/sync` with local items; server merges by max(qty) per product | P0 | Reconciliation: if a product is now inactive or out of stock, it is dropped with a toast. |
| FR-CT08 | Cart persists for 30 days locally; server cart never expires | P0 | |
| FR-CT09 | Price / currency drift warning: if product's current price differs from snapshot by > 5%, show inline notice | P1 | |
| FR-CT10 | Proceed to Checkout button disabled if cart empty or all items out of stock | P0 | |

### 4.5 Wishlist

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| FR-W01 | Authenticated users can toggle wishlist on any product | P0 | `POST /wishlist` / `DELETE /wishlist/:productId`. |
| FR-W02 | Guest wishlist stored locally; merged on login (union) | P1 | |
| FR-W03 | Wishlist page shows grid of saved products with "Move to cart" | P1 | |
| FR-W04 | Wishlist count badge on bottom nav icon when > 0 | P2 | |
| FR-W05 | Wishlist item that becomes inactive shows "No longer available" overlay | P1 | |

### 4.6 Checkout

Route: `/checkout`

#### 4.6.1 Flow summary

1. Buyer clicks Checkout in cart.
2. Server creates a `CheckoutSession` (ephemeral, 30-min TTL) snapshotting items + prices + FX rate + shipping address placeholder.
3. Buyer enters or selects shipping address (guest enters inline; logged-in picks from saved).
4. Server groups items by vendor → splits into N pending orders; computes per-vendor shipping per vendor's rules.
5. Buyer optionally enters promo code; server validates and applies discount (per-vendor or cart-wide per code config).
6. Server adds VAT (15%) line per vendor order on eligible items (rule: all product sales are VAT-able in MVP).
7. Buyer selects Pay online. Paystack presents the enabled online channels (for example Mobile Money and Card) inside its Checkout UI.
8. Server initializes a Paystack transaction with total; buyer completes payment in Paystack Popup / redirect.
9. Webhook confirms payment → all child orders flip to PAID.
10. Confirmation screen shown; guest buyer offered "Create an account" with pre-filled info.
11. Confirmation emails sent to buyer and each vendor.

#### 4.6.2 Requirements

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| FR-CO01 | Guest checkout allowed; email + phone required | P0 | |
| FR-CO02 | Logged-in buyers pick from saved addresses or add new | P0 | |
| FR-CO03 | Shipping address fields: fullName, phone, line1, line2, city, region (dropdown of Ghana regions), country (default Ghana), notes | P0 | Validation with Zod. |
| FR-CO04 | Buyer selects shipping region; each vendor's shipping rate recomputed | P0 | |
| FR-CO05 | Cross-vendor cart split displayed as N sub-orders with per-vendor totals | P0 | |
| FR-CO06 | VAT 15% shown as separate line per sub-order | P0 | |
| FR-CO07 | Promo code entry validates and shows accepted discount amount | P1 | Server-validated; once applied, stored in CheckoutSession. |
| FR-CO08 | Payment method is Paystack-only for launch | P0 | COD is deferred until Dogget has a collection/remittance process. |
| FR-CO09 | On payment init, CheckoutSession marked `LOCKED`; any cart mutation post-lock rejects | P0 | |
| FR-CO10 | If payment pop-up closed / fails, CheckoutSession stays valid 30 min; buyer can retry | P0 | |
| FR-CO11 | Order confirmation page shows order numbers (one per vendor), totals, expected delivery window per vendor | P0 | |
| FR-CO12 | Confirmation offers "Create account" (email pre-filled) and "View my orders" (if logged in) | P0 | Guest gets magic link via email if they skip. |
| FR-CO13 | Server stores FX rate used for display-currency conversion on the order itself (`fxRate`, `displayCurrency`) | P0 | For receipts and dispute. |
| FR-CO14 | Checkout requires network; offline mode shows clear "Reconnect to checkout" screen | P0 | |
| FR-CO15 | Abandoned CheckoutSession TTL = 30 min; cron cleans up | P0 | |
| FR-CO16 | Server double-checks inventory at order creation; on shortfall, returns 409 with affected items | P0 | UI shows: "Item X is now out of stock". |

### 4.7 Payments

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| FR-PM01 | Paystack Popup / Redirect integration for cards + Mobile Money (MTN, Vodafone/Telecel, AirtelTigo) in GHS | P0 | Transaction initialized server-side; Paystack Checkout presents enabled channels. |
| FR-PM02 | Paystack international card acceptance for eligible customers | P0 | Requires Paystack international payments enabled/approved for the Dogget business. Ghana settlement remains GHS unless Paystack enables otherwise. |
| FR-PM03 | All online payment verifications are server-side via Paystack webhook `charge.success` and verify endpoint | P0 | Idempotent handlers keyed by provider transaction id/reference. |
| FR-PM04 | Webhook signature verified with Paystack secret | P0 | |
| FR-PM05 | Payment total = sum of all sub-order totals (items + shipping + VAT − discount) in buyer's display currency | P0 | Paystack requires GHS → if buyer display is non-GHS, convert total to GHS using frozen FX. |
| FR-PM06 | On successful payment, all sub-orders move PENDING → PAID atomically | P0 | DB transaction. |
| FR-PM07 | On failed payment, sub-orders stay PENDING; buyer sees error; retry available | P0 | |
| FR-PM08 | Cash on Delivery is not available at launch | P0 | Revisit after delivery operations, cash collection, vendor remittance, and dispute handling are defined. |
| FR-PM09 | Saved cards: Paystack tokenization (`authorization_code`) stored encrypted; allow one-click reuse | P1 | Feature-flagged; PCI out of scope because token is handled by Paystack. |
| FR-PM10 | Refunds: manual-only in MVP, initiated by admin via Paystack dashboard; audit logged | P0 | No UI for buyer refund requests. |
| FR-PM11 | Payment receipt email with itemized breakdown and FX disclosure | P0 | |
| FR-PM12 | Payout to vendor: commission (10%) deducted; vendor sees Gross / Commission / Net in dashboard; actual payout is manual in MVP (admin initiates bank/MoMo transfer weekly) | P0 | `PayoutRun` and `PayoutLine` tables track this. |
| FR-PM13 | Reconciliation page for admin: daily Paystack totals vs. sum of PAID orders | P1 | |

### 4.8 Orders & Order Lifecycle

#### 4.8.1 Status model

**Online payment path** (Paystack):

`PENDING` → `PAID` → `PROCESSING` → `SHIPPED` → `DELIVERED`
                          ↓                               ↑
                    `CANCELLED` (pre-shipment, refund)    |
                                                          |
                                                    (no returns in MVP)

Transitions:

| From | To | Actor | Trigger |
|---|---|---|---|
| — | PENDING | System | Order created at checkout |
| PENDING | PAID | System | Paystack webhook OK |
| PAID | PROCESSING | Vendor | "Acknowledge / Start fulfilling" |
| PROCESSING | SHIPPED | Vendor | "Mark shipped" + optional tracking |
| SHIPPED | DELIVERED | Vendor / Buyer | Vendor marks delivered or buyer confirms |
| PENDING/PAID/PROCESSING | CANCELLED | Admin or Vendor | Pre-shipment only; refund required for PAID |
| SHIPPED or later | CANCELLED | — | Not allowed in MVP |

#### 4.8.2 Requirements

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| FR-O01 | One Order per vendor (split-order); buyer sees "Order DOG-00012 (3 orders)" grouping | P0 | Parent `OrderGroup` (uuid) to keep sibling orders linked. |
| FR-O02 | Each Order has immutable `OrderItem` snapshot (productId, name, sizeLabel, unitAmount, currency, qty) | P0 | Future product edits do not change historical orders. |
| FR-O03 | Order stores `fxRate`, `displayCurrency`, `vendorCurrency` | P0 | For receipts. |
| FR-O04 | Buyer order list at `/orders`; detail at `/orders/:id`; groups displayed as parent with per-vendor child cards | P0 | |
| FR-O05 | Vendor order list at `/vendor/orders` with filters by status | P0 | |
| FR-O06 | Vendor can update status per transitions above; invalid transitions reject with 422 | P0 | |
| FR-O07 | Vendor can attach tracking info (carrier + tracking number + URL) on SHIPPED transition | P1 | Included in email. |
| FR-O08 | Admin can force-cancel any pre-shipment order | P0 | Requires reason; audit logged. |
| FR-O09 | Buyer can cancel a PENDING order from order detail (rare; usually auto-cancel) | P1 | |
| FR-O10 | Orders with status = PENDING for > 2h are auto-cancelled by cron | P0 | |
| FR-O11 | Order detail page prints receipt (browser print CSS) | P1 | |

### 4.9 Reviews & Ratings

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| FR-R01 | Only buyers with an order of status DELIVERED containing the product can write a review | P0 | Server enforces. |
| FR-R02 | One review per {userId, productId}; edit allowed within 30 days | P0 | |
| FR-R03 | Review fields: rating 1–5, title (optional, ≤ 80 chars), body (optional, ≤ 1000 chars), photos (0–3 Cloudinary URLs) | P0 | |
| FR-R04 | Vendor can post one public reply per review (≤ 500 chars) | P1 | |
| FR-R05 | Admin can hide / unhide / delete reviews; hidden reviews excluded from averages | P0 | |
| FR-R06 | Product `averageRating` and `reviewCount` denormalized; recalculated on review create/update/delete/moderate via DB trigger or app-level hook | P0 | |
| FR-R07 | Histogram cached on product; re-computed with each review change | P1 | |
| FR-R08 | Users can flag a review as abusive → adds to admin moderation queue | P1 | |
| FR-R09 | "Review my order" CTA email 3 days after DELIVERED | P1 | |

### 4.10 User Profile / Pawfile

Route: `/profile`

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| FR-U01 | Show avatar, name, email, phone, role | P0 | |
| FR-U02 | Addresses CRUD; set default | P0 | At least 1 address required for checkout. |
| FR-U03 | Saved payment methods list (Paystack tokens); remove action | P1 | |
| FR-U04 | Order history with status pill, thumbnail, vendor name, total | P0 | |
| FR-U05 | Wishlist tab (or link to `/wishlist`) | P1 | |
| FR-U06 | Edit profile (name, phone, avatar upload to Cloudinary) | P0 | |
| FR-U07 | Change password (Firebase reauth) | P1 | |
| FR-U08 | Delete account flow (soft-delete in MVP: `User.deletedAt` set; PII scrubbed; orders kept for records) | P1 | |
| FR-U09 | "Pawfile" is just a branded name for this profile; dog-specific fields deferred to Phase 2 | P0 | Documented to avoid scope creep. |

### 4.11 Vendor Module

#### 4.11.1 Registration & Approval

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| FR-V01 | Vendor registers with storeName, storeSlug (auto), description, contactEmail, contactPhone, displayCurrency, region, logo (Cloudinary), businessType (Individual / Registered) | P0 | Initial `approved=false`. |
| FR-V02 | Admin sees Pending Vendors queue with approve/reject + reason textarea | P0 | |
| FR-V03 | Email notifications on decision | P0 | |
| FR-V04 | Vendor cannot create/publish products until approved | P0 | Can draft, but `isActive` forced false. |

#### 4.11.2 Dashboard

Route: `/vendor`

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| FR-V10 | Overview cards: Today's orders, 7d orders, 30d GMV, pending orders count, low-stock count | P0 | |
| FR-V11 | Products table with actions (new, edit, hide, delete, bulk activate/deactivate) | P0 | |
| FR-V12 | Product editor form: all fields in 4.2.1; image uploader (Cloudinary direct, signed upload) | P0 | Zod validation. |
| FR-V13 | Orders table, filter by status, open detail | P0 | |
| FR-V14 | Order detail: status transition buttons per 4.8; buyer's name + phone + shipping address; tracking entry; internal notes | P0 | |
| FR-V15 | Storefront settings: shipping rule (flat / by-region / free-over-threshold), display currency, shipping regions served, return policy text (display only; no workflow in MVP) | P0 | |
| FR-V16 | Payouts: view Gross, Commission (10%), Net; recent payout runs list | P0 | |
| FR-V17 | Reviews moderation (reply only; flag for admin) | P1 | |
| FR-V18 | Storefront preview: "View my storefront" opens `/vendors/:slug` | P1 | |

#### 4.11.3 Storefront

Route: `/vendors/:slug`

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| FR-V20 | Public page: vendor logo, name, description, rating avg, review count, region, shipping summary | P0 | |
| FR-V21 | Grid of vendor's active products with filters (category, price, rating, in-stock) | P0 | |
| FR-V22 | Direct vendor contact links (mailto / phone / WhatsApp) | Deferred post-MVP | **Not exposed in MVP.** Vendor identity remains visible for trust, but buyer communication and conversion should stay on-platform to reduce off-Dogget leakage. |

### 4.12 Admin Panel

Route: `/admin`

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| FR-AD01 | Dashboard: today orders, 30d GMV, active vendors, pending approvals count, open review flags | P1 | |
| FR-AD02 | Vendor approval queue (approve/reject + reason) | P0 | |
| FR-AD03 | All products table with filters (vendor, category, isActive, flagged) — deactivate/delete/force-feature | P0 | |
| FR-AD04 | All orders table with filters (status, vendor, buyer, date range) — view detail, force-cancel | P0 | |
| FR-AD05 | All users table — view, ban (set `User.isBanned=true`, blocks login), role change (to/from VENDOR or ADMIN) | P1 | |
| FR-AD06 | Categories & brands CRUD | P0 | |
| FR-AD07 | Promo codes CRUD — type (PERCENT / FIXED / FREE_SHIPPING), value, minOrderAmount, maxUses, perUserLimit, startsAt, endsAt, appliesTo (ALL / CATEGORY / VENDOR), isActive | P1 | |
| FR-AD08 | Reviews moderation queue (flagged + recent); hide/delete with reason | P0 | |
| FR-AD09 | FX manual override: admin sets fallback rates per currency pair; used when live fetch fails | P0 | |
| FR-AD10 | Audit log view: who did what and when | P1 | Filterable. |
| FR-AD11 | Payout run: admin generates weekly run, reviews per-vendor net, marks each line paid after external transfer | P0 | |

### 4.13 Notifications (Email)

Provider: **Resend** (React Email templates). Fallback: SendGrid.

| Event | To | Template |
|---|---|---|
| Order placed | Buyer | `order-placed.tsx` — items, totals, expected delivery window per vendor |
| New order received | Vendor | `vendor-new-order.tsx` — buyer's shipping info, items, net payout estimate |
| Payment confirmed | Buyer + Vendor | `payment-confirmed.tsx` |
| Order shipped | Buyer | `order-shipped.tsx` — tracking if any |
| Order delivered | Buyer | `order-delivered.tsx` — review CTA |
| Order cancelled | Buyer + Vendor | `order-cancelled.tsx` |
| Vendor registered | Admin | `vendor-pending.tsx` |
| Vendor approved | Vendor | `vendor-approved.tsx` |
| Vendor rejected | Vendor | `vendor-rejected.tsx` (with reason) |
| Password reset | User | Firebase default |
| Review posted | Vendor | `vendor-new-review.tsx` |
| Review reply | Buyer | `review-reply.tsx` |
| Promo issued | Buyer (segmented) | `promo-issued.tsx` — P2 for MVP |

**Requirements**

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| FR-N01 | All transactional emails sent within 5s of triggering event | P0 | Async queue (in-process BullMQ or just awaited send with fire-and-forget + Sentry on failure). |
| FR-N02 | Unsubscribe link on marketing emails; transactional emails exempt per CAN-SPAM best practice | P1 | |
| FR-N03 | Email templates use Dogget brand tokens (orange, coral, Quicksand) | P0 | |
| FR-N04 | Failure to send email does not fail the transaction | P0 | Log + retry via cron. |
| FR-N05 | Phase 2: Hubtel SMS + WhatsApp Business API | P2 (future) | Schema supports a `Notification.channel` field to avoid migration later. |

### 4.14 PWA Behaviors

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| FR-PWA01 | `manifest.webmanifest` with `name`, `short_name`, `theme_color` `#f4a52c`, `background_color` `#ffffff`, `display: standalone`, `start_url: /home`, icons 192, 512, maskable | P0 | |
| FR-PWA02 | Service worker via `vite-plugin-pwa` (Workbox) with strategies: | P0 | |
| — | App shell: StaleWhileRevalidate | | |
| — | Product images (Cloudinary): CacheFirst, maxAgeSeconds=30d, maxEntries=200 | | |
| — | API GET `/products`, `/categories`, `/brands`: NetworkFirst, timeout 3s, cache TTL 24h | | |
| — | API writes (POST/PATCH/DELETE): NetworkOnly | | |
| FR-PWA03 | Offline fallback page `/offline.html` with cached logo + retry button | P0 | |
| FR-PWA04 | Global offline banner when `navigator.onLine === false` | P0 | |
| FR-PWA05 | "New version available" toast on service worker `waiting`; click to `skipWaiting()` and reload | P0 | |
| FR-PWA06 | Install prompt deferred; show custom "Install Dogget" after 2 visits | P1 | |
| FR-PWA07 | Web Push — Phase 2 (service worker structured to allow later addition) | P2 | |

### 4.15 Multi-Currency & FX

#### 4.15.1 Model

- **Vendors list in their `displayCurrency`.** That price is the "authoritative" price for settlement.
- **Buyers have a `preferredCurrency`** (defaulted by IP-geo: GH → GHS, else USD). Settable in profile / currency dropdown in header.
- **Daily FX rates** fetched from `exchangerate.host` (free tier) at 00:00 UTC and stored in `FxRate` table. Rates are `base → quote` amount; only the pairs we need (GHS ↔ USD, EUR, NGN) are cached.
- **Display conversion** at render time uses today's rate: shown as "GHS 120.00 (≈ $9.60)" on cards, with a tooltip "Indicative rate; charged in seller's currency".
- **At checkout**, the rate is **frozen** into `CheckoutSession.fxRate` and carried through to each resulting `Order.fxRate`. This rate is what the buyer is charged.
- **Vendor is always paid out in their own currency** at their listed amount (minus 10% commission). FX risk is borne by the platform between charge and payout, which in MVP is minimal because payout is typically GHS → GHS.

#### 4.15.2 Requirements

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| FR-FX01 | Cron fetches rates daily; on success, upsert `FxRate`; on failure, alert Sentry | P0 | |
| FR-FX02 | Admin can manually override a rate (e.g., during API outage) via admin panel | P0 | Audit logged. |
| FR-FX03 | All price displays show conversion when buyer currency ≠ product currency | P0 | |
| FR-FX04 | Rate used at checkout is frozen and shown on receipts | P0 | |
| FR-FX05 | Paystack charges must be in GHS; server converts total to GHS for Paystack if needed using frozen rate | P0 | |
| FR-FX06 | Online checkout charges through Paystack in GHS for MVP; non-GHS buyer displays are converted to a frozen GHS charge amount | P0 | International card acceptance depends on Paystack approval. |
| FR-FX07 | Buyer currency choice persisted in `localStorage` and server profile | P0 | |

#### 4.15.3 VAT

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| FR-TX01 | VAT rate 15% applied to all product subtotals per Order (split by vendor) | P0 | Rate stored in `Order.vatRate` for auditability. |
| FR-TX02 | VAT shown as separate line at checkout and on receipt | P0 | |
| FR-TX03 | Non-taxable items in Phase 2 (e.g., medical prescriptions) have `Product.taxExempt` flag | P2 | Reserve the field in schema. |

---

## 5. Non-Functional Requirements

| ID | Category | Requirement | Target / Measure |
|---|---|---|---|
| NFR-01 | Performance | LCP (p75, mobile 3G) | ≤ 2.5s |
| NFR-02 | Performance | INP (p75) | ≤ 200ms |
| NFR-03 | Performance | CLS | ≤ 0.1 |
| NFR-04 | Performance | Lighthouse mobile Perf / A11y / Best / SEO | ≥ 85 / 90 / 90 / 90 |
| NFR-05 | Performance | Product image payload | Cloudinary `f_auto,q_auto`, responsive `srcset`, eager only for above-the-fold |
| NFR-06 | Performance | API p95 latency (non-search) | ≤ 300ms |
| NFR-07 | Performance | Search p95 latency | ≤ 500ms |
| NFR-08 | Security | HTTPS everywhere | TLS 1.2+, HSTS 6 months |
| NFR-09 | Security | All protected endpoints verify Firebase ID token server-side | 100% |
| NFR-10 | Security | OWASP Top 10 covered (XSS, CSRF, SQLi, SSRF, auth) | `helmet`, Prisma parameterization, `dompurify` on rich text render, CSRF not needed for token auth but enforced on cookie-based flows (admin) |
| NFR-11 | Security | No PCI scope: card data never touches our server | Paystack Checkout handles card/mobile money entry |
| NFR-12 | Security | Input validation on every endpoint (Zod) | Reject 400 on invalid |
| NFR-13 | Security | Rate limiting: 60 req/min per IP on `/products*`, 20 req/min on `/auth/*`, 10 req/min on `/checkout/*` | Fastify rate-limit plugin |
| NFR-14 | Security | Secrets in env vars only; never in client bundle except `VITE_*` safe keys | Enforced via CI check |
| NFR-15 | Accessibility | WCAG 2.1 AA | keyboard nav, focus rings, ARIA labels, 4.5:1 contrast |
| NFR-16 | Accessibility | All forms have labels + error messages announced by screen reader | tested with VoiceOver + NVDA |
| NFR-17 | Browser support | Chrome 110+, Safari 15+, Firefox 110+, Edge 110+ | PWA install on Chrome/Edge/Android; Safari supports manifest & SW |
| NFR-18 | Mobile | Touch target ≥ 44x44 px | |
| NFR-19 | Scalability | Support 100 concurrent users at launch, 1000 at day-90 | Vercel + Railway scale tier |
| NFR-20 | Reliability | Uptime | 99.5% monthly |
| NFR-21 | Data privacy | Ghana Data Protection Act compliance | Privacy Policy + DSR request flow via email |
| NFR-22 | Data privacy | Minimal PII, no sale of data to third parties | |
| NFR-23 | Observability | Sentry (client + server); Plausible for analytics; structured logs (JSON) | |
| NFR-24 | Backups | Managed Postgres automated daily backups; 7-day retention | Neon point-in-time restore (7d free / 30d paid) |
| NFR-25 | Internationalization readiness | UI copy via a simple dictionary module (`src/i18n/en.ts`) to enable Phase 2 locales | |
| NFR-26 | SEO | Pre-rendered meta tags per product/vendor/category | `vite-plugin-ssg` for critical pages OR server-side injection in Phase 2 |
| NFR-27 | Cost guard | Cloudinary bandwidth alerts at 50%/80% of free tier | |

---

## 6. Data Requirements & Full Prisma Schema

> All monetary values are stored in **minor units as integers** (e.g., GHS 12.34 → `1234`). All timestamps are UTC.

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
  previewFeatures = ["fullTextSearchPostgres"]
}

// ---------- Enums ----------

enum UserRole {
  CUSTOMER
  VENDOR
  ADMIN
}

enum Currency {
  GHS
  USD
  EUR
  NGN
}

enum PetLifeStage {
  PUPPY
  ADULT
  SENIOR
  ALL
}

enum BreedSize {
  SMALL
  MEDIUM
  LARGE
  GIANT
  ALL
}

enum DietaryTag {
  GRAIN_FREE
  HYPOALLERGENIC
  HIGH_PROTEIN
  LOW_FAT
  NATURAL
  ORGANIC
  PRESCRIPTION
  WEIGHT_MANAGEMENT
}

enum OrderStatus {
  PENDING
  PAID
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

enum PaymentProvider {
  PAYSTACK
}

enum PaymentStatus {
  INITIATED
  SUCCEEDED
  FAILED
  REFUNDED
}

enum ShippingRule {
  FLAT
  BY_REGION
  FREE_OVER_THRESHOLD
}

enum PromoType {
  PERCENT
  FIXED
  FREE_SHIPPING
}

enum NotificationChannel {
  EMAIL
  SMS
  WHATSAPP
  PUSH
}

enum NotificationStatus {
  QUEUED
  SENT
  FAILED
}

// ---------- Core ----------

model User {
  id             String    @id @default(uuid())
  firebaseUid    String    @unique
  email          String    @unique
  name           String?
  phone          String?
  avatarUrl      String?
  role           UserRole  @default(CUSTOMER)
  preferredCurrency Currency @default(GHS)
  isBanned       Boolean   @default(false)
  emailVerified  Boolean   @default(false)
  deletedAt      DateTime?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  vendor         Vendor?
  addresses      Address[]
  paymentMethods PaymentMethod[]
  orders         Order[]
  reviews        Review[]
  wishlistItems  WishlistItem[]
  notifications  Notification[]
  auditLogs      AuditLog[]

  @@index([role])
  @@index([email])
}

model Address {
  id         String  @id @default(uuid())
  user       User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId     String
  label      String? // "Home", "Office"
  fullName   String
  phone      String
  line1      String
  line2      String?
  city       String
  region     String  // Ghana region
  country    String  @default("GH")
  isDefault  Boolean @default(false)
  createdAt  DateTime @default(now())

  @@index([userId])
}

model PaymentMethod {
  id         String  @id @default(uuid())
  user       User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId     String
  provider   PaymentProvider
  tokenRef   String  // Paystack authorization_code (encrypted at rest)
  brand      String?
  last4      String?
  expMonth   Int?
  expYear    Int?
  isDefault  Boolean @default(false)
  createdAt  DateTime @default(now())

  @@index([userId])
}

// ---------- Vendor & Catalog ----------

model Vendor {
  id              String    @id @default(uuid())
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId          String    @unique
  storeName       String
  slug            String    @unique
  description     String?
  contactEmail    String
  contactPhone    String?
  logoUrl         String?
  displayCurrency Currency  @default(GHS)
  region          String?   // primary region
  businessType    String?   // "Individual" / "Registered"
  shippingRule    ShippingRule @default(FLAT)
  shippingConfig  Json      // flat rate, by-region map, threshold etc.
  returnPolicy    String?
  approved        Boolean   @default(false)
  approvedAt      DateTime?
  rejectedReason  String?
  isFeatured      Boolean   @default(false)
  averageRating   Float?
  reviewCount     Int       @default(0)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  products        Product[]
  orders          Order[]
  payoutLines     PayoutLine[]

  @@index([approved, isFeatured])
  @@index([slug])
}

model Brand {
  id        String    @id @default(uuid())
  name      String    @unique
  slug      String    @unique
  logoUrl   String?
  products  Product[]
  createdAt DateTime  @default(now())
}

model Category {
  id           String        @id @default(uuid())
  name         String        @unique
  slug         String        @unique
  imageUrl     String?
  sortOrder    Int           @default(0)
  subcategories Subcategory[]
  products     Product[]
  createdAt    DateTime      @default(now())
}

model Subcategory {
  id         String   @id @default(uuid())
  category   Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  categoryId String
  name       String
  slug       String
  products   Product[]
  createdAt  DateTime @default(now())

  @@unique([categoryId, slug])
  @@index([categoryId])
}

model Product {
  id                 String        @id @default(uuid())
  vendor             Vendor        @relation(fields: [vendorId], references: [id], onDelete: Cascade)
  vendorId           String
  name               String
  slug               String        @unique
  description        String
  brief              String
  brand              Brand         @relation(fields: [brandId], references: [id])
  brandId            String
  category           Category      @relation(fields: [categoryId], references: [id])
  categoryId         String
  subcategory        Subcategory?  @relation(fields: [subcategoryId], references: [id])
  subcategoryId      String?
  priceAmount        Int
  priceCurrency      Currency
  sizeLabel          String
  petLifeStage       PetLifeStage  @default(ALL)
  breedSize          BreedSize[]
  dietaryTags        DietaryTag[]
  inventory          Int           @default(0)
  lowStockThreshold  Int           @default(5)
  variantGroupId     String?
  isActive           Boolean       @default(true)
  isFeatured         Boolean       @default(false)
  taxExempt          Boolean       @default(false)
  averageRating      Float?
  reviewCount        Int           @default(0)
  // Full-text search column generated from name + brief + description + brand + tags
  searchVector       Unsupported("tsvector")?
  createdAt          DateTime      @default(now())
  updatedAt          DateTime      @updatedAt

  images             ProductImage[]
  cartItems          CartItem[]
  wishlistItems      WishlistItem[]
  orderItems         OrderItem[]
  reviews            Review[]

  @@index([vendorId])
  @@index([categoryId, subcategoryId])
  @@index([brandId])
  @@index([isActive, isFeatured])
  @@index([variantGroupId])
  // tsvector GIN index created via raw migration
}

model ProductImage {
  id        String  @id @default(uuid())
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  productId String
  url       String
  alt       String?
  position  Int     @default(0)

  @@index([productId])
}

// ---------- Cart & Wishlist ----------

model Cart {
  id        String     @id @default(uuid())
  user      User?      @relation(fields: [userId], references: [id], onDelete: SetNull)
  userId    String?    @unique
  items     CartItem[]
  updatedAt DateTime   @updatedAt
  createdAt DateTime   @default(now())
}

model CartItem {
  id            String  @id @default(uuid())
  cart          Cart    @relation(fields: [cartId], references: [id], onDelete: Cascade)
  cartId        String
  product       Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  productId     String
  quantity      Int
  priceSnapshot Int     // minor units at time of add
  currency      Currency
  createdAt     DateTime @default(now())

  @@unique([cartId, productId])
  @@index([cartId])
}

model WishlistItem {
  id        String  @id @default(uuid())
  user      User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId    String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  productId String
  createdAt DateTime @default(now())

  @@unique([userId, productId])
  @@index([userId])
}

// ---------- Orders ----------

model Order {
  id               String       @id @default(uuid())
  orderGroupId     String       // shared across split-order siblings
  humanId          String       @unique // "DOG-00012-A"
  buyer            User         @relation(fields: [buyerId], references: [id], onDelete: Restrict)
  buyerId          String
  vendor           Vendor       @relation(fields: [vendorId], references: [id], onDelete: Restrict)
  vendorId         String
  status           OrderStatus  @default(PENDING)
  paymentProvider  PaymentProvider
  paymentStatus    PaymentStatus @default(INITIATED)

  // Amounts in vendorCurrency minor units
  vendorCurrency   Currency
  subtotalAmount   Int
  shippingAmount   Int
  discountAmount   Int          @default(0)
  vatRate          Int          @default(1500)  // 15.00%
  vatAmount        Int
  totalAmount      Int          // subtotal + shipping + vat - discount

  // Display snapshot (for buyer receipts)
  displayCurrency  Currency
  fxRate           Decimal      @db.Decimal(18,8)
  displayTotalAmount Int

  // Platform commission (in vendorCurrency)
  commissionRate   Int          @default(1000)  // 10.00%
  commissionAmount Int

  promoCode        String?
  shippingAddress  Json         // snapshot of chosen address
  trackingCarrier  String?
  trackingNumber   String?
  trackingUrl      String?
  internalNotes    String?
  cancellationReason String?

  paidAt           DateTime?
  processingAt     DateTime?
  shippedAt        DateTime?
  deliveredAt      DateTime?
  cancelledAt      DateTime?
  createdAt        DateTime     @default(now())
  updatedAt        DateTime     @updatedAt

  items            OrderItem[]
  payment          Payment?
  payoutLine       PayoutLine?

  @@index([buyerId, createdAt])
  @@index([vendorId, status, createdAt])
  @@index([orderGroupId])
  @@index([status])
}

model OrderItem {
  id            String  @id @default(uuid())
  order         Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  orderId       String
  product       Product @relation(fields: [productId], references: [id], onDelete: Restrict)
  productId     String
  // Immutable snapshot
  name          String
  sizeLabel     String
  unitAmount    Int
  currency      Currency
  quantity      Int
  imageUrl      String?

  @@index([orderId])
  @@index([productId])
}

// ---------- Payments & Payouts ----------

model Payment {
  id               String          @id @default(uuid())
  order            Order           @relation(fields: [orderId], references: [id], onDelete: Cascade)
  orderId          String          @unique
  provider         PaymentProvider
  providerRef      String          // Paystack reference
  status           PaymentStatus   @default(INITIATED)
  amount           Int             // minor units in charge currency
  currency         Currency
  rawPayload       Json?           // webhook body (sanitized)
  succeededAt      DateTime?
  failedAt         DateTime?
  createdAt        DateTime        @default(now())

  @@index([providerRef])
}

model PayoutRun {
  id         String        @id @default(uuid())
  periodStart DateTime
  periodEnd  DateTime
  status     String        @default("DRAFT") // DRAFT | FINALIZED | PAID
  createdAt  DateTime      @default(now())
  lines      PayoutLine[]
}

model PayoutLine {
  id          String    @id @default(uuid())
  run         PayoutRun @relation(fields: [runId], references: [id], onDelete: Cascade)
  runId       String
  vendor      Vendor    @relation(fields: [vendorId], references: [id], onDelete: Restrict)
  vendorId    String
  order       Order     @relation(fields: [orderId], references: [id], onDelete: Restrict)
  orderId     String    @unique
  grossAmount Int
  commission  Int
  netAmount   Int
  currency    Currency
  paid        Boolean   @default(false)
  paidAt      DateTime?
  transferRef String?

  @@index([runId])
  @@index([vendorId, paid])
}

// ---------- Reviews ----------

model Review {
  id         String   @id @default(uuid())
  product    Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  productId  String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId     String
  orderItemId String  @unique // ensures verified-purchase and one-per-line
  rating     Int      // 1..5
  title      String?
  body       String?
  photos     String[] // Cloudinary URLs
  hidden     Boolean  @default(false)
  vendorReply String?
  vendorReplyAt DateTime?
  flagCount  Int      @default(0)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@unique([productId, userId])
  @@index([productId, rating])
  @@index([userId])
}

// ---------- Promo & FX ----------

model PromoCode {
  id              String     @id @default(uuid())
  code            String     @unique
  type            PromoType
  value           Int        // PERCENT: basis points (e.g., 1000 = 10%); FIXED: minor units; FREE_SHIPPING: 0
  currency        Currency?  // for FIXED
  minOrderAmount  Int?
  maxUses         Int?
  usedCount       Int        @default(0)
  perUserLimit    Int        @default(1)
  appliesTo       String     @default("ALL") // ALL | CATEGORY:<id> | VENDOR:<id>
  startsAt        DateTime
  endsAt          DateTime
  isActive        Boolean    @default(true)
  createdAt       DateTime   @default(now())

  @@index([isActive, startsAt, endsAt])
}

model FxRate {
  id        String   @id @default(uuid())
  base      Currency
  quote     Currency
  rate      Decimal  @db.Decimal(18,8)
  source    String   @default("exchangerate.host") // or "manual"
  fetchedAt DateTime @default(now())

  @@unique([base, quote, fetchedAt])
  @@index([base, quote])
}

// ---------- Notifications ----------

model Notification {
  id        String             @id @default(uuid())
  user      User?              @relation(fields: [userId], references: [id], onDelete: SetNull)
  userId    String?
  channel   NotificationChannel
  template  String
  payload   Json
  status    NotificationStatus @default(QUEUED)
  error     String?
  sentAt    DateTime?
  createdAt DateTime           @default(now())

  @@index([userId, createdAt])
  @@index([status])
}

// ---------- Admin ops ----------

model AuditLog {
  id         String   @id @default(uuid())
  actor      User?    @relation(fields: [actorId], references: [id], onDelete: SetNull)
  actorId    String?
  action     String   // "vendor.approve", "order.cancel", ...
  entityType String
  entityId   String
  meta       Json?
  createdAt  DateTime @default(now())

  @@index([entityType, entityId])
  @@index([createdAt])
}

model CheckoutSession {
  id                String   @id @default(uuid())
  userId            String?
  items             Json     // snapshot of cart items
  shippingAddress   Json?
  displayCurrency   Currency
  fxRate            Decimal  @db.Decimal(18,8)
  promoCode         String?
  subtotalAmount    Int
  shippingAmount    Int
  discountAmount    Int
  vatAmount         Int
  totalAmount       Int
  provider          PaymentProvider?
  providerRef       String?
  locked            Boolean  @default(false)
  expiresAt         DateTime
  createdAt         DateTime @default(now())

  @@index([expiresAt])
}

model SearchQueryLog {
  id           String   @id @default(uuid())
  userId       String?
  q            String
  resultsCount Int
  createdAt    DateTime @default(now())

  @@index([createdAt])
}

model HomeBanner {
  id        String   @id @default(uuid())
  imageUrl  String
  title     String
  subtitle  String?
  ctaLabel  String?
  ctaHref   String?
  sortOrder Int      @default(0)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
}
```

**Raw migrations to add after initial `prisma migrate`:**

```sql
-- Full-text search generated column + GIN index
ALTER TABLE "Product"
  ADD COLUMN "searchVector" tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce("name",'')), 'A') ||
    setweight(to_tsvector('english', coalesce("brief",'')), 'B') ||
    setweight(to_tsvector('english', coalesce("description",'')), 'C')
  ) STORED;

CREATE INDEX "Product_search_idx" ON "Product" USING GIN ("searchVector");

-- Trigram index for fuzzy fallback
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX "Product_name_trgm_idx" ON "Product" USING GIN ("name" gin_trgm_ops);
```

**Cascade rules summary**

| From | To | On Delete | Reasoning |
|---|---|---|---|
| User | Vendor | Cascade | Vendor identity tied to user |
| User | Address | Cascade | PII ownership |
| User | PaymentMethod | Cascade | |
| User | Order | Restrict | Keep order history even if user soft-deleted |
| Vendor | Product | Cascade | Remove catalog on vendor delete |
| Vendor | Order | Restrict | Keep financial history |
| Product | ProductImage | Cascade | |
| Product | CartItem / WishlistItem | Cascade | |
| Product | OrderItem | Restrict | Immutable history |
| Product | Review | Cascade | |
| PayoutRun | PayoutLine | Cascade | |

---

## 7. API Design

All endpoints are under `/api/v1`. JSON only. Auth via `Authorization: Bearer <firebase-id-token>` except where marked Public. Errors use RFC 7807-style body `{ code, message, details? }` with standard HTTP status codes.

### 7.1 Auth

| Method | Path | Auth | Request | Response |
|---|---|---|---|---|
| POST | `/auth/session` | Public | `{ idToken }` | `{ user }` — creates or fetches the `User` row from the Firebase UID. |
| POST | `/auth/register` | Public | `{ idToken, role: "CUSTOMER"\|"VENDOR", name }` | `{ user }` |
| POST | `/auth/logout` | Auth | — | `204` (client discards token) |
| POST | `/auth/verify` | Auth | — | `{ user }` — used as a token liveness check |
| POST | `/auth/password-reset` | Public | `{ email }` | `204` (Firebase handles send) |

### 7.2 Users

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/users/me` | Auth | Returns `User` + addresses + payment methods summary |
| PATCH | `/users/me` | Auth | Update name, phone, avatarUrl, preferredCurrency |
| DELETE | `/users/me` | Auth | Soft-delete |
| GET | `/users/me/addresses` | Auth | |
| POST | `/users/me/addresses` | Auth | Create |
| PATCH | `/users/me/addresses/:id` | Auth | |
| DELETE | `/users/me/addresses/:id` | Auth | |
| PATCH | `/users/me/addresses/:id/default` | Auth | Set default |
| GET | `/users/me/payment-methods` | Auth | |
| POST | `/users/me/payment-methods` | Auth | Store Paystack `authorization_code` |
| DELETE | `/users/me/payment-methods/:id` | Auth | |

### 7.3 Catalog

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/products` | Public | Query params: `q`, `category`, `subcategory`, `brandIds`, `vendorId`, `priceMin`, `priceMax`, `currency` (for price range conversion), `petLifeStage`, `breedSize`, `dietaryTags`, `minRating`, `inStockOnly`, `sort`, `page`, `pageSize` |
| GET | `/products/:slug` | Public | Returns product detail |
| GET | `/products/:slug/related` | Public | Top 8 related |
| GET | `/products/search/suggest` | Public | `q` → top 5 autocomplete hits |
| GET | `/categories` | Public | Tree including subcategories |
| GET | `/brands` | Public | |
| GET | `/vendors/:slug` | Public | Public storefront data |
| GET | `/vendors/:slug/products` | Public | Paginated |

### 7.4 Cart

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/cart` | Guest-ok (session cookie for guest) or Auth | Returns cart state |
| POST | `/cart/items` | Guest-ok or Auth | `{ productId, quantity }` |
| PATCH | `/cart/items/:itemId` | Guest-ok or Auth | `{ quantity }` |
| DELETE | `/cart/items/:itemId` | Guest-ok or Auth | |
| POST | `/cart/sync` | Auth | `{ items: [{productId, quantity}] }` — merges local into server |
| DELETE | `/cart` | Guest-ok or Auth | Empty |

### 7.5 Wishlist

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/wishlist` | Auth | |
| POST | `/wishlist` | Auth | `{ productId }` |
| DELETE | `/wishlist/:productId` | Auth | |

### 7.6 Checkout & Orders

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/checkout/session` | Guest-ok or Auth | Creates CheckoutSession from cart; returns session + split preview |
| PATCH | `/checkout/session/:id` | Same session | Update `shippingAddress`, `promoCode` |
| POST | `/checkout/session/:id/promo` | Same session | Validate + apply code |
| DELETE | `/checkout/session/:id/promo` | Same session | Remove |
| POST | `/checkout/paystack` | Same session | Body `{ sessionId }` → returns `{ accessCode, reference, publicKey, amountMinor, currency: "GHS" }` to launch Paystack Checkout |
| POST | `/webhooks/paystack` | Webhook (signature) | |
| GET | `/orders` | Auth | Scoped by role (customer: own; vendor: their store's; admin: all). Query: `status`, `page` |
| GET | `/orders/:id` | Auth (owner/vendor/admin) | |
| PATCH | `/orders/:id/status` | Auth (vendor) | `{ toStatus, trackingCarrier?, trackingNumber?, trackingUrl? }` |
| POST | `/orders/:id/cancel` | Auth (buyer pending-only / vendor pre-shipment / admin any) | `{ reason }` |

### 7.7 Reviews

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/products/:slug/reviews` | Public | Paginated |
| POST | `/reviews` | Auth | `{ orderItemId, rating, title?, body?, photos? }` — server validates verified-purchase |
| PATCH | `/reviews/:id` | Auth (author) | Within 30 days |
| DELETE | `/reviews/:id` | Auth (author / admin) | |
| POST | `/reviews/:id/reply` | Auth (vendor of product) | `{ reply }` |
| POST | `/reviews/:id/flag` | Auth | Increments flagCount |

### 7.8 Vendor (Self)

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/vendors` | Auth (customer upgrading) | Create vendor application |
| GET | `/vendors/me` | Auth (vendor) | |
| PATCH | `/vendors/me` | Auth (vendor) | Update store details |
| GET | `/vendors/me/products` | Auth (vendor) | |
| POST | `/vendors/me/products` | Auth (vendor, approved) | Create |
| PATCH | `/vendors/me/products/:id` | Auth (vendor) | |
| DELETE | `/vendors/me/products/:id` | Auth (vendor) | |
| GET | `/vendors/me/orders` | Auth (vendor) | |
| GET | `/vendors/me/payouts` | Auth (vendor) | |
| POST | `/vendors/me/settings/shipping` | Auth (vendor) | Update shipping rule + config |
| PATCH | `/vendors/me/settings/cod` | Auth (vendor) | Toggle |

### 7.9 Admin

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/admin/dashboard` | Admin | Summary KPIs |
| GET | `/admin/vendors?status=pending` | Admin | |
| PATCH | `/admin/vendors/:id/approve` | Admin | `{ approved: true }` |
| PATCH | `/admin/vendors/:id/reject` | Admin | `{ reason }` |
| GET | `/admin/users` | Admin | |
| PATCH | `/admin/users/:id` | Admin | Role, ban |
| GET | `/admin/products` | Admin | |
| PATCH | `/admin/products/:id` | Admin | Moderation |
| GET | `/admin/orders` | Admin | |
| PATCH | `/admin/orders/:id/cancel` | Admin | Force cancel + reason |
| GET | `/admin/reviews?flagged=true` | Admin | |
| PATCH | `/admin/reviews/:id` | Admin | Hide / unhide / delete |
| GET | `/admin/promo-codes` | Admin | |
| POST | `/admin/promo-codes` | Admin | |
| PATCH | `/admin/promo-codes/:id` | Admin | |
| GET | `/admin/fx-rates` | Admin | |
| PUT | `/admin/fx-rates` | Admin | Override |
| GET | `/admin/payouts` | Admin | |
| POST | `/admin/payouts/runs` | Admin | Generate a run from unpaid delivered/paid orders |
| PATCH | `/admin/payouts/runs/:id/finalize` | Admin | |
| PATCH | `/admin/payouts/lines/:id/paid` | Admin | Mark line paid |

### 7.10 Uploads

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/uploads/cloudinary-signature` | Auth | Returns signed upload params scoped to `folder=dogget/<role>/<userId>` |

### 7.11 Response shape conventions

- Pagination: `{ data: [...], pagination: { page, pageSize, total, totalPages } }`
- Money: `{ amount: 1234, currency: "GHS" }` everywhere; UI formats
- Errors: `{ code: "ORDER_INVALID_TRANSITION", message: "...", details: {...} }`
- Timestamps: ISO 8601

### 7.12 Validation

- All request bodies validated with **Zod** schemas shared between client (type-only) and server (runtime).
- Query params also Zod-parsed to coerce numbers/booleans.
- Server returns `400` with `details.fieldErrors` for validation failures.

---

## 8. Integration Requirements

| Service | Purpose | Integration Pattern | Failure Mode |
|---|---|---|---|
| **Firebase Auth** | Buyer/vendor identity | Client SDK for sign-up/login; server verifies ID token with Admin SDK on every protected request | Token invalid → 401; degraded login → show provider fallback (email) |
| **Firebase Admin SDK** | Token verification, admin role claims | Initialized server-side with service account JSON stored in `FIREBASE_SERVICE_ACCOUNT_B64` | If init fails, server refuses to start (fail-closed) |
| **Paystack** | GHS cards + Mobile Money + approved international cards | Server initializes transaction → returns access code/reference → client opens Paystack Checkout → server verifies via webhook `charge.success` and verify endpoint | Webhook lost → reconcile endpoint pulls transaction status on schedule |
| **Cloudinary** | Image hosting / transforms | Signed upload from client using short-lived signature from `POST /uploads/cloudinary-signature`; server never handles binary | Upload fails → client retry with exponential backoff; signature TTL 10 min |
| **exchangerate.host** | FX rates | Daily cron at 00:00 UTC fetches base=GHS rates to USD/EUR/NGN and inverse | On 3 consecutive failures, Sentry alert; fallback to last-known rate or admin override |
| **Resend** | Transactional email | Server sends via `resend.emails.send`; React Email templates | Retries up to 3x with exponential backoff; failed notifications flagged in admin |
| **Sentry** | Error monitoring | Client + server SDK; source maps uploaded at build time | Non-blocking |
| **Plausible** | Analytics | Script tag loaded on production only | Non-blocking |
| **PostgreSQL (Neon)** | Primary DB | Prisma + Neon's pooled connection string (`-pooler` host) | On connection failure, server responds 503; health probe checks DB |
| **Vercel** | Frontend hosting | Git-based CI/CD from `main` branch; preview deploys per PR | Rollback via Vercel dashboard |
| **Railway / Render** | API hosting | Dockerfile or native Node deploy | Blue/green via platform feature |

### 8.1 Firebase setup checklist (resolve broken config first)

1. Create Firebase project `dogget-a8eb8` (exists) and enable Email/Password + Google providers.
2. Register Web App and obtain: `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`.
3. Create `.env.local` at repo root with `VITE_FIREBASE_*` keys.
4. Rewrite `src/firebase/firebaseconfig.js`:
   ```js
   import { initializeApp } from "firebase/app";
   import { getAuth } from "firebase/auth";
   const firebaseConfig = {
     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
     storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
     messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
     appId: import.meta.env.VITE_FIREBASE_APP_ID,
   };
   export const app = initializeApp(firebaseConfig);
   export const auth = getAuth(app);
   ```
5. Replace `src/firebase/firebaseAuth.js` with a proper module exporting `registerWithEmail`, `loginWithEmail`, `loginWithGoogle`, `logout`, `sendPasswordReset`, `observeAuth`.
6. On server, initialize Admin SDK: `admin.initializeApp({ credential: admin.credential.cert(JSON.parse(atob(process.env.FIREBASE_SERVICE_ACCOUNT_B64))) })`.

### 8.2 Paystack integration notes

- Use Paystack Popup v2 for cards + Mobile Money (MTN, Vodafone/Telecel, AirtelTigo).
- Server `POST /transaction/initialize` returns `access_code` and `reference`. Client resumes Paystack Checkout with the access code; Paystack presents all payment channels enabled on the Dogget Paystack dashboard.
- Webhook endpoint `POST /webhooks/paystack` verifies `x-paystack-signature` HMAC-SHA512 with `PAYSTACK_SECRET_KEY`.
- On `charge.success`, load Order by `Payment.providerRef`; idempotently flip to PAID.
- Amount MUST be in pesewas (GHS minor unit = 100 pesewas per 1 GHS).

### 8.3 Online payment UI notes

- Dogget's payment page should summarize delivery, items, totals, and show a single `Pay with Paystack` CTA for online payment.
- Dogget should not collect raw card details in the app. Card, Mobile Money, and any other enabled online channels are selected inside Paystack Checkout.
- Cash on Delivery is deferred until Dogget has reliable delivery collection, vendor remittance, dispute handling, and audit workflows.

### 8.4 Cloudinary patterns

- Upload preset `dogget_products`, folder `dogget/products/<vendorId>/<slug>`.
- Transforms: `f_auto,q_auto,w_{400,800,1200}/dpr_auto`.
- Responsive images with `srcset` sizes 400/800/1200.
- Max file size 5MB, whitelist image/jpeg, image/png, image/webp.

### 8.5 FX rate flow

- Cron `0 0 * * *` hits `https://api.exchangerate.host/latest?base=GHS&symbols=USD,EUR,NGN`.
- Upsert `FxRate` rows. Compute inverse rates too.
- Endpoint `GET /fx-rates/current` returns flattened map used by client.

---

## 9. User Experience

### 9.1 Key User Flows

#### Flow 1 — Buyer purchase (happy path, Paystack, logged-in)

1. Buyer opens `/home` → sees GreetingSection, HeroBanner, CategoriesSection, RecommendedSection.
2. Taps category "Pet Food" → `/shop?category=pet-food`.
3. Applies filters: life-stage=Adult, dietary=Grain-Free, priceMax=GHS 300.
4. Taps product card → `/products/royal-canin-adult-12kg`.
5. Reviews images, rating 4.6 (87 reviews), adds quantity 1, taps Add to Cart; toast "Added to cart".
6. Header cart badge now `1`. Taps cart icon → `/cart`.
7. Sees single vendor group (Kwame's Pet Supplies), subtotal, estimated shipping GHS 30 (by-region Accra). Taps Checkout.
8. `/checkout` — picks default address, VAT line shown (15%), promo code entered `LAUNCH10` (10% off).
9. Selects Paystack → popup opens → pays with MTN MoMo.
10. Webhook verifies → order flips to PAID → confirmation screen shows order id `DOG-00042-A`, estimated delivery window, buttons to View Orders + Track.
11. Emails: "Order placed" (buyer), "New order" (vendor), "Payment confirmed" (both).
12. Vendor acknowledges order → status PROCESSING → email.
13. Vendor marks shipped with tracking `GHL-XYZ` → SHIPPED → email.
14. Buyer marks delivered (or vendor does) → DELIVERED → email with "Review your order" CTA.
15. 3 days later, reminder email.

#### Flow 2 — Guest checkout

1. New visitor adds 2 items from 2 different vendors.
2. Taps Checkout (not logged in).
3. `/checkout` asks for email + phone + shipping address (inline form).
4. Cart shows 2 sub-orders each with per-vendor shipping + VAT.
5. Selects Paystack. Pays successfully.
6. Confirmation screen shows "Order created" AND prominent "Create an account so you can track these orders" card with pre-filled email.
7. If buyer creates account → Firebase sign-up → server links orders by email → buyer lands on `/orders`.
8. If buyer skips → receives an email with a magic link (Firebase email-link sign-in) valid 24h to access orders.

#### Flow 3 — Cross-vendor cart payment

1. Cart has items from Vendor A and Vendor B.
2. Checkout shows split vendor shipping and a single combined Paystack total.
3. Buyer pays online through Paystack; webhook confirms payment for all child orders atomically.

#### Flow 4 — Vendor onboarding

1. New user registers as VENDOR → lands on `/vendor/apply`.
2. Fills store form → submits → status: Pending Review.
3. Admin reviews in `/admin/vendors?status=pending`, approves.
4. Vendor receives approval email → can now access full dashboard.
5. Vendor creates first products and configures shipping rules.
6. Storefront goes live at `/vendors/kwames-pet-supplies`.

#### Flow 5 — Vendor order fulfillment

1. Vendor gets "New order" email + push (Phase 2).
2. Opens `/vendor/orders/DOG-00042-A`; sees shipping address and items.
3. Taps Acknowledge → PROCESSING.
4. Packs order. Taps Mark Shipped → enters carrier + tracking; status SHIPPED.
5. On delivery, marks order Delivered.
6. Net payout line added to next run.

#### Flow 6 — Admin approval

1. Email alert on new vendor.
2. Admin opens `/admin/vendors/pending`, reviews store info, Cloudinary logo, business type.
3. Approve or Reject with reason.
4. Email fires; AuditLog records action.

#### Flow 7 — Review submission

1. Buyer receives "Review your order" email 3 days post-delivery.
2. Clicks CTA → `/orders/:id?review=<orderItemId>`.
3. Modal: star rating, title, body, photo upload.
4. Submits → verified badge applied; vendor gets email.

### 9.2 Screen Inventory

| Route | Layout | Key Elements | Status (today) | Required for MVP |
|---|---|---|---|---|
| `/` | Standalone | Onboarding carousel (3 slides), Skip/Get Started | Done | Yes |
| `/home` | MainLayout + HomeLayout | GreetingSection, HeroBanner, CategoriesSection, RecommendedSection, AdSection, TrustSection, CTASection | Done | Yes (polish) |
| `/shop` | MainLayout | Header (search), ShopFilters (pills + sort + **new: full filter drawer**), ProductGrid, Pagination, Empty state | Partial | Yes (extend filters) |
| `/products/:slug` | MainLayout | Gallery, Title, Price, Vendor badge, Quantity, Add-to-cart, Wishlist, Description, Attributes, Reviews block, Related | Missing | Yes |
| `/vendors/:slug` | MainLayout | Vendor header, badge row, product grid with filters | Missing | Yes |
| `/cart` | MainLayout | Items grouped by vendor, subtotal, shipping estimate, checkout CTA, save-for-later | Missing | Yes |
| `/wishlist` | MainLayout | Grid of saved items, move-to-cart | Missing | Yes |
| `/checkout` | CheckoutLayout (no bottom nav) | Address, split-order review, promo, payment selector, place order | Missing | Yes |
| `/orders` | MainLayout | Group list, filter by status | Missing | Yes |
| `/orders/:id` | MainLayout | Order group detail, status timeline per sub-order, tracking, re-order button | Missing | Yes |
| `/profile` | MainLayout | Info, addresses, payment methods, settings | Missing | Yes |
| `/register` | Auth | Toggle login/register, Google button | Shell only | Yes (wire Firebase) |
| `/forgot-password` | Auth | Email, send link | Missing | Yes |
| `/vendor/apply` | VendorLayout (simple) | Store form | Missing | Yes |
| `/vendor` | VendorLayout | Dashboard overview | Missing | Yes |
| `/vendor/products` | VendorLayout | Products table + editor drawer | Missing | Yes |
| `/vendor/products/new` | VendorLayout | Product form | Missing | Yes |
| `/vendor/orders` | VendorLayout | Orders table, detail drawer | Missing | Yes |
| `/vendor/payouts` | VendorLayout | Runs list | Missing | Yes |
| `/vendor/settings` | VendorLayout | Shipping, profile | Missing | Yes |
| `/admin` | AdminLayout | KPI cards + quick links | Missing | Yes (basic) |
| `/admin/vendors` | AdminLayout | Approval queue | Missing | Yes |
| `/admin/products` | AdminLayout | Moderation list | Missing | Yes |
| `/admin/orders` | AdminLayout | Full orders | Missing | Yes |
| `/admin/reviews` | AdminLayout | Flagged queue | Missing | Yes |
| `/admin/promos` | AdminLayout | CRUD | Missing | P1 |
| `/admin/users` | AdminLayout | List | Missing | P1 |
| `/admin/fx` | AdminLayout | Rate override | Missing | Yes |
| `/admin/payouts` | AdminLayout | Runs | Missing | Yes |
| `/offline.html` | Static | Cached logo + retry | Missing | Yes (PWA) |
| `/404` | MainLayout | Not found | Missing | Yes |

### 9.3 Design System

#### Color tokens (Tailwind theme extend)

| Token | Hex | Use |
|---|---|---|
| `brand.primary` | `#F4A52C` | Primary CTA, active nav, links |
| `brand.primaryHover` | `#D88F1B` | Hover of primary |
| `brand.secondary` | `#FA7A3D` | Secondary CTA, badges |
| `brand.accent` | `#F6B756` | Highlights, promo banners |
| `brand.charcoal` | `#2F2F2F` | Body text, headings |
| `brand.gray` | `#F2F2F2` | Surfaces, input backgrounds |
| `brand.white` | `#FFFFFF` | Page background |
| `brand.success` | `#2E7D32` | PAID / DELIVERED badges |
| `brand.warning` | `#ED6C02` | PENDING / low stock |
| `brand.danger` | `#D32F2F` | CANCELLED / errors |
| `brand.info` | `#0288D1` | SHIPPED |

#### Typography

- **Caveat Brush** — logo only
- **Quicksand** — H1–H3, section titles, buttons
- **Nunito** — body, labels, metadata

Scale (rem): H1 1.875 / H2 1.5 / H3 1.25 / Body 1 / Small 0.875 / Micro 0.75. Line height 1.5 body, 1.2 headings.

#### Spacing / Layout

- 4px base unit; utilities use 4/8/12/16/24/32/48/64.
- Mobile gutter: 16px. Desktop content max-width 1200px, 24px gutter.
- Safe-area-inset for bottom nav on iOS PWA.

#### Components (DaisyUI + custom)

- Buttons: `btn-primary`, `btn-outline-primary`, `btn-ghost`. 44px min height.
- Badges for status (PAID / PROCESSING / SHIPPED / DELIVERED / CANCELLED) with fixed color map above.
- Input fields: `bg-brand.gray`, focus ring in `brand.primary`.
- ProductCard: image 1:1 Cloudinary, title 2-line clamp, price bold, wishlist heart top-right, add-to-cart basket bottom-right.
- Bottom sheet: Framer Motion transform + 40% backdrop.
- Modals: centered desktop, bottom-sheet mobile.
- Currency formatter: `formatMoney({ amount, currency })` returns locale-correct string (e.g., `GH₵ 120.00`, `$9.60`).
- Skeletons: grid (3×2) and list; shimmer via Tailwind `animate-pulse`.

#### Motion

- Framer Motion presets: `fade-in-up` (200ms), `scale-tap` (150ms), `slide-sheet` (220ms ease-out).
- Page transitions: `AnimatePresence` wrapping routes. Disable on `prefers-reduced-motion`.

### 9.4 Edge Cases

| # | Scenario | Expected Behavior |
|---|---|---|
| E-01 | Mixed-currency cart (vendor A in GHS, vendor B in USD) | Display in buyer's preferred currency; at checkout, split-order charges remain in each vendor's currency; buyer pays a combined total converted at frozen FX |
| E-02 | Out-of-stock race (two buyers last unit) | Server checks inventory in transaction at order creation; loser gets 409 with affected item list; UI highlights items to remove |
| E-03 | Payment fails mid-popup | CheckoutSession persists; user retries without recreating; inventory not decremented until PAID |
| E-04 | Webhook arrives twice | Idempotent by `Payment.providerRef`; second arrival is no-op |
| E-05 | Webhook never arrives | Reconcile cron every 10 min polls Paystack for SessionIds older than 10 min; promotes if SUCCEEDED |
| E-06 | Split-order partial failure (one vendor's pre-save fails) | All-or-nothing DB transaction; CheckoutSession unlocks; buyer sees a user-friendly error |
| E-07 | Vendor deactivates product while in someone's cart | At checkout, server drops inactive items with toast "X is no longer available"; cart recomputes |
| E-08 | Vendor deactivates (self) with open orders | Storefront hidden, products hidden; open orders remain fulfillable; payouts still computed |
| E-09 | Admin rejects previously approved vendor | Products hidden; open orders continue; vendor gets email with reason |
| E-10 | No-returns policy but buyer insists | Admin process: manual refund via provider dashboard; `Payment.status → REFUNDED`; `Order.status → CANCELLED` (forced by admin only if not yet delivered; else stays DELIVERED with refund note in internalNotes) |
| E-11 | Review written before delivery | Rejected; server returns 403 `REVIEW_NOT_PERMITTED` |
| E-12 | Promo code exceeds maxUses at checkout | Re-validation at lock time returns 409 `PROMO_EXHAUSTED`; UI shows error |
| E-13 | FX API down | Fall back to last known rate in `FxRate`; admin override possible; UI shows "Indicative" badge |
| E-14 | Buyer's currency has no rate in DB | Fallback chain: preferred → GHS; log for admin |
| E-15 | Large image upload (>5MB) | Client + server reject with clear error; retry suggestion: "Compress or crop" |
| E-16 | Guest cart on device A, then logs in on device B | On login, `POST /cart/sync` merges device A's local cart into server cart by max-qty |
| E-17 | Buyer rapid-clicks Add to Cart | Debounced 200ms; increments by the button click count |
| E-18 | Network drops mid-navigation | SW serves cached page; top banner "Offline — some actions unavailable" |
| E-19 | SW update available | Toast bottom-right: "New version available — Refresh"; sticky until dismissed or accepted |
| E-21 | Product inventory decremented then order cancelled | On cancel, restore inventory (transaction); audit logged |
| E-22 | Buyer enters non-Ghana region but Paystack requires GH | Allowed since billing address differs from shipping; vendor decides if they ship there |
| E-23 | Vendor mass-edits inventory to 0 | Products auto show Out of Stock; cart items flagged unavailable on next load |
| E-24 | SEO crawler hits `/cart` | Returns 200 with empty state and `noindex` tag |
| E-25 | Buyer's session token expires during checkout | Frontend refreshes silently; if refresh fails, redirects to login with return URL |

---

## 10. Technical Architecture

### 10.1 Topology

```
 Client (React 19 PWA)                                Hosting
 ----------------------                               -------
 Vite build → static → Vercel (Edge, global CDN)     vercel.app
   │  Firebase Auth SDK
  │  Paystack Checkout
   │  Cloudinary direct upload (signed)
   │  Zustand stores, React Query cache
   │  Service Worker (Workbox)
   ▼
 API (Node 20 + Fastify + Prisma)
   │  Firebase Admin SDK (token verify, role claims)
  │  Paystack SDK/API (init + webhook verify)
   │  Cloudinary SDK (sign)
   │  Resend SDK
   │  exchangerate.host (cron)
   │  Cron (node-cron) for: FX fetch, payment reconcile, abandoned session cleanup, review-CTA emails
   ▼                                                  Railway (web service)
 PostgreSQL (managed)                                 Neon (eu-central or aws-us-east-2)
   │  Daily backups, 7d retention
   ▼
 External: Sentry, Plausible
```

### 10.2 Stack

| Layer | Choice | Reason |
|---|---|---|
| Frontend | React 19 + Vite 7 | Existing repo |
| Styling | Tailwind 4 + DaisyUI 5 | Existing repo; speed |
| State | Zustand | Tiny, no-boilerplate; split stores `authStore`, `cartStore`, `wishlistStore`, `uiStore`, `currencyStore` |
| Data fetching | TanStack Query | Request dedupe, cache, infinite queries for product grid |
| Forms | React Hook Form + Zod | Shared schemas with backend |
| Router | React Router 7 | Existing |
| Animation | Framer Motion | Existing |
| PWA | vite-plugin-pwa | Workbox wrapper |
| Backend | Node 20 + Fastify 4 | Faster than Express; JSON schema friendly; Pino logs |
| ORM | Prisma | Schema-first; strong TS types |
| DB | PostgreSQL 15+ (Neon, serverless) | FTS + `pg_trgm` + JSON; branching for migrations |
| Auth | Firebase Auth (client) + Firebase Admin (server) | Fast to ship; supports email + Google |
| Payments | Paystack | Ghana Mobile Money, local cards, and approved international cards |
| Media | Cloudinary | Existing image URLs |
| Email | Resend + React Email | Clean DX, good templates |
| FX | exchangerate.host | Free, reliable |
| Monitoring | Sentry | Errors + perf |
| Analytics | Plausible | Privacy-friendly |
| CI/CD | GitHub Actions + Vercel + Railway | Per-branch previews |

### 10.3 Repositories

- `dogget` (monorepo) with directories:
  - `apps/web` (existing frontend; move `src/` under here at start of Week 1)
  - `apps/api` (new Fastify app)
  - `packages/shared` (Zod schemas, enum + type re-exports from Prisma, money formatter)
  - `packages/email` (React Email templates)
- Package manager: pnpm workspaces.

Alternative: keep two repos if monorepo tooling is a detour. Recommendation: **monorepo with pnpm**, but only migrate at Week 1 to avoid paralysis.

### 10.4 Deployment

- Frontend: Vercel, project `dogget-web`, framework Vite.
- Backend: Railway service `dogget-api`, Dockerfile base `node:20-alpine`, health check `GET /healthz`.
- DB: Neon project `dogget-db`, two branches (`main` = production, `dev` = ephemeral migration testing). Connection pooling via Neon's `-pooler` host (transaction mode). Extensions enabled at provision time: `pg_trgm`. (Postgres 15+ ships `tsvector`/`tsquery` natural-language search built-in — no extension required.)
- Environments: `preview` (per PR), `staging` (branch `staging`), `production` (branch `main`).

### 10.5 Security controls

- `helmet` on Fastify with strict CSP: `default-src 'self'; img-src 'self' data: https://res.cloudinary.com; script-src 'self' https://js.paystack.co; connect-src 'self' https://api.exchangerate.host https://firebaseauth.googleapis.com ...`
- Secrets via Railway + Vercel env var stores; rotated on compromise.
- Signed Cloudinary uploads only.
- Paystack webhook signature verification required; reject on mismatch.
- Rate limits per table in NFR-13.
- Prisma parameterized queries; no raw SQL outside of migrations and one FTS ranking query (parameterized).
- `helmet` + CORS allowlist: `https://dogget.app`, `https://www.dogget.app`, preview `*.vercel.app`.

### 10.6 Observability

- Sentry browser SDK on prod; source maps uploaded per build.
- Sentry Node SDK on API.
- Pino JSON logs → Railway log drain.
- Plausible goal events: `signup`, `add_to_cart`, `begin_checkout`, `purchase`, `vendor_apply`.
- Admin dashboard reads daily counters directly from DB (no third-party BI in MVP).

### 10.7 Technical risks & mitigations

| Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|
| Paystack MoMo flake during peak | H | M | Reconcile cron; retry UX; fallback to card |
| FX API downtime | M | M | 24h cache + admin override |
| Image bandwidth blows Cloudinary free tier | M | M | `q_auto,f_auto`; cache-first SW; alert at 50% |
| Firebase Admin SDK misconfig | H | M | Fail-closed on boot; smoke test in CI |
| Prisma migration breaks prod | H | L | `prisma migrate deploy` in CI; test on staging first |
| Solo-dev bottleneck | H | H | This PRD's fixed scope; weekly plan; ruthless cut-list |
| Ghanaian network variance | M | H | PWA offline, skeletons, short timeouts + retry |
| Cross-vendor cart edge cases | H | M | Comprehensive contract tests; error codes enumerated |
| Review abuse | M | L | Verified-purchase gating + flag + admin moderation |

---

## 11. Launch Plan

### 11.1 8-Week Build Plan (Weeks 2026-04-27 → 2026-06-22)

> Assumes solo builder full-time. Each week ends with a deploy to staging.

**Week 1 — Foundation (Apr 27 – May 3)**
- Monorepo migration (`apps/web`, `apps/api`, `packages/*`).
- Fix broken Firebase config; wire `Register`/`Login` to working Firebase Auth.
- Add Zustand stores, React Query provider, Zod, React Hook Form.
- Spin up Fastify skeleton, Prisma, Postgres on Neon, `users` table + `/auth/session`.
- Sentry client + server.
- CI: lint, typecheck, test, build, deploy staging on push.

**Week 2 — Catalog + Vendor data model**
- Full Prisma schema migration (all tables in §6).
- Seed data script: 4 categories, 10 brands, 2 sample vendors, 20 products, 1 admin user.
- `GET /products`, `GET /products/:slug`, `GET /categories`, `GET /brands`, `GET /vendors/:slug`.
- Rewrite Shop page to hit real API; replace mock `products.js`.
- Implement full filter set + sort + pagination client-side; server-side filters.

**Week 3 — Search, Product Detail, Cart**
- FTS migration + `tsvector`; `GET /products` supports `q`.
- Autocomplete `GET /products/search/suggest`.
- Product Detail page with gallery, attributes, related.
- Cart UI + local storage; `POST /cart/sync`.
- Wishlist UI + `POST/DELETE /wishlist`.

**Week 4 — Checkout, Payments, Orders**
- CheckoutSession model + endpoints.
- Split-order logic.
- VAT + promo code application.
- Paystack init + webhook.
- Orders list + detail pages.
- Vendor order status transitions.
- Emails: order placed, payment confirmed, new order.

**Week 5 — Vendor Dashboard + Admin Panel**
- Vendor registration + approval.
- Vendor product CRUD (with Cloudinary signed upload).
- Vendor orders table + detail.
- Vendor shipping rule.
- Vendor payouts view.
- Admin: dashboard, vendor approval, product/review moderation, orders, FX override, promos.

**Week 6 — Reviews, Profile, Addresses, Storefront**
- Verified-purchase review submission.
- Vendor reply.
- Profile page, address CRUD, payment method list, account delete.
- Public vendor storefront `/vendors/:slug`.
- Currency preference + FX conversion UI everywhere.
- Email templates complete (all in §4.13 table).

**Week 7 — PWA, Polish, Hardening**
- `vite-plugin-pwa` manifest + Workbox runtime caching.
- Offline page + banner.
- Update prompt.
- Lighthouse performance pass; image `srcset` audit.
- Accessibility pass (keyboard, screen reader, contrast).
- Rate limiting, CSP, CORS, helmet.
- Sentry source maps.
- Error boundary components at layout level.
- Seed real inventory (Dogget Official 20–30 SKUs).
- Admin trains 3 pilot partner vendors.

**Week 8 — UAT, Beta, Launch**
- Internal smoke tests end-to-end.
- Private beta (20 users, invite-only, WhatsApp group).
- Fix P0/P1 bugs.
- Public beta landing at `dogget.app` with clear "Beta" label.
- Go/No-Go review.
- Launch.

### 11.2 Release Strategy

| Stage | Week | Audience | Exit Criteria |
|---|---|---|---|
| Internal test | 7 | Founder only | All critical flows pass manually |
| UAT | 8 (early) | 5–10 friendly testers | No P0 bugs; 3 resolved real orders end-to-end |
| Private beta | 8 (mid) | 20–50 invited | < 3 P1 bugs open; feedback loop stable |
| Public beta | 8 (late) | Open with "Beta" label | Soft launch, monitor |
| GA | 9+ | Public | Post-launch — remove beta label after 2 weeks green |

### 11.3 Go/No-Go Criteria

| # | Criterion | Required |
|---|---|---|
| G-1 | All P0 bugs = 0 | Yes |
| G-2 | At least one successful real transaction per Paystack payment channel used at launch (card and MoMo minimum) | Yes |
| G-3 | At least 3 vendors approved with ≥ 10 products each | Yes |
| G-4 | Lighthouse mobile Perf ≥ 80, A11y ≥ 85 | Yes |
| G-5 | SW installable on Chrome + Safari (iOS add-to-home) | Yes |
| G-6 | Sentry capturing errors; no unseen 5xx in staging 48h | Yes |
| G-7 | Backups verified (restore test on staging) | Yes |
| G-8 | Privacy policy + terms published | Yes |
| G-9 | Admin contact/support email live | Yes |
| G-10 | Rollback runbook written and tested | Yes |

### 11.4 Rollback Plan

- Vercel: one-click "Promote previous deployment".
- Railway: redeploy previous container image tag.
- DB migrations are forward-only; for bad migration, apply a *compensating* migration (e.g., `drop column` added erroneously). Keep `prisma migrate status` clean; tag each release.
- Feature flags (via env vars) for risky features: `FEATURE_PROMOS`. Flip off without redeploy by updating env.

### 11.5 Post-launch operations (solo founder)

**Daily (15 min)**: check Sentry top issues, new vendor apps, failed payments, failed emails.
**Weekly (2 h)**: review KPIs (orders, GMV, conversion), moderate flagged reviews, run payout run, publish promo if needed, top 3 pain-point fixes.
**Monthly (half-day)**: cost review, roadmap check, user interviews (2–3), content refresh on home banner.
**Quarterly**: re-score KR targets; decide Phase 2 go/no-go.

---

## 12. Future Phases

**Phase 2 (approx. Weeks 10–20): Services + Community**
- Pet services booking (vet, groomer, walker) with calendar + availability + one-off payments (reuse Paystack).
- Wellness tracker (vaccination, weight, allergies) — extends user profile into Pawfile proper (pet identity fields).
- Community forums / Q&A (Discourse-like simple MVP).
- SMS + WhatsApp notifications via Hubtel and WhatsApp Business API.
- Returns & refunds workflow with vendor approvals.
- Full variant system (Product → Sku with size/color/flavor).
- Lost dog reports with map view (Leaflet).
- Subscription tier for vendors (Starter free @ 10% / Growth GHS 100/mo @ 8% / Pro GHS 300/mo @ 6% + featured).

**Phase 3 (approx. Weeks 21–36): AI + New Commerce Models**
- AI recommendations (cold-start with embeddings from product text + images; collaborative filtering once usage data is sufficient).
- Subscription boxes (recurring Paystack plans).
- Livestream shopping ("Bark & Buy").
- Loyalty / referrals.

---

## 13. Assumptions & Risks

### 13.1 Assumptions

| # | Assumption | Risk if wrong | Mitigation |
|---|---|---|---|
| A-1 | Target buyers have reliable 3G+ and comfort with MoMo/card payment | Fewer conversions | PWA offline-first, aggressive perf budget, revisit COD after operations are defined |
| A-2 | Paystack covers MTN + Telecel + AirtelTigo MoMo, local cards, and approved international cards with acceptable fees | Payment friction | Evaluate Flutterwave, Stripe, or COD later only if Paystack coverage is insufficient |
| A-3 | Enough vendors exist locally to seed 8+ by launch | Empty marketplace | Dogget Official acts as anchor; aggressive outreach Week 5 |
| A-4 | 8-week solo timeline is realistic given fixed scope | Launch slip | Cut list: `/admin/payouts` UI can be DB-only admin if time-constrained; FX admin override can be env-var |
| A-5 | Firebase Auth free tier covers MVP scale | Cost overrun | Monitor DAU |
| A-6 | Neon free tier (0.5 GB storage, 191.9 compute-hrs/mo) covers MVP DB load | Perf degrade / quota cap | Upgrade plan known and budgeted (Neon Launch ~$19/mo for 10 GB + autoscaling) |
| A-7 | Buyers accept PWA over native app | Low install | Measure install rate; Phase 2 Capacitor wrapper if needed |
| A-8 | VAT 15% applies to all listed product categories | Tax compliance | Reserve `taxExempt` field; consult accountant before launch |
| A-9 | Vendors self-manage shipping reliably | Bad delivery experience | Mystery-shop pilot vendors; publish service standards |
| A-10 | English-only is acceptable for Year 1 | Exclusion | i18n ready from start |

### 13.2 Risks

| # | Risk | Sev | Likelihood | Mitigation |
|---|---|---|---|---|
| R-1 | Payment chargeback / fraud | H | L | Paystack fraud tools; no stored PAN |
| R-2 | Vendor listing abuse (counterfeit, illegal items) | H | M | Admin moderation + terms of service; takedown SLA |
| R-3 | Data breach | H | L | Least-privilege IAM, env secrets, Prisma, `helmet`, regular npm audit |
| R-4 | Cloudinary bandwidth spike | M | M | Cache SW, `q_auto`, alert at 50% |
| R-5 | Single-vendor drop-off (Dogget Official carries too much) | M | H | Onboarding calls with partner vendors weekly |
| R-6 | FX rate controversy (buyer paid more than displayed) | M | L | Freeze rate at checkout; show on receipt |
| R-7 | Key-person risk (solo dev burnout) | H | M | PRD-locked scope, weekly plan, no crunch, health days |
| R-8 | Regulatory change (Ghana data privacy / VAT) | M | L | Subscribe to updates; quarterly legal check |

---

## 14. Appendix

### 14.1 Glossary

| Term | Definition |
|---|---|
| PWA | Progressive Web App |
| Pawfile | Brand name for the buyer profile page (dog-specific fields deferred to Phase 2) |
| Vendor | Approved seller with storefront on Dogget |
| Dogget Official | First-party vendor operated by Benedicta; seeds catalog |
| OrderGroup | Parent grouping that ties split-order siblings after a single checkout |
| Split-order | Pattern of creating one Order per vendor from a single cart |
| FTS | Full-Text Search (Postgres `tsvector` + GIN) |
| FX | Foreign Exchange |
| VAT | Value Added Tax (Ghana 15%) |
| GMV | Gross Merchandise Value |
| Paystack | African payment processor (cards, MoMo, bank) |
| Cloudinary | Image CDN / transform service |
| Resend | Transactional email provider |
| Firebase Auth | Google-hosted identity provider |
| Zod | TypeScript-first schema validation |
| Zustand | Small React state store |
| Workbox | PWA service-worker toolkit |
| TanStack Query | Server-state cache |

### 14.2 Environment Variables

**Client (`apps/web/.env.local`)**

```
VITE_API_URL=https://api.dogget.app/api/v1
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=dogget-a8eb8.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=dogget-a8eb8
VITE_FIREBASE_STORAGE_BUCKET=dogget-a8eb8.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=1:595235478975:web:eb223b3bec03012d43950a
VITE_PAYSTACK_PK=pk_live_xxx
VITE_CLOUDINARY_CLOUD_NAME=dfb2hl46r
VITE_SENTRY_DSN_CLIENT=...
VITE_PLAUSIBLE_DOMAIN=dogget.app
```

**Server (`apps/api/.env`)**

```
NODE_ENV=production
PORT=8080
DATABASE_URL=postgres://...
FRONTEND_URL=https://dogget.app
CORS_ORIGINS=https://dogget.app,https://www.dogget.app

# Firebase Admin
FIREBASE_PROJECT_ID=dogget-a8eb8
FIREBASE_SERVICE_ACCOUNT_B64=<base64-encoded JSON>

# Paystack
PAYSTACK_SECRET_KEY=sk_live_xxx
PAYSTACK_WEBHOOK_SECRET=sk_live_xxx

# Cloudinary
CLOUDINARY_CLOUD_NAME=dfb2hl46r
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Email
RESEND_API_KEY=...
EMAIL_FROM="Dogget <hello@dogget.app>"

# FX
EXCHANGERATE_API_URL=https://api.exchangerate.host

# Sentry
SENTRY_DSN_SERVER=...

# Feature flags
FEATURE_PROMOS=true
```

### 14.3 Reference Links

- Vite PWA: https://vite-pwa-org.netlify.app/
- Prisma: https://www.prisma.io/docs
- Fastify: https://fastify.dev/docs/latest/
- Firebase Auth web: https://firebase.google.com/docs/auth/web/start
- Firebase Admin SDK: https://firebase.google.com/docs/admin/setup
- Paystack Popup: https://paystack.com/docs/payments/accept-payments/
- Paystack Webhooks: https://paystack.com/docs/payments/webhooks/
- Cloudinary Upload (signed): https://cloudinary.com/documentation/upload_images#generating_authentication_signatures
- exchangerate.host: https://exchangerate.host/
- Resend: https://resend.com/docs
- React Email: https://react.email/docs
- Sentry: https://docs.sentry.io/
- Plausible: https://plausible.io/docs
- Zustand: https://docs.pmnd.rs/zustand/getting-started/introduction
- TanStack Query: https://tanstack.com/query/latest
- React Router 7: https://reactrouter.com/
- Tailwind v4: https://tailwindcss.com/docs/installation
- DaisyUI: https://daisyui.com/
- Swiper: https://swiperjs.com/
- Framer Motion: https://www.framer.com/motion/
- Ghana Data Protection Act: https://www.dataprotection.org.gh/

### 14.4 Changelog vs v1 (what changed and why)

| v1 state (Open Question / Assumption) | v2 decision | Why |
|---|---|---|
| OQ-1: GHS vs USD pricing ambiguity | **Multi-currency** with vendor-side currency + buyer-side auto-convert via daily FX; VAT 15% separate line | Reflects reality of Ghana market + expat buyers + international vendor brands |
| OQ-2: Commission structure unclear | **10% flat** per sale in MVP; tiered subs documented for Phase 2 | Aggressive acquisition price vs 15–20% industry avg |
| OQ-3: Services booking in MVP? | **Deferred to Phase 2** | Scope discipline; commerce MVP must ship first |
| OQ-4: Platform vs vendor fulfillment | **Vendor-managed** with per-vendor shipping rules | Scales without logistics capex |
| OQ-5: Firebase Auth long-term? | **Keep** Firebase + server token verify via Admin SDK | Speed to ship; no migration in MVP |
| OQ-6: Content moderation approach | **Admin queue** for vendor approval + review moderation + flag system | Basic but real |
| OQ-7: Min order / free shipping threshold | **Vendor decides** via shipping rule `FREE_OVER_THRESHOLD` | Vendor flexibility |
| A-1: Reliable 3G assumption | Softened with PWA offline-first; COD deferred until collection/remittance operations are defined | — |
| Variants handling unspecified | **MVP: separate products + optional `variantGroupId`**; proper variants Phase 2 | Simpler data model now |
| Reviews not specified | **Verified-purchase only**, photos, vendor reply, admin moderation | Trust and quality |
| Cross-vendor cart behavior unspecified | **Split-order** (one Order per vendor, linked by `orderGroupId`); single payment total | Cleanest financial model |
| Guest checkout unspecified | **Guest allowed**, optional account creation at confirmation + magic-link | Conversion critical |
| Multi-address / saved payments unspecified | **Supported** (Address[], PaymentMethod[]) | Standard e-commerce |
| Promo codes unspecified | **Supported** (PERCENT / FIXED / FREE_SHIPPING) | Needed for launch campaigns |
| Search type unspecified | **Server-side FTS** from day one with pg `tsvector` + `pg_trgm` fuzzy fallback | Scales; no Algolia cost |
| Notifications unspecified | **Email only in MVP (Resend)**; SMS/WhatsApp Phase 2 | Scope discipline |
| PWA offline unclear | **Full offline browsing** via Workbox strategies enumerated | Ghana network realities |
| Timeline | **8 weeks** (v1 said 6) | Bigger scope (vendor panel, admin, FX, promos) |
| Admin panel | **In-app `/admin`** with explicit screens | No ambiguity |
| Payouts | **Manual weekly `PayoutRun`** with Gross / Commission / Net visible to vendor | Operable by solo founder |
| Pawfile | **Profile page brand name only**; pet identity deferred | No feature creep in MVP |
| FX fallback | **Admin manual override** when API fails | Resilience |
| Returns/refunds | **Manual admin-initiated** in MVP; workflow Phase 2 | Explicit |
| Email verification | **Non-blocking** in MVP | Reduce friction |

---

**End of document.**

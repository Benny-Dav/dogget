Dogget E-Commerce PWA — MVP Documentation

Product: Dogget
Feature: Dog Care Products E-Commerce (MVP)
Author: Benedicta
Date: October 3, 2025

Overview

The Dogget E-Commerce PWA is a mobile-first progressive web app designed to enable users to browse, purchase, and manage orders of dog care products. Vendors can create stores, add products, and manage their catalog through a vendor dashboard.

The MVP will focus primarily on the frontend user experience, built with dummy data and basic state management. Backend integrations (Node/Express + Firebase Auth + payments) will follow in future phases.

Purpose:

Provide a responsive and installable PWA for dog owners to purchase essential dog care products.

Deliver a vendor-facing dashboard to manage products and view store activity.

Establish a scalable frontend foundation ready for backend and API integrations.

System Architecture

Core Components
1. Homepage (/src/pages/Home.tsx)

Route: /

Purpose: Showcase brand, highlight categories, and drive users into shopping flow.

Key Features:

Hero banner with featured call-to-action.

Product categories (Food, Toys, Health, Accessories).

Recommended products grid.

Bottom mobile nav bar (Home, Categories, Cart, Profile).

2. Product Catalog Page (/src/pages/Products.tsx)

Route: /products

Purpose: Display all products with filtering.

Key Features:

Grid display of products with image, name, and price.

Filters (category, price).

Search bar (optional for MVP).

3. Product Detail Page (/src/pages/ProductDetail.tsx)

Route: /products/:id

Purpose: Provide details for a single product.

Key Features:

Large product image.

Name, price, description.

Add to Cart button.

Suggested products (“You may also like”).

4. Cart Page (/src/pages/Cart.tsx)

Route: /cart

Purpose: Review and manage cart before checkout.

Key Features:

List of products in cart (with quantity + remove).

Cart total calculation.

Checkout button.

5. Auth Pages (/src/features/auth/)

Routes: /register, /login

Purpose: Provide simple sign-up/login.

Key Features:

Toggle between Register/Login in one component.

Inputs: Name, Email, Password (Register) / Email, Password (Login).

Continue with Google (future Firebase integration).

6. Checkout Page (/src/pages/Checkout.tsx)

Route: /checkout

Purpose: Capture order details before placing an order.

Key Features:

Shipping information form (name, address, phone).

Order summary.

Mock “Pay Now” button.

7. Order Confirmation Page (/src/pages/OrderConfirmation.tsx)

Route: /orders/:id

Purpose: Show order success.

Key Features:

Thank you message.

Order summary.

View My Orders button.

8. Profile Page (/src/pages/Profile.tsx)

Route: /profile

Purpose: Allow user to view account details.

Key Features:

User info (name, email).

Order history (static for MVP).

Logout button.

9. Vendor Dashboard (Phase One Lite) (/src/pages/vendor/Dashboard.tsx)

Route: /vendor

Purpose: Allow vendors to manage products.

Key Features:

Add product (form).

Product list view.

Edit/Delete product actions.

User Journey Flow
Customer Flow

Homepage → Product Catalog → Product Detail → Cart → Checkout → Order Confirmation → Profile.

Vendor Flow

Login/Register → Vendor Dashboard → Add Product → Manage Products.

Feature Breakdown
Customer Features

Browse homepage and categories.

View product catalog.

View product detail.

Add/remove items from cart.

Proceed to checkout (mock).

Login/Register (UI only).

View profile and past orders (dummy data).

Vendor Features

Vendor login/register (UI).

Vendor dashboard with add product form.

Manage product list (edit/delete).

Technical Features

PWA support: installable, offline-ready (service worker + manifest).

State management with Zustand (cart + auth).

Responsive UI with Tailwind.

Routing with React Router.

Form validation with React Hook Form.

Data Structure & Types (Mock Data for Frontend)
interface Product {
  id: string;
  name: string;
  price: number;
  category: 'food' | 'toys' | 'accessories' | 'health';
  description: string;
  image: string;
}

interface CartItem {
  productId: string;
  quantity: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
}

interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'delivered';
}

Technical Implementation Notes

Frontend First: All data will come from mock objects until backend is ready.

Firebase Auth: Reserved for Phase 2.

Payments: Mock “Pay Now” button for MVP, real Paystack integration later.

Vendor Dashboard: Local-only state management for now.

Current Implementation Status
✅ Planned for MVP

Homepage UI.

Catalog & Product pages.

Cart + Checkout flow.

Auth UI (login/register).

Vendor dashboard lite.

PWA configuration.

🔧 Future Enhancements

Real Firebase Auth.

Node.js/Express backend.

Database for products, orders, and vendors.

Payment integration (Paystack/Stripe).

Order tracking system.

Conclusion

This PRD defines the Dogget MVP as a frontend-first PWA with essential e-commerce features for customers and a basic vendor dashboard. The system is designed to be easily extended with backend integrations, payments, and authentication in later phases.
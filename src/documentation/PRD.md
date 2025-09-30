📱 Dogget Mobile PWA — Pet Store E-commerce Platform
Stack: React + Vite, Firebase Auth + Firestore, Tailwind CSS (Mobile-Only), Zustand, React Hook Form, Paystack, PWA

🎯 MVP Phase 1: E-commerce Pet Store (Weeks 1–4)
🛒 Core Shopping Experience
Purpose: Launch a mobile-first online pet store for supplies and products.

Frontend Tasks:

Mobile-optimized product catalog with categories (Food, Toys, Accessories, Health)

Product detail pages with images, descriptions, pricing

Shopping cart with add/remove functionality

User authentication (signup/login)

Checkout flow with Paystack integration

Order confirmation and history

User Journey:

Customer browses products → adds to cart

Creates account or logs in

Completes payment via Paystack

Receives order confirmation

Firebase Notes:

Products: /products/{productId}

Orders: /orders/{orderId}

Users: /users/{uid}

Cart: Local storage + Zustand state management

PWA Features:

Offline product browsing

Add to home screen

Push notifications for order updates

📅 Phase 2: Service Booking System (Future - Weeks 5–8)
🩺 Vet & Grooming Appointments
Purpose: Allow customers to book veterinary and grooming services.

Planned Features:

Service provider listings

Appointment calendar

Booking management

Service provider dashboard

Payment integration for services

Firebase Notes:

Vendors: /vendors/{vendorId}

Bookings: /bookings/{bookingId}

Availability slots in Firestore

🌟 Phase 3: Community Features (Future - Weeks 9–12)
🐾 Pet Owner Community
Purpose: Build a community platform for pet owners.

Planned Features:

Pet profiles (Pawfile)

Lost pet reporting with map

Community forum

Pet care tips and articles

User-generated content

Firebase Notes:

Pets: /users/{uid}/pets

Lost pets: /lostPets/{reportId}

Forum posts: /posts/{postId}

📦 Optional Enhancements (Post-MVP)
Feature	Description
Notifications	Firebase Cloud Messaging or EmailJS alerts
Reviews & Ratings	Let customers rate vendors after service
Chat	Use Firebase Realtime DB or 3rd party widget
Community Forum	Firestore + post/comment system
Admin Panel	Hidden route with admin role to moderate data
Vendor Analytics	Show bookings, sales, earnings charts
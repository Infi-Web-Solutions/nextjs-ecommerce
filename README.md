# Multi-Tenant Next.js E-commerce Platform

A powerful, scalable, and multi-tenant e-commerce solution built with Next.js 15, MongoDB, and Stripe. This platform allows multiple organizations to host their own stores on unique subdomains while sharing a single codebase and database.

## 🚀 Key Features

### 1. Multi-Tenant Architecture
*   **Subdomain-Based Routing**: Each organization (tenant) is identified by its subdomain (e.g., `trendify.localhost`, `snapmart.localhost`).
*   **Data Isolation**: Products, orders, and users are strictly linked to their respective organizations via `organizationId`.
*   **Tenant Management**: Organizations can be managed centrally, with unique settings, logos, and plans.

### 2. Dynamic Internationalization (i18n)
*   **Multi-Language Support**: Built-in support for English (`en`), French (`fr`), and German (`de`).
*   **Database-Driven Translations**: Unlike static JSON files, translations are stored in MongoDB, allowing for real-time updates without redeploying.
*   **Auto-Translation**: Integrated translation service that automatically translates product details into all supported languages during creation.

### 3. Advanced Authentication & RBAC
*   **Admin/Staff Auth**: Custom JWT-based authentication for organization staff.
*   **Customer Auth**: Integrated with NextAuth for social logins (Google, Facebook, GitHub).
*   **Role-Based Access Control (RBAC)**: Granular permissions system (e.g., `product_view`, `product_create`) managed via roles in the database.

### 4. E-commerce & Payments
*   **Product Management**: Full CRUD for products with multi-language support and image uploads.
*   **Stripe Integration**: Secure payment processing via Stripe Checkout with webhook support for order confirmation.
*   **Order Management**: Tracking and managing customer orders per organization.

## 🛠 Tech Stack
*   **Framework**: Next.js 15 (App Router)
*   **Database**: MongoDB (Mongoose ODM)
*   **Authentication**: Custom JWT & NextAuth.js
*   **Payments**: Stripe API
*   **Styling**: Bootstrap 5 & Custom CSS
*   **Animations**: AOS (Animate On Scroll)

## 📂 Project Structure
*   `src/app/[lang]`: Public-facing store routes with language prefixing.
*   `src/app/admin`: Secure dashboard for organization administrators.
*   `src/app/api`: Backend API routes for products, translations, and payments.
*   `src/middleware.js`: Core logic for subdomain extraction, language redirection, and security.
*   `src/models`: Mongoose schemas for Organizations, Users, Products, and Translations.

## ⚙️ How Organizations Work
1.  **Identification**: The platform detects the organization via the `Host` header (subdomain).
2.  **Validation**: Middleware checks if the organization exists and is active.
3.  **Context**: The `OrganizationContext` provides tenant-specific data throughout the application.
4.  **Isolation**: All database queries are filtered by the current organization's ID.

## 🚦 Getting Started

### Prerequisites
*   Node.js 18+
*   MongoDB instance

### Installation
1.  Clone the repository.
2.  Install dependencies: `npm install`.
3.  Set up environment variables in `.env` (see `.env.example`).
4.  Seed the database:
    *   `curl -X POST http://localhost:3001/api/translations/seed`
    *   `curl -X POST http://localhost:3001/api/superadmin/seed`

### Local Development
To test subdomains locally, add the following to your `/etc/hosts` file:
```text
127.0.0.1 trendify.localhost
127.0.0.1 snapmart.localhost
```
Then run: `npm run dev` and visit `http://trendify.localhost:3001`.

## 🔑 Admin Credentials (Seed Data)
*   **Trendify**: `admin@trendify.com` / `admin123`
*   **SnapMart**: `admin@snapmart.com` / `admin123`
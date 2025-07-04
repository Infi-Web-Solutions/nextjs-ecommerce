 Project: ECommerce

This project demonstrates a complete authentication and subscription system using modern tools like JWT, Stripe, MongoDB, and role-based access control, built in a secure and scalable manner.

1. 🔐 JWT (JSON Web Token)
Used for securely authenticating users.

After login, a JWT is generated containing the user's ID, role, and expiration time.

The token is typically stored in cookies or headers.

2. ✅ Token Validation
On every API request or protected route, the token is verified.

Ensures the token is valid, not expired, and has not been tampered with.

Decoded token data (e.g., user ID and role) is used for access control.

3. 🛡️ Middleware Protection
Middleware checks for a valid JWT before granting access to protected routes.

Unauthenticated users are redirected to the login page.

Role-based restrictions are enforced (e.g., only admins can access certain routes).

4. 👥 Role-Based Permissions
Users are assigned roles: admin, staff, or user.

Access and permissions are granted based on roles:

Admin: Full access (create, update, delete)

Staff: Limited access (e.g., view and update)

User: View-only or restricted feature access

5. 💳 Stripe Payment Integration
Stripe handles secure payments and subscriptions.

Users can choose from plans (Free, Pro, Premium).

On plan selection, users are redirected to Stripe Checkout for payment.

6. 📆 Stripe Subscription System
Supports recurring billing (monthly or yearly).

Each plan is linked to a Stripe Price ID.

Stripe manages the billing lifecycle and subscription status.

7. 📩 Webhook Handling
Stripe sends webhook events for actions like successful payments or cancellations.

The backend listens for these events, verifies them, and updates MongoDB accordingly (e.g., user plan, subscription status).

8. 🧾 Plans Management
Plans represent different access tiers: Free, Pro, and Premium.

Each plan is configured in Stripe as a Product with metadata (feature access).

On subscription, metadata is saved in MongoDB and used to determine access control.

9. 🚀 Feature Access Based on Plan
The user's active plan determines which features they can access.

On login, the frontend fetches the enabled features from the database.

The backend enforces feature-level access control using the saved metadata.

🗃️ Database: MongoDB
MongoDB stores user accounts, roles, subscriptions, and feature access.

Document-based structure is used for efficient querying and scalability.

Token data and plan metadata are also saved here.


## 🔧 Setup Instructions

Follow the steps below to run the project locally:

## 1. Install Dependencies

Install all required packages using npm:

```bash
npm install

This will install all dependencies listed in package.json, including:
. Next.js
. Stripe
. Mongoose
. JSON Web Token (JWT)
and other necessary packages

## 2. 🔐 Set Up Environment Variables

1. Copy the example environment file to a new `.env.local` file:

```bash
cp .env.example .env.local

2. Open .env.local and replace the placeholder values with your actual credentials:

# MongoDB connection string
MONGO_URL=mongodb+srv://your-mongo-db-url

# JWT secret key
JWT_SECRET=your_jwt_secret

# Stripe API keys
PAY_SECRET=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key

# Base URL for local development
NEXT_PUBLIC_BASE_URL=http://localhost:3000

##3. Run the Development Server
   Start the development server using:
  npm run dev



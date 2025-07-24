🛒 ECommerce SaaS Platform
    A modern multi-tenant, multilingual SaaS eCommerce application built using Next.js, MongoDB, JWT, Stripe, and NextAuth. This project supports subdomain-based B2B multi-tenancy, role-based access control, dynamic language switching, and automated product translation using MyMemory Translation API.

🚀 Key Features:
🔐 JWT Authentication:
    Secure login system using custom JWT tokens.
    JWT contains user ID, role, organization ID, and expiration.
    Stored securely in cookies for each user session.
    Token contains:
    user ID
    role
    organization ID
    Stored in secure HttpOnly cookies

🧠 Role-Based Access Control (RBAC)
    Three user roles: admin, staff, and user.
    Access managed through permissions:
    Admin: Full CRUD rights.
    Staff: Limited rights (e.g., view/manage products).
    User: View-only access to allowed resources.

🏢 B2B Multi-Tenant System (Organization-Based) 
    Each organization (tenant) operates on a virtual subdomain (e.g., org1.myapp.com, org2.myapp.com).
    Data such as products, users, and settings are isolated by organizationId.
    Middleware ensures that all access is scoped to the current organization.
    Admins can only manage data within their organization. 

📨 User Invitation System via SMTP
   Admins can invite users (admins or staff) to join the platform by email.
   Invitation links are sent via SMTP mail server.
   Invitees can register, set password and name, and are then onboarded with the role assigned in the invite.
   Secure registration flow for invited users only.

📦 Product Management
   Products are stored with multilingual support using translation objects.
   Each organization manages its own product inventory.
   Products can be created, updated, and deleted by authorized roles (admin/staff).

💳 Stripe Subscription & Payments
   Integrated Stripe Checkout for secure payments.
   Multiple plans (Free, Pro, Premium) with recurring billing options.
   Stripe metadata maps features to each plan.
   Webhook handlers update MongoDB with subscription lifecycle events (active, cancelled, etc.).

🌍 Internationalization (i18n) – Multilingual Support
   This SaaS platform supports multilingual content and localized routing using a robust and automated internationalization system built with Next.js App Router, MyMemory Translation API, and MongoDB.
  1.  Built-in internationalization (i18n) using Next.js App Router.
  2.  Product content is auto-translated using MyMemory API.
  3.  Automatic translation of product content via MyMemory API
  4.  Supported Languages: English (default), French, German.
  5.  Admin enters product content in English; translations in fr and de are generated and stored in MongoDB.
  6.  Users can choose their preferred language, which is saved in their user profile (MongoDB).
   Language preference is auto-applied on login via cookie and database sync.
   User language preference saved in cookies and database
   Languages:--
   English (default )  
   French
   German
   Product content auto-translated and stored per language
   Language preferences stored in the database
   Reference: Next.js Internationalization Guide


   🧩 Multilingual Implementation Steps
   1. Dynamic Locale Routing
   2.  All routes are structured using a dynamic [lang] segment, e.g.:
   /en/products
   /fr/products
   /de/products

   The application uses middleware.ts to detect and redirect based on:
    Translation Files (JSON-based)
    src/lib/dictionary/en.json
    src/lib/dictionary/fr.json
    src/lib/dictionary/de.json
    
    Keys are extracted using i18next-parser:
    npm run extract:i18n

    Using Translations in Components
    const t = useTranslations();
    ("homepage.description");
    
   Auto Translation via MyMemory API
   Products are stored in MongoDB in the following structure:
   {
  name: {
    en: "iPhone",
    fr: "iPhone",
    de: "iPhone"
  },
  description: {
    en: "A smartphone by Apple.",
    fr: "Un smartphone d'Apple.",
    de: "Ein Smartphone von Apple."
  }
}
 Admin enters content in English; backend auto-translates to other languages during product creation.


🛂 Social Authentication
   Login via Google, Facebook, and GitHub using NextAuth.js.
   OAuth users are assigned roles and tokens just like traditional logins.
   Secure flow combines OAuth with custom JWT for role and organization enforcement. 

🔗 OAuth Login Integration
    Supports login via:
    Google
    Facebook
    GitHub
    Integrated with NextAuth and custom JWT logic   

⚙️ Technologies Used :-
  1.Frontend: Next.js (App Router)
  2.Backend: Next.js API Routes
  3.Database: MongoDB (Mongoose ODM)
  4.Auth: JWT, NextAuth (OAuth)
  5.Payments: Stripe
  6.SMTP: Nodemailer for email invites
  7.Roles: Admin, Staff, User
  8.Multi-Tenancy: Subdomain routing via Ubuntu’s virtual domain setup


  🛠️ Setup Instructions
  1. Clone the Repository
     git clone https://github.com/your-username/ecommerce-saas.git
     cd ecommerce-saas
  2. Install Dependencies
     npm install
  3. Configure Environment Variables
     cp .env.example .env.local
     Fill in your credentials in .env.local:
     # MongoDB
     MONGO_URL=mongodb+srv://your-mongo-url

     # JWT     
      JWT_SECRET=your_jwt_secret

     # Stripe     
      PAY_SECRET=sk_test_your_secret_key
      STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key

     # App URL     
      NEXT_PUBLIC_BASE_URL=http://localhost:3000

     # Google OAuth     
      GOOGLE_CLIENT_ID=your_google_client_id
      GOOGLE_CLIENT_SECRET=your_google_client_secret

     # Facebook OAuth     
      FACEBOOK_CLIENT_ID=your_facebook_client_id
      FACEBOOK_CLIENT_SECRET=your_facebook_client_secret
      
     # GitHub OAuth
      GITHUB_CLIENT_ID=your_github_client_id
      GITHUB_CLIENT_SECRET=your_github_client_secret

     # NextAuth
      NEXTAUTH_SECRET=your_nextauth_secret
      NEXTAUTH_URL=http://localhost:3000

4. Run Development Server
   npm run dev
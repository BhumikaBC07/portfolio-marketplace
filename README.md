# PortfolioHub — 3D AI Portfolio Marketplace

> Premium portfolio templates for Java engineers, full-stack developers, UI/UX designers, and data scientists.

## ✦ Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| 3D | React Three Fiber, Drei, Three.js |
| Animations | Framer Motion |
| Backend | Node.js, Express.js |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT (custom) |
| Payments | Stripe Checkout + Webhooks |
| AI | OpenAI GPT-4o-mini |
| Hosting | Vercel (frontend) + Railway (backend) |

## ✦ Design

Warm Ivory / Editorial aesthetic:

- **Background:** `#f9f5ef` (warm ivory)
- **Surface:** `#f0ebe0`
- **Primary text:** `#1a0f08` (deep ink)
- **Muted text:** `#6a5a4a` (taupe)
- **Accent / CTA:** `#2c1810` (espresso)
- **Borders:** `#d8d0c4`
- **Typography:** DM Serif Display (headings) + Inter (body)

## ✦ Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Stripe account
- OpenAI API key

---

### 1. Clone & Install

```bash
git clone https://github.com/yourname/portfolio-marketplace
cd portfolio-marketplace

# Install backend
cd backend && npm install

# Install frontend
cd ../frontend && npm install
```

---

### 2. Set Up Backend Environment

```bash
cd backend
cp .env.example .env
```

Fill in `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/portfolio_marketplace"
JWT_SECRET=your-32-char-random-secret
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
OPENAI_API_KEY=sk-...
FRONTEND_URL=http://localhost:3000
PORT=5000
```

---

### 3. Set Up Frontend Environment

```bash
cd frontend
cp .env.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

### 4. Database Setup

```bash
cd backend

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with 16 portfolios + demo users
npm run db:seed
```

**Demo accounts after seeding:**

| Role | Email | Password |
|------|-------|----------|
| User | test@example.com | user123 |
| Admin | admin@portfoliohub.com | admin123 |

---

### 5. Run Development Servers

```bash
# Terminal 1 — Backend (port 5000)
cd backend && npm run dev

# Terminal 2 — Frontend (port 3000)
cd frontend && npm run dev
```

Visit: http://localhost:3000

---

## ✦ Project Structure

```
portfolio-marketplace/
├── frontend/                    # Next.js 14 App
│   ├── app/
│   │   ├── page.tsx             # Homepage (hero + featured + pricing)
│   │   ├── layout.tsx           # Root layout with Navbar + Footer
│   │   ├── not-found.tsx        # 404 page
│   │   ├── portfolios/
│   │   │   ├── page.tsx         # Browse all portfolios
│   │   │   └── [id]/page.tsx    # Portfolio detail + purchase
│   │   ├── pricing/page.tsx     # Pricing tiers
│   │   ├── dashboard/page.tsx   # User dashboard + AI bio
│   │   ├── admin/page.tsx       # Admin CRUD panel
│   │   └── auth/
│   │       ├── login/page.tsx
│   │       └── signup/page.tsx
│   ├── components/
│   │   ├── Hero3D.tsx           # Three.js floating shapes
│   │   ├── Navbar.tsx           # Sticky editorial navbar
│   │   ├── PortfolioCard.tsx    # Card + skeleton
│   │   ├── PricingTable.tsx     # 3-tier pricing
│   │   └── Footer.tsx
│   ├── lib/
│   │   ├── api.ts               # Axios instance + types
│   │   └── auth-context.tsx     # Auth state management
│   ├── styles/globals.css       # Fonts + Tailwind + custom components
│   └── tailwind.config.ts       # Custom ivory/espresso tokens
│
└── backend/                     # Express.js API
    ├── server.js                # Entry point
    ├── routes/
    │   ├── auth.js              # POST /register, /login
    │   ├── portfolios.js        # CRUD + reviews
    │   ├── payments.js          # Stripe checkout + webhook
    │   ├── users.js             # Dashboard data
    │   └── ai.js                # OpenAI bio generator
    ├── middleware/
    │   └── auth.js              # JWT + role guards
    └── prisma/
        ├── schema.prisma        # DB models
        └── seed.js              # 16 portfolios + demo users
```

---

## ✦ API Reference

### Auth
```
POST /api/auth/register    { name, email, password }
POST /api/auth/login       { email, password }
```

### Portfolios
```
GET  /api/portfolios              ?category, tier, sort, search, page, limit
GET  /api/portfolios/featured
GET  /api/portfolios/:id
POST /api/portfolios              [Admin] Create portfolio
PUT  /api/portfolios/:id          [Admin] Update portfolio
DEL  /api/portfolios/:id          [Admin] Delete portfolio
POST /api/portfolios/:id/reviews  [Auth] Add review
```

### Payments
```
POST /api/payments/checkout    [Auth] Create Stripe session
GET  /api/payments/verify      [Auth] Verify purchase by session_id
POST /api/payments/webhook     Stripe webhook (raw body)
```

### User
```
GET /api/user/dashboard    [Auth] Full dashboard data
PUT /api/user/profile      [Auth] Update name/image
```

### AI
```
POST /api/ai/generate-bio  [Auth] Generate portfolio bio via OpenAI
```

---

## ✦ Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Get your test keys from the Stripe Dashboard
3. Set up webhook:
   ```bash
   # For local development, use Stripe CLI:
   stripe listen --forward-to localhost:5000/api/payments/webhook
   ```
4. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

---

## ✦ Deployment

### Frontend → Vercel

```bash
cd frontend
npx vercel --prod
```

Set environment variables in Vercel Dashboard.

### Backend → Railway

1. Create new project at https://railway.app
2. Add PostgreSQL plugin
3. Deploy from GitHub
4. Set all environment variables
5. Copy the `DATABASE_URL` from Railway PostgreSQL

---

## ✦ Features

- **3D Hero** — Floating ivory geometric planes, boxes, and rings via React Three Fiber
- **16 Portfolio Templates** — 4 per category (Full Stack, Web Dev, UI/UX, Data Science)
- **Stripe Payments** — Full checkout flow with webhook confirmation
- **AI Bio Generator** — OpenAI-powered professional bio creation
- **Role-based Access** — Free/watermarked vs. Pro/full access
- **Admin Panel** — Full CRUD for portfolio management
- **Toast Notifications** — react-hot-toast throughout
- **Loading Skeletons** — Shimmer skeletons on all data-fetching views
- **Fully Responsive** — Editorial grid collapses cleanly on mobile
- **SEO Ready** — Metadata API + OG tags per page

---

## ✦ License

MIT — Free to use for personal and commercial projects.

# PortfolioHub

### A full-stack AI portfolio marketplace that helps tech professionals find, buy, and deploy polished portfolio templates — and get hired faster.

![Next.js](https://img.shields.io/badge/Next.js_14-black?style=flat-square&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=flat-square&logo=stripe&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=flat-square&logo=openai&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-black?style=flat-square&logo=vercel&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=flat-square&logo=railway&logoColor=white)

---

## Live Demo

> ![PortfolioHub Demo][

https://github.com/user-attachments/assets/4783f24c-74c8-4fd1-a1cf-bdaf335d4586

]

🌐 **Production:** [portfolio-marketplace-tan.vercel.app](https://portfolio-marketplace-tan.vercel.app)  


Visit the live URL to browse all 16 templates, filter by tech category and pricing tier, and test the full purchase flow using Stripe test cards.

> **Test credentials**  
> User: `test@example.com` / `user123`  
> Admin: `admin@portfoliohub.com` / `admin123`  
> Stripe test card: `4242 4242 4242 4242` · any future expiry · any CVC

---

## What It Does

PortfolioHub is a marketplace where software engineers, designers, and data scientists browse and purchase premium portfolio templates tailored to their specific role. Templates are gated across three subscription tiers — Free, Pro, and Agency — so every user gets immediate value without a paywall while paid tiers unlock full source code and a commercial license. An integrated OpenAI bio generator turns a list of skills into a publication-ready professional summary in under 60 seconds. The entire product, from browsing and purchasing to downloading and deploying, is production-hosted across Vercel and Railway with a real PostgreSQL database, live Stripe webhooks, and role-based access control.

---

## Key Features

- **3D animated hero** built with React Three Fiber and Three.js — floating ivory geometric planes, boxes, and torus rings rendered in a WebGL canvas with zero layout impact on the rest of the page
- **JWT authentication with RBAC** — register/login flow issues signed tokens; middleware guards distinguish `USER`, `ADMIN`, and tier-level (`FREE` / `PRO` / `AGENCY`) permissions on every protected route
- **Stripe Checkout + webhook confirmation** — payment sessions created server-side, purchase records written to PostgreSQL only after the `checkout.session.completed` webhook fires, preventing any client-side spoofing
- **Tier-gated content delivery** — Free users see watermarked previews; Pro and Agency purchases unlock full source downloads; plan upgrades are applied automatically at webhook time
- **OpenAI bio generator** — GPT-4o-mini takes a job title, comma-separated skills, years of experience, and a tone preference, then returns a 150–200 word first-person portfolio bio
- **Prisma ORM on PostgreSQL** — four models (User, Portfolio, Purchase, Review) with full relational integrity, seeded with 16 portfolios across 4 tech categories via a reproducible seed script

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | Next.js 14 (App Router), TypeScript | Page routing, SSR, client components |
| Styling | Tailwind CSS, custom design tokens | Warm ivory / editorial theme |
| 3D | React Three Fiber, Drei, Three.js | WebGL hero animation |
| Backend | Node.js, Express.js | REST API, auth middleware, business logic |
| Database | PostgreSQL, Prisma ORM | Data persistence, schema migrations, seeding |
| Auth | JSON Web Tokens (JWT), bcryptjs | Stateless auth, password hashing |
| Payments | Stripe Checkout, Stripe Webhooks | Purchase sessions, event-driven confirmation |
| AI | OpenAI API (GPT-4o-mini) | Portfolio bio generation |
| Frontend Hosting | Vercel | CI/CD, edge delivery, environment management |
| Backend Hosting | Railway | Express server, managed PostgreSQL |

---

## Architecture Note

The frontend and backend live on separate infrastructure — Next.js on Vercel, Express on Railway — which creates a split-origin environment where naive client-side `fetch` calls fail with DNS resolution errors and CORS rejections in production. To solve this cleanly, all API traffic is routed through a Next.js API proxy layer: the browser calls `/api/*` on the same Vercel origin, and the proxy rewrites those requests to the Railway backend with the correct `Authorization` headers forwarded. This eliminates the `ERR_NAME_NOT_RESOLVED` class of failures entirely, keeps the Railway backend URL out of the client bundle, and means CORS configuration on Express only needs to trust one origin — the Vercel domain — rather than every possible preview deployment URL. The pattern adds one network hop in exchange for a significantly simpler and more maintainable security surface.

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+ (local) or a Railway PostgreSQL instance
- Stripe account (test mode keys are sufficient)
- OpenAI API key

### 1. Clone and install

```bash
git clone https://github.com/yourusername/portfolio-marketplace.git
cd portfolio-marketplace

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 2. Configure environment variables

**Backend** — create `backend/.env`:

```
DATABASE_URL
PORT
NODE_ENV
FRONTEND_URL
JWT_SECRET
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
OPENAI_API_KEY
```

**Frontend** — create `frontend/.env.local`:

```
NEXT_PUBLIC_API_URL
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```

See `.env.example` in each directory for descriptions of every key.

### 3. Set up the database

```bash
cd backend

# Push the Prisma schema to your database
npx prisma db push

# Seed with 16 portfolio templates + two demo accounts
node prisma/seed.js
```

### 4. Run locally

```bash
# Terminal 1 — Express backend (default: port 8080)
cd backend && npm run dev

# Terminal 2 — Next.js frontend (default: port 3000)
cd frontend && npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## API Routes

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | None | Create a new user account |
| `POST` | `/api/auth/login` | None | Authenticate and receive a JWT |
| `GET` | `/api/portfolios` | Optional | List portfolios with category / tier / sort / search filters |
| `GET` | `/api/portfolios/:id` | Optional | Single portfolio detail; includes `hasPurchased` flag if authenticated |
| `POST` | `/api/payments/checkout` | Required | Create a Stripe Checkout session for a given portfolio |
| `POST` | `/api/payments/webhook` | Stripe sig | Confirm purchase, write Purchase record, upgrade user plan |
| `GET` | `/api/user/dashboard` | Required | Return authenticated user's profile, purchases, and review history |
| `POST` | `/api/ai/generate-bio` | Required | Generate a portfolio bio from skills + job title via OpenAI |
| `POST` | `/api/portfolios` | Admin | Create a new portfolio listing |
| `PUT` | `/api/portfolios/:id` | Admin | Update an existing portfolio listing |
| `DELETE` | `/api/portfolios/:id` | Admin | Delete a portfolio listing |

---

## Project Metrics

| Templates | Categories | API Routes | Frontend Pages | Subscription Tiers | AI Features |
|:---------:|:----------:|:----------:|:--------------:|:-----------------:|:-----------:|
| 16 | 4 | 11 | 6 | 3 | 1 |

---

## Roadmap

- **Template submissions** — allow community contributors to submit and monetize their own portfolio templates through a review queue
- **AI template recommender** — analyze a user's GitHub profile or uploaded resume and surface the 3 most relevant templates using embeddings and cosine similarity
- **OAuth login** — add Google and GitHub sign-in via NextAuth.js to reduce friction on the registration step
- **Team workspaces** — let Agency-tier users manage multiple member seats and shared template libraries from a unified dashboard

---

## License

MIT — free to use for personal and commercial projects. See [LICENSE](./LICENSE) for details.

---

<p align="center">Built by <a href="https://github.com/BhumikaBC07">Bhumika</a> · <a href="https://portfolio-marketplace-tan.vercel.app">Live Demo</a></p>

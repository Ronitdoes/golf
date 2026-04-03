<div align="center">

<br />

<pre>
██████╗  ██████╗ ██╗     ███████╗     ██████╗██╗  ██╗ █████╗ ██████╗ ██╗████████╗██╗   ██╗
██╔════╝ ██╔═══██╗██║     ██╔════╝    ██╔════╝██║  ██║██╔══██╗██╔══██╗██║╚══██╔══╝╚██╗ ██╔╝
██║  ███╗██║   ██║██║     █████╗      ██║     ███████║███████║██████╔╝██║   ██║    ╚████╔╝ 
██║   ██║██║   ██║██║     ██╔══╝      ██║     ██╔══██║██╔══██║██╔══██╗██║   ██║     ╚██╔╝  
╚██████╔╝╚██████╔╝███████╗██║         ╚██████╗██║  ██║██║  ██║██║  ██║██║   ██║      ██║   
 ╚═════╝  ╚═════╝ ╚══════╝╚═╝          ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝   ╚═╝      ╚═╝
</pre>

### `SUBSCRIBE · PLAY · GIVE`

**A competitive golf performance platform that turns every scorecard into an act of charity.**

<br />

[![Next.js](https://img.shields.io/badge/Next.js_14-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)

<br />

</div>

---

## ✦ What is DigitalHero?

DigitalHero is a **full-stack subscription platform** fusing competitive Stableford golf scoring with automated monthly prize draws and real-time charitable impact. Players subscribe, log scores, choose a charity beneficiary, and compete in algorithmic draw events — all through a premium, immersive web experience.

> The platform is built on the **Foundry Intelligence** design system: an ultra-dark, high-contrast aesthetic driven by emerald tactical accents, 3D environmental lighting, and surgical typographic hierarchy.

---

## 🗺️ Platform Architecture

```
digitalhero/
├── app/
│   ├── (auth)/           → Login & Signup flows (Server Components)
│   ├── admin/            → Admin command center (Panel, Users, Draws, Winners, Analytics, Charities)
│   ├── api/              → API routes (Razorpay webhooks, draw triggers)
│   ├── auth/             → Supabase OAuth callback handler
│   ├── charities/        → Public charity showcase
│   ├── dashboard/        → Subscriber player dashboard (Overview, Scores, Charity, Draws, Winnings, Settings)
│   ├── subscribe/        → Razorpay subscription checkout flow
│   └── page.tsx          → Public landing page (3D Hero + Marketing Sections)
│
├── components/
│   ├── admin/            → Admin layout & panel components
│   ├── canvas/           → Three.js / React-Three-Fiber 3D Scene
│   ├── charities/        → Charity cards & contribution slider
│   ├── dashboard/        → Dashboard shared UI components
│   ├── payments/         → Razorpay checkout components
│   ├── providers/        → Lenis smooth-scroll provider
│   ├── scores/           → ScoreEntry, ScoreList, ScoreCard
│   ├── sections/         → Landing page sections (Hero, HowItWorks, CharityImpact, DrawMechanics, CTA)
│   └── ui/               → Shared primitives (AuthForm, etc.)
│
├── lib/                  → Supabase client, analytics helpers
├── hooks/                → Custom hooks (e.g. useReducedMotion)
├── emails/               → Transactional email templates (Resend)
├── scripts/              → CLI utilities (admin account generation)
└── schema.sql            → Complete Supabase PostgreSQL schema
```

---

## ⚙️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 14 (App Router) | Full-stack SSR & API routes |
| **Language** | TypeScript 5 | End-to-end type safety |
| **Database** | Supabase (PostgreSQL) | Auth, RLS, Realtime, Edge Functions |
| **Payments** | Razorpay | Subscription billing & webhook verification |
| **3D Engine** | Three.js + React Three Fiber | Immersive interactive hero scene |
| **Animation** | Framer Motion + GSAP | Page transitions, scroll orchestration |
| **Scroll** | Lenis (`@studio-freight/lenis`) | High-fidelity native smooth scrolling |
| **Styling** | Tailwind CSS v3 | Utility-first design system |
| **Charts** | Recharts | Admin analytics dashboards |
| **Email** | Resend | Transactional notification emails |
| **Validation** | Zod | Client & server-side schema validation |
| **State** | Zustand | Lightweight global state management |
| **Auth** | Supabase SSR (`@supabase/ssr`) | Server-side session management & middleware |
| **Testing** | Jest + ts-jest | Unit & integration testing |

---

## 🗄️ Database Schema

Built on **Supabase PostgreSQL** with strict Row Level Security enforced on every table.

```
profiles          → User accounts, subscription status, selected charity, admin flag
scores            → Stableford scores (max 5, rolling window enforced by DB trigger)
charities         → Featured charitable organizations
charity_events    → Charity event listings
draws             → Monthly prize draw records (draft → simulation → published)
draw_results      → Winner records with prize amounts and proof upload URLs
subscriptions_log → Full audit trail of subscription lifecycle events
```

### 🔐 Security Model
- **Row Level Security (RLS)** enabled on all tables
- `is_admin()` SQL helper function scopes full data access to administrative nodes
- Users can only read/write their own data; admins have platform-wide access
- A **DB trigger** (`maintain_five_scores`) auto-deletes the oldest score when a user exceeds 5 entries, enforcing the rolling performance window

---

## 🎨 Foundry Design System

The entire platform is styled under the **Foundry Dark Protocol** — a luxury, high-fidelity dark-mode aesthetic.

| Token | Value | Usage |
|---|---|---|
| System Active | `#22C55E` (Emerald-500) | Active states, CTAs, live indicators |
| Foundry Core | `#060606` | Primary background |
| Glass Surface | `bg-white/[0.01–0.05]` | Card & sidebar backgrounds |
| Active Border | `border-green-500/20` | Focused elements |
| Header Style | `font-black tracking-[-0.04em] leading-[0.9]` | Display headings (uppercase block) |
| Label Style | `text-[10px] font-black uppercase tracking-[0.2em]` | System labels & metrics |

### Key Visual Techniques
- **Glassmorphism** — `bg-white/[0.01]` surfaces with `border-white/5` borders
- **Environmental Lighting** — Radial green glow orbs (`blur-[150px]`) for atmospheric depth
- **Neon Accents** — `shadow-[0_0_20px_rgba(34,197,94,0.8)]` on active indicators
- **Gradient Progress Bars** — `from-green-500 to-emerald-400` with neon shadow

---

## 📡 Subscriber Platform Features

### 🏌️ Score Intake Terminal
Log Stableford scores (1–45 pts) with strict Zod client-side validation. The DB enforces a **5-score rolling window** — submitting a 6th automatically purges the oldest node.

### 🎯 Charity Impact Allocation
Choose a featured charity and set a contribution weighting (10–100%) via a live-synced slider. Updates propagate atomically to the database via server actions.

### 🎱 Automated Draw Participation
Scores unlock monthly draw entries. Draw logic runs algorithmically against registered participation nodes and publishes results with match-count prize tiers (3, 4, or 5 matches).

### 🏆 Winnings & Proof Hub
Winners upload proof of identity directly through the platform. Admins verify and mark prizes as paid through the administrative panel.

---

## 🛂 Admin Command Center

| Route | Capability |
|---|---|
| `/admin` | Platform overview — user count, revenue, active subscribers |
| `/admin/users` | Full subscriber management, subscription controls |
| `/admin/draws` | Create, simulate, and publish monthly prize draws |
| `/admin/charities` | Manage the charity registry and featured status |
| `/admin/winners` | Review & verify draw result claims and proof uploads |
| `/admin/reports` | Analytics dashboards (Recharts) — revenue, charity impact |

---

## 🚀 Getting Started

### Prerequisites
- Node.js `>=18`
- A [Supabase](https://supabase.com/) project
- A [Razorpay](https://razorpay.com/) account

### 1. Clone & Install

```bash
git clone https://github.com/Ronitdoes/golf.git
cd golf
npm install
```

### 2. Configure Environment

```bash
cp .env.local.example .env.local
```

Populate your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Initialize the Database

Run `schema.sql` in the **Supabase SQL Editor** to set up all tables, triggers, indexes, and RLS policies.

### 4. Launch

```bash
npm run dev
```

Visit `http://localhost:3000` 🟢

### 5. Create an Admin User

```bash
npx ts-node scripts/generate-admin.ts
```

---

## 🧪 Testing

```bash
npm run test        # Run all unit/integration tests
npm run lint        # ESLint code quality check
npm run build       # Production build validation
```

---

## 🌐 Deployment

The platform is optimized for **Vercel** with `force-dynamic` rendering on all protected routes (dashboard, admin, subscribe) to ensure server-side session validation on every request.

```bash
# Production build
npm run build
npm run start
```

> **Note:** Ensure Razorpay webhook events are configured to point to your production URL at `/api/webhooks/razorpay`.

---

<div align="center">

<br />

**Built with intention. Designed with precision.**

`SUBSCRIBE · PLAY · GIVE · REPEAT`

<br />

![Foundry Status](https://img.shields.io/badge/STATUS-LIVE%20NODE-22C55E?style=for-the-badge)

</div>

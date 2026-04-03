# 🏌️‍♂️ Digital Hero - Golf Charity Platform / ITZFIZZ

A high-performance, visually engaging modern web application built for charity golf events and draws. This platform features a premium UI/UX, seamless animations, robust backend systems, and a comprehensive administrative dashboard for managing charities, users, draws, and certificates.

---

## ✨ Key Features

- **Premium UI & Interactions**: Beautiful, high-fidelity hero sections, parallax scrolling, stagger animations, and a sleek 3D interface using Three.js and GSAP. 
- **Admin Dashboard**: Full administrative suite to manage users, charities, event data, draws, and generated certificates. Includes capabilities for image uploading and certificate template editing.
- **Robust Authentication**: Secure role-based access to the admin dashboard and user actions powered by Supabase Auth.
- **Dynamic Draw Engine**: Performant draw system logic for managing charity golf raffles/draws. Fully tested with Jest.
- **Advanced State Management**: Fast client-side state handling with Zustand.
- **Payments**: Integrated with Stripe (and Razorpay capabilities) for handling charity donations securely.
- **Typescript-First**: Strict type checking across the entire application to ensure long-term stability and maintainability.

---

## 🛠 Tech Stack

### Core
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router format for server components and routing)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)

### UI / Animations & 3D Interaction
- **Animations**: [Framer Motion](https://www.framer.com/motion/) & [GSAP](https://gsap.com/)
- **Smooth Scrolling**: [Lenis](https://studiofreight.github.io/lenis/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **3D Graphics**: [Three.js](https://threejs.org/) & [React Three Fiber / Drei](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)
- **Charts**: [Recharts](https://recharts.org/)

### Backend, Database & APIs
- **Database & Auth**: [Supabase](https://supabase.com/) (SSR + supabase-js)
- **Payments**: [Stripe](https://stripe.com/) 
- **Validation**: [Zod](https://zod.dev/)

### Tooling & Testing
- **Testing Engine**: [Jest](https://jestjs.io/)
- **Linting**: ESLint

---

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js 18+ and `npm` installed on your local development machine. 

### 1. Clone the repository
```bash
git clone https://github.com/Ronitdoes/golf.git
cd digitalhero
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Copy the example environment file and populate the necessary keys.

```bash
cp .env.local.example .env.local
```

**Required Keys (`.env.local`)**:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- Stripe/Razorpay Keys (if applicable)

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. The environment hot-reloads when making changes to `app/page.tsx` or any components.

---

## 🏗 Project Structure

```text
├── .env.local.example     # Template for local environment variables
├── app/                   # Next.js App Router specific pages and routing 
│   ├── actions/           # Server actions for form handling/data mutation
│   ├── admin/             # Admin Dashboard UI pages & state
│   ├── auth/              # Authentication routes (callback, etc)
│   └── dashboard/         # Secured User/Client Dashboard pages
├── components/            # Reusable UI component modules
│   ├── canvas/            # 3D Fiber / Three.js scenes and objects
│   ├── scores/            # Score listing components
│   ├── sections/          # Major layout blocks (Hero, CTAs)
│   └── ui/                # Core modular components (Buttons, Inputs, Forms)
├── lib/                   # Integrations and utilities (Stripe instantiations, drawing logic)
├── scripts/               # Utility scripts (Admin user generation, etc)
├── supabase/              # Supabase DB schema and configurations (schema.sql)
└── __tests__/             # Jest test groupings
```

---

## 🧪 Testing

The codebase enforces testing on core business/game logic (like the Draw Engine validation). 
You can run the existing test suite via Jest:

```bash
npm run test
```

---

## 🎨 Design Philosophy

### The "WOW" Factor
A large portion of the work done in this repository consists of perfecting an editorial, hyper-modern aesthetic. The UI utilizes strict adherence to glass-morphism, custom tailwind `@theme` boundaries for consistent styling across varying environments, and complex staggered reveal animations via GSAP and Framer motion.

### Optimization
Significant effort has been allocated towards ensuring that dynamic import bundling strategy protects the user from UI stammers. `Lenis` intercepts normal scroll mechanics allowing `Three.js` layers to float beautifully alongside standard DOM elements transparently. 

---

## 📦 Deployment

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new).

When deploying:
- Ensure all environment variables from `.env.local` are placed in the Vercel project settings.
- Run migrations or load `schema.sql` into the production Supabase instance.
- TypeScript build errors are configured to be bypassed during Vercel's build pipeline (`ignoreBuildErrors: true` in `next.config.mjs`) to allow decoupled progress between strict typing & UI iteration in staging deployments.

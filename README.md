# 🖥️ Crypto Terminal

Terminal de trading privé style Bloomberg — Next.js 15 · TypeScript · Tailwind · Clerk · Prisma

## Stack

| Couche | Tech |
|---|---|
| Framework | Next.js 15 (App Router) |
| Auth | Clerk |
| DB | PostgreSQL via Prisma |
| UI | Tailwind CSS v4 + shadcn/ui |
| Charts | TradingView Widget |
| i18n | next-intl (fr/en) |
| Chiffrement | Web Crypto API (AES-GCM) |

## Structure

```
crypto-terminal/
├── app/
│   ├── globals.css
│   ├── layout.tsx            ← Root layout (Clerk + i18n + ThemeProvider)
│   ├── page.tsx              ← Landing publique
│   └── dashboard/
│       ├── layout.tsx        ← Layout protégé (Sidebar + Topbar)
│       ├── page.tsx          ← Dashboard principal
│       ├── Card.tsx          ← Composant carte réutilisable
│       ├── Chart.tsx         ← Widget TradingView
│       ├── Stats.tsx         ← Stats de performance
│       └── Watchlist.tsx     ← Watchlist actifs
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   └── badge.tsx
│   ├── Journal.tsx           ← Journal de trades
│   ├── PortfolioTable.tsx
│   ├── Sidebar.tsx
│   ├── Ticker.tsx            ← Ticker défilant
│   ├── Topbar.tsx
│   ├── TradingChart.tsx      ← Chart TradingView (SSR-safe)
│   └── VaultModal.tsx        ← Modal vault sécurisé
├── lib/
│   ├── crypto.ts             ← Chiffrement AES-GCM (PBKDF2)
│   ├── metaapi.ts            ← Intégration MetaAPI
│   ├── tradeMetrics.ts       ← Calculs winrate / stats
│   └── utils.ts              ← cn() et utilitaires
├── prisma/
│   └── schema.prisma
├── i18n/
│   └── routing.ts
├── messages/
│   ├── fr.json
│   └── en.json
├── middleware.ts
├── .env.local.example
├── .gitignore
├── next.config.mjs
├── package.json
└── tsconfig.json
```

## Installation

```bash
# 1. Cloner et installer
git clone https://github.com/ton-user/crypto-terminal
cd crypto-terminal
npm install

# 2. Variables d'environnement
cp .env.local.example .env.local
# → Remplir les valeurs dans .env.local

# 3. Base de données
npx prisma generate
npx prisma db push

# 4. Lancer en dev
npm run dev
```

## Variables d'environnement requises

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
DATABASE_URL=postgresql://...
NEXT_PUBLIC_ENCRYPTION_SALT=ton_salt_unique_ici
METAAPI_TOKEN=ton_token_metaapi
```

## Scripts

```bash
npm run dev          # Développement
npm run build        # Build production
npm run lint         # Lint ESLint
npm run prisma:push  # Push schema DB
```

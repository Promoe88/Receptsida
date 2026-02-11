# 🍳 MatKompass — Sveriges smartaste receptverktyg

## Arkitektur

```
┌─────────────────────────────────────────────────────────────┐
│                        CDN / Edge                           │
│              Vercel Edge Network / Cloudflare                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌──────────────┐         ┌──────────────────────┐        │
│   │   Frontend    │  ←───→  │      Backend API      │       │
│   │   Next.js 14  │         │     Node + Express    │       │
│   │   App Router  │         │     /api/v1/*         │       │
│   └──────────────┘         └──────────┬───────────┘        │
│                                       │                     │
│                          ┌────────────┼────────────┐       │
│                          │            │            │        │
│                    ┌─────▼───┐  ┌─────▼───┐ ┌─────▼───┐   │
│                    │PostgreSQL│  │  Redis   │ │Claude AI│   │
│                    │ (Prisma) │  │ (Cache)  │ │  + Web  │   │
│                    │          │  │          │ │ Search  │   │
│                    └──────────┘  └──────────┘ └─────────┘   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                    Auth: JWT + Refresh Tokens                │
│                    Rate Limit: Redis sliding window          │
│                    Cache: Recipe results 24h TTL             │
└─────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Lager | Teknologi | Motivering |
|-------|-----------|------------|
| Frontend | Next.js 14 (App Router) | SSR, edge-rendering, SEO |
| Styling | Tailwind CSS | Snabb utveckling, konsistent design |
| Backend | Node.js + Express | Robust, skalbart, stort ekosystem |
| Databas | PostgreSQL + Prisma ORM | Relationell data, type-safe queries |
| Cache | Redis | Snabb caching, rate limiting, sessions |
| AI | Claude API + Web Search | Receptgenerering, webbsökning |
| Auth | JWT + bcrypt | Stateless auth, säker lösenordshantering |
| Deploy | Vercel (frontend) + Railway/Fly.io (backend) | Edge-nära, auto-scaling |

## Kom igång

### Förutsättningar
- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- Anthropic API-nyckel

### Installation

```bash
# Klona och installera
git clone https://github.com/ditt-repo/matkompass.git
cd matkompass

# Backend
cd backend
cp .env.example .env    # Fyll i dina nycklar
npm install
npx prisma migrate dev
npm run seed             # Ladda lexikon
npm run dev

# Frontend (ny terminal)
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

### Miljövariabler

**Backend `.env`:**
```
DATABASE_URL=postgresql://user:pass@localhost:5432/matkompass
REDIS_URL=redis://localhost:6379
ANTHROPIC_API_KEY=sk-ant-...
JWT_SECRET=din-hemliga-nyckel-minst-32-tecken
JWT_REFRESH_SECRET=annan-hemlig-nyckel
CORS_ORIGIN=http://localhost:3000
PORT=4000
NODE_ENV=development
```

**Frontend `.env.local`:**
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

## API Endpoints

| Method | Endpoint | Auth | Beskrivning |
|--------|----------|------|-------------|
| POST | /api/v1/auth/register | - | Registrera konto |
| POST | /api/v1/auth/login | - | Logga in |
| POST | /api/v1/auth/refresh | - | Förnya token |
| POST | /api/v1/recipes/search | ✓ | Sök recept med AI |
| GET | /api/v1/recipes/:id | ✓ | Hämta sparat recept |
| GET | /api/v1/recipes/history | ✓ | Användarens recepthistorik |
| POST | /api/v1/recipes/:id/save | ✓ | Spara favorit |
| GET | /api/v1/lexicon/suggest | - | Autocomplete-förslag |

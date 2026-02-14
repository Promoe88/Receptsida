# Nisse — Sveriges smartaste receptverktyg

Skriv in dina ingredienser — vi soker bland riktiga recept pa natet och anpassar dem efter dig.

## Tech Stack

- Frontend: Next.js 14, Tailwind CSS, Zustand
- Backend: Node.js, Express, Prisma ORM
- Databas: PostgreSQL + Redis
- AI: Claude API med webbsokning
- Deploy: Vercel (frontend) + Railway (backend)

## Kom igang

1. docker compose up -d
2. cd backend && cp .env.example .env && npm install && npx prisma migrate dev && npm run seed && npm run dev
3. cd frontend && cp .env.example .env.local && npm install && npm run dev
4. Oppna http://localhost:3000

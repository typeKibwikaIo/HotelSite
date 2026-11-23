# Hotel Website

Single-hotel website + admin dashboard built with Next.js 16 (App Router), TypeScript, Tailwind CSS 4, and Prisma + PostgreSQL (Supabase).

## Commands

- `npm run dev` — start dev server (http://localhost:3000)
- `npm run build` / `npm start` — production build / serve
- `npx prisma db push` — sync schema to the database
- `npx prisma migrate dev` — create/apply migrations (needs session pooler, see below)
- `npm run db:seed` — seed admin user, settings, rooms, facilities, gallery, testimonials

## Environment

`.env` requires:

- `DATABASE_URL` — Supabase **transaction pooler** (port 6543) for the app runtime:
  `postgresql://postgres.<project-ref>:<password>@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1`
- `SESSION_SECRET` — HMAC secret for admin sessions

For Prisma CLI commands that need advisory locks (`migrate dev`, `migrate resolve`), use the **session pooler** instead (same host, port 5432, no `pgbouncer` param).

## Deployment (Vercel)

Set `DATABASE_URL` and `SESSION_SECRET` in the Vercel project environment variables (Production + Preview), then redeploy. The build prerenders pages that query the DB, so `DATABASE_URL` must be present at build time.

## Access

- Public site: `/`
- Admin login: `/admin/login` — seeded credentials `admin@hotel.com` / `admin123` (change in production)

## Architecture notes

- `src/lib/availability.ts` — availability math: bookable physical rooms minus overlapping active reservations; MAINTENANCE/BLOCKED rooms excluded from inventory.
- `src/lib/auth.ts` — HMAC-signed cookie sessions, scrypt password hashing.
- `src/app/admin/actions.ts` — all admin server actions (require `requireAdmin()`).
- `src/app/actions/booking.ts` — public reservation creation with server-side availability re-validation.
- Room categories (`RoomCategory`) are the public listings; `PhysicalRoom` rows are sellable inventory; `ReservationRoom` links a reservation to a category with a quantity.
- `cacheComponents` is disabled in `next.config.ts` (Next 16 defaults it on, which conflicts with request-time Prisma data here).
- `@supabase/supabase-js` and `@supabase/ssr` are installed for future Supabase Auth/Storage use; the app currently uses Prisma + custom cookie auth.

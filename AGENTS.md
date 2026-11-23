# Hotel Website

Single-hotel website + admin dashboard built with Next.js 16 (App Router), TypeScript, Tailwind CSS 4, and Prisma + SQLite.

## Commands

- `npm run dev` — start dev server (http://localhost:3000)
- `npm run build` / `npm start` — production build / serve
- `npm run db:migrate` — create/apply Prisma migrations
- `npm run db:seed` — seed admin user, settings, rooms, facilities, gallery, testimonials

## Access

- Public site: `/`
- Admin login: `/admin/login` — seeded credentials `admin@hotel.com` / `admin123` (change in production)

## Architecture notes

- `src/lib/availability.ts` — availability math: bookable physical rooms minus overlapping active reservations (PENDING/CONFIRMED/CHECKED_IN/CHECKED_OUT/COMPLETED/NO_SHOW); MAINTENANCE/BLOCKED rooms excluded from inventory.
- `src/lib/auth.ts` — HMAC-signed cookie sessions, scrypt password hashing.
- `src/app/admin/actions.ts` — all admin server actions (require `requireAdmin()`).
- `src/app/actions/booking.ts` — public reservation creation with server-side availability re-validation.
- Room categories (`RoomCategory`) are the public listings; `PhysicalRoom` rows are sellable inventory; `ReservationRoom` links a reservation to a category with a quantity.
- `cacheComponents` is disabled in `next.config.ts` (Next 16 defaults it on, which conflicts with request-time Prisma data here).

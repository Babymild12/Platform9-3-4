# Platform9-3-4 Workspace Instructions

## Project status

- Next.js 16 App Router, TypeScript, Tailwind CSS, Supabase SSR/Postgres.
- The passenger homepage timetable is fixture data until backed by the documented API.
- Payment is simulated. Do not represent it as a live gateway or accept client-side payment success as authoritative.
- Keep user-facing passenger UI in Thai and preserve responsive/accessibility behavior.

## Domain and security

- Read `ARCHITECTURE.md`, `DATABASE.md`, `IMPLEMENTATION_PLAN.md`, and `TEAM_WORKFLOW.md` before changing shared contracts.
- Treat migrations as append-only; never rewrite a migration already applied to a shared Supabase project.
- Keep seat holds transactional and time-limited. Availability reads are advisory; only a successful hold reserves inventory.
- Enforce ownership and roles on the server and through RLS. Never trust client-supplied price, role, booking owner, or payment status.
- Never expose or commit service-role keys, gateway credentials, or real passenger data. Use `.env.example` for names and safe placeholders.

## Verification

- Run `npm run lint` and `npm run build` for code changes.
- For database changes, validate migration application, RLS by role, hold expiry, rollback, and simultaneous requests for the same seat.
- Update typed database definitions and relevant docs when a schema/API contract changes.
- Do not claim integrations, automated checks, or production deployment that were not actually verified.

## Setup checklist

- [x] Requirements and stack clarified from the project brief.
- [x] Next.js App Router project scaffolded in the current workspace.
- [x] Railway booking starter UI, Supabase helpers, SQL migration, and seed data added.
- [x] Architecture, database, implementation, team workflow, and role prompts documented.
- [x] Environment variable template added without credentials.
- [x] README updated for the current project and commands.
- [x] Lint and production build verified after setup.
- [x] Dev server launched after user confirmation; homepage and fare expansion verified in browser.
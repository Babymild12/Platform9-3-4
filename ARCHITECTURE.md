# Architecture

## Runtime

- Next.js App Router with TypeScript; passenger UI and server routes live in `src/app`.
- Supabase Auth and PostgreSQL are the planned identity and data services. Browser and server clients use `@supabase/ssr` and the public anon key; service-role credentials must remain server-only.
- SQL migrations are the source of truth for schema, constraints, row-level security, and database functions.
- Payment is simulated in the MVP. A successful simulated payment changes booking state and issues an e-ticket; it does not move money.

## Booking flow

1. Search active routes and dated train runs by origin, destination, and travel date.
2. Read available `run_seats` and fares. Availability shown from a read is advisory only.
3. The authenticated passenger requests a hold with `hold_run_seats`. The Postgres function locks matching inventory rows, changes them atomically, and creates 12-minute holds. If any requested seat cannot be held, the transaction fails as a whole.
4. Create a pending booking from the hold and collect passenger details.
5. Simulated payment succeeds or fails. Success confirms booking, records payment, and issues a ticket per seat; failure or timeout releases inventory.
6. Staff verify ticket QR payloads through an authorized server endpoint and record verifier and time.

## Security boundaries

- Enable RLS on every exposed table. Policies are least-privilege and based on `auth.uid()` and server-managed roles.
- Never accept role, price, booking owner, or payment success as trusted browser input.
- Keep service-role keys, signing secrets, and real gateway credentials out of browser bundles and source control.
- Rate-limit authentication, hold creation, payment callbacks, and ticket verification; audit staff/admin mutations.

## Initial vertical slice

The current homepage uses a clearly labeled static timetable so the UI can be exercised without backend credentials. The Supabase migration and typed client utilities are foundations; authentication, real search, checkout, payment, and ticket APIs remain implementation tasks.
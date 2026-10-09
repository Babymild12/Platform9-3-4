# Database Guide

## Entity map

`auth.users` 1:1 `profiles`; users have `user_roles`. `trains` have `routes` and `carriages`; carriages contain `seats`. A dated `train_runs` row instantiates a route, and `run_seats` assigns each physical seat and fare to that run. `seat_holds` temporarily reserves run inventory. A `bookings` row belongs to a user and owns `booking_seats`; payments belong to bookings and each confirmed booking seat may issue one `ticket`.

## Tables

| Table | Purpose / important constraints |
| --- | --- |
| `profiles` | Passenger display name and phone; primary key references Supabase Auth. |
| `user_roles` | Passenger, station staff, or admin role; assign elevated roles only from trusted server/admin tooling. |
| `stations` | Unique public station code and Thai/English names. |
| `trains`, `routes` | Train identity and directed origin/destination timetable; route cannot start and end at the same station. |
| `carriages`, `seats` | Physical train layout and seat class/number. |
| `train_runs`, `run_seats` | Date-specific service and its seat inventory, status, and fare. Unique run/seat prevents duplicate inventory. |
| `seat_holds` | User-owned temporary claim, unique per run seat, 12-minute expiry through `hold_run_seats`. |
| `bookings`, `booking_seats` | Booking reference/status/amount and passenger-to-inventory assignment. A run seat can be sold once. |
| `payments` | Provider, amount, status, and provider reference; MVP provider is `simulation`. |
| `tickets` | Unique ticket and QR payload per booking seat with verification audit fields. |

## Seat concurrency

Call `hold_run_seats(p_run_id, p_seat_ids)` only after authentication. The function releases expired holds, locks matching available inventory rows with `FOR UPDATE SKIP LOCKED`, marks them held, and inserts the hold records within the same transaction. It returns all held inventory IDs or raises an exception so the transaction rolls back; callers must not treat a pre-hold availability query as a reservation. Run `release_expired_holds()` from a trusted scheduled job as cleanup; hold creation also reaps expirations.

## Applying locally

1. Create a Supabase project and configure its URL and anon key in `.env.local` from `.env.example`.
2. Apply `supabase/migrations/20261010000000_initial_schema.sql` using Supabase CLI or the SQL editor.
3. Run `supabase/seed.sql` to add sample stations, trains, and route templates.
4. Generate updated TypeScript database types from the project after schema changes. `src/types/database.ts` is a starter subset, not yet CLI-generated.

Never place a service-role key in `NEXT_PUBLIC_*`, commit real credentials, or grant table writes to the anon role. Validate migration behavior with two concurrent hold requests before enabling real bookings.
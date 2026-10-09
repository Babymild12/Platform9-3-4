# Implementation Plan

## Phase 1: Foundation and design

- Agree station/train/run/seat vocabulary, ERD, data dictionary, role matrix, API contracts, and wireframes.
- Set up Supabase dev project, migrations, environment handling, lint/build checks, and shared branch/PR conventions.
- Deliver auth/session skeleton and a seeded passenger search screen.

## Phase 2: Booking and operator workflows

- Implement sign-up/login, profile, role enforcement, route/run search, availability, and transactional 12-minute seat holds.
- Build interactive seat selection, passenger details, pending booking, cancellation/expiry handling, and admin train/fare/status maintenance.
- Publish request/response contracts and keep UI connected to typed server actions or route handlers.

## Phase 3: Payment, tickets, and integration

- Add a simulated payment adapter and idempotent success/failure callback handling; real gateways require separate approval and secrets.
- Issue ticket records/QR payloads only after confirmed payment; provide ticket view/download and staff validation endpoint.
- Integrate notification adapter and end-to-end passenger/admin flows; test duplicate callbacks and simultaneous seat requests.

## Phase 4: Quality and delivery

- Run functional, integration, API, RLS, accessibility, responsive, failure-path, and concurrency tests.
- Review indexes and query plans, configure backups/monitoring, document deploy/rollback, and prepare passenger/staff manuals.
- Resolve release-blocking audit findings and demo with seeded, explicitly non-production data.

## Acceptance gates

- No two active bookings can own the same run seat.
- Holds expire and release inventory; payment callbacks are idempotent.
- Passengers can only read their own personal booking/payment/ticket data; station staff/admin actions are authorized and auditable.
- Search and seat UI work on phone and desktop, with loading/empty/error states and keyboard-accessible controls.
- CI build, lint, database migration, and critical flow tests pass before release.
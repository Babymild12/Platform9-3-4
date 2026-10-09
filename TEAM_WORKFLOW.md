# Team Workflow
# Team Workflow & Roles (ระบบจองตั๋วรถไฟออนไลน์)

## การแบ่งหน้าที่ความรับผิดชอบ (4 คน):
- **Person 1 (Foundation & Auth):** โครงสร้างระบบหลัก, Supabase Auth, Middleware, Route Guard, User Profile
- **Person 2 (Database, Seats & Booking Logic):** สคีมาฐานข้อมูล, ระบบล็อกที่นั่งชั่วคราว (Seat Lock Concurrency), โมดูลสร้าง Booking
- **Person 3 (Payment, E-Ticket & Notifications):** ระบบชำระเงินจำลอง, ออกตั๋ว E-Ticket พร้อม QR Code, ระบบยกเลิก/คืนเงิน
- **Person 4 (UI/UX, Train Search & Passenger Dashboard):** หน้าค้นหาเที่ยวรถ, ผังโบกี้ที่นั่ง (Interactive Seat Map), Dashboard ประวัติการเดินทาง

## Branching Strategy
- `main`: Production-ready code
- `dev`: สาขาหลักสำหรับการรวมโค้ด (Integration)
- `feature/person1-auth`
- `feature/person2-seat-booking`
- `feature/person3-payment-ticket`
- `feature/person4-ui-search`

## Ownership

| Person | Primary ownership | Handoff |
| --- | --- | --- |
| 1. Coordinator / Core Backend | Schema, ERD/data dictionary, train search, transactional seat locking, API contracts, planning | Migration files, RPC/API contract, concurrency tests |
| 2. Backend / Auth / DevOps | Auth, role enforcement, simulated payment, e-ticket/QR, notifications, Docker/deployment/secrets/backups | Auth/payment integration contract, environment/deploy runbook |
| 3. Passenger Frontend / UI/UX | Figma flow/design system, search, schedules/classes/fare filters, seat map, checkout, ticket view/download, responsive state | Screens, typed API integration, accessible interaction tests |
| 4. Admin / QA | Admin dashboard, train/fare/status management, ticket validation, test scenarios/API/concurrency tests, manuals | QA report, operator workflow, bug triage and user/staff guides |

## Collaboration matrix

| Phase | Person 1 | Person 2 | Person 3 | Person 4 |
| --- | --- | --- | --- | --- |
| Design | Database schema and ERD | Auth flow and server setup | Figma user flow and design system | Test plan and admin requirements |
| Development | Search and seat-lock API | Auth and simulated payment API | Search, schedule, seat selection UI | Admin train operations |
| Integration | Query/performance tuning | E-ticket, QR, notification | Payment and ticket screens | Integration, ticket scan, concurrency QA |
| Delivery | Booking bug fixes and data handoff | Deployment and operations | Responsive polish and UI fixes | Full-system testing and manuals |

## Working agreements

- Use short-lived feature branches and pull requests; require one teammate review for schema, auth, payment, and booking changes.
- Treat migrations as append-only. Do not edit an applied migration; add a new migration and include rollback notes where practical.
- Agree API request/response and error shapes before parallel UI/API work. Update docs and typed definitions in the same PR as contract changes.
- Never commit `.env.local`, service-role keys, payment credentials, personal data, or production QR payloads. Keep seeded fixtures synthetic.
- Every booking change includes a seat-race/expiry test; every authorization change includes positive and negative role/RLS checks.
- Report blockers and changed assumptions in the PR; use the acceptance gates in `IMPLEMENTATION_PLAN.md` for release readiness.
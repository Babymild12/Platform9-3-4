# Final Audit Prompt
# Prompt สำหรับการตรวจประเมินขั้นสุดท้าย (Final Audit)
1. รัน `npm run build` และ `npm run lint` ตรวจสอบว่าไม่มีข้อผิดพลาด
2. ตรวจสอบ Definition of Done (DoD) ของทุก User Story
3. ทำ E2E Testing จำลองการจองตั๋วตั้งแต่หน้าแรกจนได้รับ E-Ticket
4. ตรวจสอบความปลอดภัยของ Supabase RLS ไม่ให้ผู้โดยสารเข้าถึงตั๋วของผู้อื่นได้

Perform a release-focused audit of Platform9-3-4. Prioritize exploitable authorization/data leaks, double booking, stale/expired inventory, incorrect fare/booking/payment transitions, duplicate ticket issue or verification, unsafe QR handling, secret exposure, and destructive admin operations. Report findings first with severity and file/table/API references; distinguish confirmed bugs from assumptions.

Check RLS and role assignment, RPC transaction behavior under concurrency, idempotency, date/time handling, error states, mobile/accessibility behavior, dependency/build/lint status, migration reproducibility, backup/restore and deploy/rollback notes, and passenger/staff documentation. Run the available checks; do not claim real payment, email, PDF, or production deployment unless implemented and verified. Finish with blockers, residual risks, and a go/no-go recommendation.
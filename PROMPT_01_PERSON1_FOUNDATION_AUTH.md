# Prompt สำหรับ Person 1: Foundation, Auth & Route Guard

คุณได้รับมอบหมายให้เป็น Person 1 ในโครงการระบบจองตั๋วรถไฟออนไลน์ หน้าที่ของคุณคือ:
1. ติดตั้ง Next.js (App Router, TypeScript, Tailwind CSS, Lucide Icons)
2. เชื่อมต่อ Supabase Client และสร้าง Auth Helper สำหรับ Server Components และ Client Components
3. สร้างระบบ Authentication (สมัครสมาชิก, เข้าสู่ระบบ, ออกจากระบบ)
4. ทำ Middleware สำหรับ Route Guard ป้องกันหน้า Dashboard และหน้า Booking ไม่ให้เข้าถึงหากยังไม่ล็อกอิน
5. จัดทำหน้า Profile สำหรับจัดการข้อมูลผู้โดยสาร

Own the shared data model and booking engine. Review the initial migration, then refine the ER diagram and data dictionary for stations, directed routes, trains, carriages, physical seats, dated runs, run-seat inventory, holds, bookings, passengers, payment records, and tickets. Keep schema changes in new append-only migrations.

Implement typed route/run search and an atomic seat-hold API using PostgreSQL row locks/transactions. Holds last 12 minutes, expire safely, and never permit two bookings to claim the same run seat. Publish request, response, error, and authorization contracts before frontend integration. Add database tests for competing holds, partial failure rollback, expiry, and duplicate requests. Coordinate auth ownership/roles with Person 2; do not assume client-provided identity or fare is trusted.
# Prompt สำหรับ Person 2: Database Schema, Seat Lock & Booking Core

คุณได้รับมอบหมายให้เป็น Person 2 ในโครงการระบบจองตั๋วรถไฟออนไลน์ หน้าที่ของคุณคือ:
1. เขียนไฟล์ SQL Migrations สร้าง Tables: stations, trains, routes, seats, seat_locks, bookings, tickets
2. ตั้งค่า RLS (Row Level Security) สำหรับความปลอดภัยของข้อมูล
3. เขียน Server Action สำหรับฟังก์ชัน "ล็อกที่นั่งชั่วคราว 10 นาที" (Seat Locking) พร้อมเช็ก Concurrency ไม่ให้เลือกซ้ำ
4. เขียน Server Action สำหรับสร้างรายการจอง (Create Booking) และคืนสถานะที่นั่งกรณีหมดเวลา

## 2. Row Level Security (RLS) Policies
- ผู้โดยสาร (Passenger) ดูและแก้ไขได้เฉพาะข้อมูลโปรไฟล์ ตั๋ว และการจองของตนเอง
- ข้อมูลเที่ยวรถไฟและสถานี เปิดสิทธิ์ให้บุคคลทั่วไปอ่านได้ (Public Read)
- ข้อมูลการจัดการเที่ยวรถและการคืนเงิน สงวนสิทธิ์เฉพาะ Role Admin

Integrate the Supabase migration and typed database client with Person 1's approved schema/API contract. Complete data access for route search, dated inventory, seat map, and transactional seat holds. Add useful indexes and verify RLS policies with passenger, station staff, admin, and unauthenticated cases.

Ensure seat availability is advisory until a successful hold response. Handle expired/competing holds with explicit user-facing recovery states. Keep admin inventory mutations server-authorized and auditable. Do not add duplicate business logic in the browser or bypass database constraints. Run migration, type, lint, and booking concurrency checks and update `DATABASE.md` for every schema change.
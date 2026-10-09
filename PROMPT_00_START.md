# Project Start Prompt
# System Architecture - ระบบจองตั๋วรถไฟออนไลน์

## 1. Tech Stack Overview
- **Frontend & Backend Framework:** Next.js (App Router, TypeScript, Tailwind CSS)
- **Database & Auth:** Supabase (PostgreSQL, Row Level Security, Supabase Auth)
- **State Management & Data Fetching:** React Hooks, Server Actions
- **Testing:** Vitest (Unit Tests), Playwright (E2E Tests)
- **Deployment:** Vercel

## 2. System Layers
1. **Presentation Layer:**
   - หน้าระบบค้นหาเที่ยวรถและตารางเวลา
   - Interactive Train Seat Map (ผังเลือกที่นั่งโบกี้รถไฟ)
   - หน้าชำระเงินและหน้าแสดงตั๋ว E-Ticket
   - หน้าประวัติการจองของผู้โดยสาร และ Admin Management
2. **Business Logic Layer (Server Actions / API):**
   - กลไก Temporary Seat Locking (ป้องกันการจองที่นั่งซ้ำ)
   - โมดูลคำนวณราคา ค่าธรรมเนียม และส่วนลด
   - ระบบเชื่อมต่อ Payment Gateway และ Webhook
   - Ticket Cancellation & Refund Policy Engine
3. **Data Layer (PostgreSQL with RLS):**
   - ตาราง Users, Routes, Trains, Carriages, Seats, Bookings, Payments, Tickets

You are contributing to Platform9-3-4, a Thai online railway ticket booking MVP. Read `README.md`, `ARCHITECTURE.md`, `DATABASE.md`, `IMPLEMENTATION_PLAN.md`, and `TEAM_WORKFLOW.md` before changing code. Keep the existing Next.js App Router, TypeScript, Tailwind, Supabase SSR, and SQL migration patterns.

Start by stating the smallest implementation slice, owning files, data/API contract, and verification command. Preserve user work. Do not invent a live payment integration: payment is simulated unless explicitly approved. Never expose service-role keys. Use Thai user-facing copy, accessible responsive controls, and clearly label fixture data. Add focused tests for behavior and run lint/build for touched code.
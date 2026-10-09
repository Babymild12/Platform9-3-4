# Platform9-3-4

ระบบซื้อตั๋วรถไฟออนไลน์สำหรับค้นหาเที่ยวรถ เลือกที่นั่ง ชำระเงิน และรับตั๋วอิเล็กทรอนิกส์ โครงการนี้เริ่มต้นด้วย Next.js App Router, TypeScript, Tailwind CSS และ Supabase

## สถานะเริ่มต้น

หน้าแรกมีแบบฟอร์มค้นหาเส้นทาง วันเดินทาง และจำนวนผู้โดยสาร พร้อมตารางเที่ยวรถตัวอย่างที่ปรับตามเส้นทางและแสดงค่าโดยสารแต่ละชั้น ข้อมูลบนหน้ายังเป็น fixture สำหรับพัฒนา ไม่ได้เชื่อม API หรือยืนยันที่นั่งจริง การจอง การล็อกที่นั่ง การชำระเงิน และตั๋วอิเล็กทรอนิกส์ยังเป็นงานในแผน

การชำระเงินใน MVP จะเป็นการจำลองเท่านั้น ไม่มีการตัดเงินจริง การเชื่อมต่อ Payment Gateway จริงต้องได้รับการอนุมัติและเพิ่มการจัดการ secret ฝั่งเซิร์ฟเวอร์ก่อน

## เริ่มพัฒนา

ต้องมี Node.js รุ่นที่รองรับ Next.js 16 และ npm

```bash
npm install
npm run dev
```

เปิด `http://localhost:3000` ในเบราว์เซอร์ ใช้ `npm run lint` ตรวจ ESLint และ `npm run build` ตรวจ production build

## Supabase

คัดลอก `.env.example` เป็น `.env.local` แล้วกำหนด URL และ anon key จาก Supabase project ของทีม จากนั้นใช้ Supabase CLI หรือ SQL editor เรียก migration ใน `supabase/migrations/` และ seed ที่ `supabase/seed.sql` ดูขั้นตอนและข้อจำกัดใน `DATABASE.md`

ห้าม commit `.env.local`, service-role key, credential สำหรับชำระเงินจริง หรือข้อมูลผู้โดยสารจริง Service-role key ต้องอยู่บนเซิร์ฟเวอร์เท่านั้น

## โครงสร้าง

- `src/app/` หน้าและ layout ของ Next.js App Router
- `src/components/` ส่วนติดต่อผู้ใช้สำหรับผู้โดยสาร
- `src/lib/supabase/` Supabase client ฝั่ง browser และ server
- `src/types/` TypeScript types ของฐานข้อมูลและโดเมน
- `supabase/migrations/` schema, RLS และฟังก์ชันล็อกที่นั่ง
- `supabase/seed.sql` สถานี ขบวน และเส้นทางตัวอย่าง
- `ARCHITECTURE.md`, `DATABASE.md`, `IMPLEMENTATION_PLAN.md` แบบระบบและแนวทางพัฒนา
- `TEAM_WORKFLOW.md` ขอบเขตงานและการส่งต่องานของสมาชิก 4 คน
- `PROMPT_00_START.md` ถึง `PROMPT_06_FINAL_AUDIT.md` ข้อความเริ่มงานและ prompt แยกตามเจ้าของงาน

## แบ่งงานในทีม

1. **คนที่ 1: Project Coordinator / Core Backend** ออกแบบ schema, ERD, data dictionary, ค้นหาเที่ยวรถ, transaction ล็อกที่นั่งชั่วคราว 12 นาที และ API contract
2. **คนที่ 2: Backend / Auth / DevOps** สมัครสมาชิกและเข้าสู่ระบบ, passenger/station staff/admin, payment จำลอง, e-ticket/QR, notification, deployment, secrets และ backup
3. **คนที่ 3: Passenger Frontend / UI/UX** Figma, ค้นหาเที่ยวรถ, ตารางและชั้นโดยสาร, ผังที่นั่ง, checkout, หน้าตั๋ว และ responsive state
4. **คนที่ 4: Admin / QA** dashboard, จัดการขบวน/ราคา/สถานะ, ตรวจตั๋ว, functional/integration/API/concurrency tests และคู่มือผู้โดยสาร/เจ้าหน้าที่

ใช้ collaboration matrix และข้อตกลง PR ใน `TEAM_WORKFLOW.md`; ใช้ acceptance gates ใน `IMPLEMENTATION_PLAN.md` ก่อนส่งมอบThis is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

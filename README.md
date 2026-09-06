# Platform9-3-4
ระบบซื้อตั๋วรถไฟออนไลน์

# Platform9-3-4.todolist
ระบบซื้อตั๋วรถไฟออนไลน์


### คนที่ 1: Project Coordinator & Lead Backend (Core Booking & Data Architecture)

> **บทบาทหลัก:** ผู้นำสถาปัตยกรรมระบบหลังบ้าน คุมฐานข้อมูล และตรรกะการจองตั๋ว/ล็อกที่นั่ง

* **System & Database Design:**
* ออกแบบ Schema ฐานข้อมูลทั้งหมด (ตารางขบวนรถ, เส้นทาง/สถานี, โบกี้, ผังที่นั่ง, สถานะการจอง, ผู้โดยสาร, ประวัติการชำระเงิน)
* ออกแบบ ER Diagram และ Data Dictionary


* **Core Booking Engine (Business Logic):**
* พัฒนาระบบค้นหาเที่ยวรถและรอบเวลาตามต้นทาง-ปลายทาง
* พัฒนาระบบจองและล็อกที่นั่งชั่วคราว (Seat Locking Mechanism เพื่อแก้ปัญหา Race Condition เมื่อมีคนกดจองที่นั่งเดียวกันพร้อมกัน เช่น การใช้ Transaction Lock หรือ Cache Expiration 10-15 นาที)


* **Project Coordination:**
* กำหนดข้อตกลง API Contract ร่วมกับฝั่ง Frontend (Swagger / Postman Collection)
* วางแผนไทม์ไลน์ ติดตามความคืบหน้ารายสัปดาห์



---

### คนที่ 2: Backend Developer & DevOps / Integrations (Auth, Payment & Deployment)

> **บทบาทหลัก:** ดูแลระบบความปลอดภัย การชำระเงิน และการนำระบบขึ้นเซิร์ฟเวอร์

* **Authentication & User Management:**
* พัฒนาระบบสมัครสมาชิก, เข้าสู่ระบบ, ยืนยันตัวตน (JWT / Session-based Auth)
* กำหนดสิทธิ์ผู้ใช้งาน (Role-Based Access Control: ผู้โดยสาร, เจ้าหน้าที่สถานี, ผู้ดูแลระบบ/Admin)


* **Payment & Notification Integration:**
* เชื่อมต่อระบบชำระเงินจำลองหรือ Payment Gateway (เช่น PromptPay QR Code, บัตรเครดิต หรือ Sandbox Gateway)
* ระบบออกตั๋วอิเล็กทรอนิกส์ (E-Ticket / PDF Generator พร้อม QR Code สำหรับสแกนขึ้นรถ)
* ระบบส่งอีเมลหรือแจ้งเตือนยืนยันการซื้อตั๋วสำเร็จ


* **Infrastructure & CI/CD:**
* จัดการ Docker Containerization สำหรับ Backend และ Database
* ติดตั้งและดูแล Cloud/Server (เช่น AWS, Render, Railway, DigitalOcean หรือเซิร์ฟเวอร์ของมหาวิทยาลัย)
* จัดการ Environment Variables และตั้งค่าระบบ Backup ฐานข้อมูล



---

### คนที่ 3: Frontend Developer & UI/UX Designer (Passenger Web App)

> **บทบาทหลัก:** ออกแบบประสบการณ์ผู้ใช้และพัฒนาหน้าเว็บฝั่งผู้โดยสาร

* **UI/UX Design (Figma):**
* ทำ User Flow และ Wireframe ตั้งแต่หน้าค้นหา -> เลือกที่นั่ง -> ชำระเงิน -> รับตั๋ว
* ออกแบบ Design System (ธีมรถไฟ/Platform 9-3/4 เช่น โทนสี, Typography, Icon, Component)


* **Frontend Implementation (ฝั่งผู้โดยสาร):**
* หน้าแรก (Home / Search): เลือกสถานีต้นทาง-ปลายทาง, วันที่เดินทาง, จำนวนผู้โดยสาร
* หน้ารายการขบวนรถ (Train Schedule & Class): กรองเวลา ชั้นที่นั่ง (ชั้น 1, 2, 3) และราคา
* หนังผังเลือกที่นั่งแบบ Interactive (Seat Selection Map): แสดงสถานะที่นั่งแบบ Real-time (ว่าง / กำลังเลือก / ถูกจองแล้ว)
* หน้ายืนยันข้อมูลผู้โดยสารและหน้าชำระเงิน (Checkout)
* หน้ารับตั๋วและดาวน์โหลด E-Ticket พร้อม QR Code


* **Client-side State Management:**
* จัดการ State ระหว่างขั้นตอนการจอง (Form Data, Countdown Timer สำหรับล็อกที่นั่ง)
* Responsive Design ให้รองรับทั้งหน้าจอมือถือและเดสก์ท็อป



---

### คนที่ 4: QA/Tester & Admin Dashboard Developer (Back-Office & Quality Assurance)

> **บทบาทหลัก:** พัฒนาระบบหลังบ้านสำหรับเจ้าหน้าที่ และควบคุมคุณภาพทั้งระบบ

* **Admin / Operator Portal (Frontend & Backend APIs ที่เกี่ยวข้อง):**
* หน้าจอ Dashboard สรุปภาพรวม (ยอดขายตั๋ว, เที่ยวรถที่คนเต็ม, สถิติประจำวัน)
* ระบบจัดการเที่ยวรถ (เพิ่ม/ลดรอบรถ, กำหนดราคา, จัดการสถานะขบวนรถ เช่น ตรงเวลา/ล่าช้า/ยกเลิก)
* ระบบตรวจสอบและสแกนตั๋ว (Ticket Verification/Validation สำหรับนายตรวจตั๋ว)


* **Quality Assurance & Testing:**
* เขียน Test Cases และ Test Scenarios ให้ครอบคลุมทุก User Flow (ทั้งกรณีปกติและ Edge Cases เช่น บัตรตัดเงินไม่ผ่าน, กดยกเลิกกลางคัน, ซื้อตั๋วพร้อมกัน)
* ทำ Functional Testing, Integration Testing และ API Testing ผ่าน Postman/Bruno
* ทดสอบโหลดระบบเบื้องต้น (Stress/Concurrency Test สำหรับฟังก์ชันเลือกที่นั่ง)


* **Documentation:**
* รวบรวมเอกสาร User Manual (คู่มือผู้ใช้ทั่วไปและคู่มือเจ้าหน้าที่)
* สรุปรายงานข้อผิดพลาด (Bug Report) และบันทึกผลการทดสอบระบบ



---

### ตารางสรุปการส่งมอบงานร่วมกัน (Collaboration Matrix)

| สัปดาห์/ระยะ | คนที่ 1 (Backend Core) | คนที่ 2 (Backend Auth/DevOps) | คนที่ 3 (Frontend Passenger) | คนที่ 4 (Admin & QA) |
| --- | --- | --- | --- | --- |
| **Phase 1: ออกแบบ** | ออกแบบ Database Schema | กำหนด Auth Flow & Server Setup | ออกแบบ Figma (UI/UX) | เขียน Test Cases & แผนงาน Admin |
| **Phase 2: พัฒนา** | ทำ Search & Seat Locking API | ทำ Auth & Payment API | ต่อหน้า UI ค้นหา & ผังที่นั่ง | พัฒนา Admin จัดการเที่ยวรถ |
| **Phase 3: เชื่อมต่อ** | จูน Database Performance | ทำระบบส่งตั๋ว E-Ticket / QR | เชื่อม API ชำระเงิน & หน้าตั๋ว | ทดสอบ Integration Test & สแกนตั๋ว |
| **Phase 4: ส่งมอบ** | Fix Bugs ฝั่งจอง | Deploy ระบบขึ้น Production | ปรับ UI Polish & Bug Fixes | ทำ Full System Test & ทำคู่มือ |
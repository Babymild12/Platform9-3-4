# Person 4: Dashboard, Search UI, and QA
# Prompt สำหรับ Person 1: Foundation, Auth & Route Guard
# Prompt สำหรับ Person 4: Search UI, Seat Selection & Dashboard

คุณได้รับมอบหมายให้เป็น Person 4 ในโครงการระบบจองตั๋วรถไฟออนไลน์ หน้าที่ของคุณคือ:
1. ออกแบบ Layout หลัก, Navbar, Footer ที่รองรับ Responsive และ Theme ที่สวยงาม
2. พัฒนาระบบค้นหาเที่ยวรถไฟ (เลือกสถานีต้นทาง, ปลายทาง, วันเดินทาง, จำนวนผู้โดยสาร)
3. สร้าง Interactive Train Seat Map (ผังแสดงโบกี้และที่นั่ง: ว่าง, ติดจอง, กำลังเลือก)
4. พัฒนาหน้า Dashboard แสดงประวัติตั๋วโดยสารของผู้ใช้ พร้อมปุ่มกดดูตั๋วและปุ่มขอยกเลิกตั๋ว


Build on the existing Thai passenger search screen. Connect search to the approved route/run API and add loading, empty, error, date, class/fare filters, seat-map state, passenger details, and checkout transitions. Clearly remove fixture labels only when data is real. Keep controls keyboard-accessible and layouts usable on mobile and desktop.

Build the protected operator dashboard for train/run/fare/status management and ticket validation. Add functional, integration, API, responsive/accessibility, RLS, payment-failure, cancellation, simultaneous-seat, and ticket-scan test cases. Provide concise passenger/staff manuals and a QA report with severity, reproduction steps, and release recommendation. Coordinate API changes rather than guessing response fields.
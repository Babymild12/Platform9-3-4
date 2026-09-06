# Platform9-3-4
ระบบซื้อตั๋วรถไฟออนไลน์

คนที่ 3: Frontend Developer & UI/UX Designer (Passenger Web App)
บทบาทหลัก: ออกแบบประสบการณ์ผู้ใช้และพัฒนาหน้าเว็บฝั่งผู้โดยสาร

UI/UX Design (Figma):

ทำ User Flow และ Wireframe ตั้งแต่หน้าค้นหา -> เลือกที่นั่ง -> ชำระเงิน -> รับตั๋ว

ออกแบบ Design System (ธีมรถไฟ/Platform 9-3/4 เช่น โทนสี, Typography, Icon, Component)

Frontend Implementation (ฝั่งผู้โดยสาร):

หน้าแรก (Home / Search): เลือกสถานีต้นทาง-ปลายทาง, วันที่เดินทาง, จำนวนผู้โดยสาร

หน้ารายการขบวนรถ (Train Schedule & Class): กรองเวลา ชั้นที่นั่ง (ชั้น 1, 2, 3) และราคา

หนังผังเลือกที่นั่งแบบ Interactive (Seat Selection Map): แสดงสถานะที่นั่งแบบ Real-time (ว่าง / กำลังเลือก / ถูกจองแล้ว)

หน้ายืนยันข้อมูลผู้โดยสารและหน้าชำระเงิน (Checkout)

หน้ารับตั๋วและดาวน์โหลด E-Ticket พร้อม QR Code

Client-side State Management:

จัดการ State ระหว่างขั้นตอนการจอง (Form Data, Countdown Timer สำหรับล็อกที่นั่ง)

Responsive Design ให้รองรับทั้งหน้าจอมือถือและเดสก์ท็อป

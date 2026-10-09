# Prompt สำหรับ Person 3: Payment Simulation, E-Ticket & Refund Logic

คุณได้รับมอบหมายให้เป็น Person 3 ในโครงการระบบจองตั๋วรถไฟออนไลน์ หน้าที่ของคุณคือ:
1. สร้าง Flow หน้าชำระเงิน (รองรับ PromptPay QR และ Credit Card จำลอง) พร้อมนับถอยหลังหมดเวลาชำระเงิน
2. สร้างระบบออกตั๋ว E-Ticket แสดงรายละเอียดขบวน, โบกี้, ที่นั่ง และสร้าง QR Code สำหรับตรวจตั๋ว
3. พัฒนาระบบยกเลิกตั๋ว (Ticket Cancellation) และคำนวณหักค่าธรรมเนียมคืนเงินตามเงื่อนไขเวลา
4. สร้าง Mock Service สำหรับการส่งอีเมลยืนยันการจองตั๋ว

Implement the payment boundary as a provider adapter, with a deterministic simulated provider for this MVP. Model pending/succeeded/failed/refunded states; make callbacks idempotent and validate amount, booking ownership, and current booking status server-side. Never accept a browser success flag as proof of payment.

On confirmed payment, issue one ticket per booking seat with an opaque, non-guessable QR payload. Add passenger ticket view/download and an authorized station-staff validation endpoint that records verifier and timestamp and prevents inappropriate repeat use. Keep secrets server-side, avoid real-money gateway claims, test duplicate callbacks/failures/cancellations, and document the production gateway boundary.
# Integration Prompt
# Prompt สำหรับขั้นตอนการรวมระบบ (Integration)
1. ตรวจสอบการเชื่อมต่อระหว่าง Feature Search (Person 4) -> Seat Selection (Person 4 + Person 2) -> Booking/Payment (Person 3) -> E-Ticket (Person 3)
2. รวม Route Guard และ Session จาก Person 1 เข้ากับทุกลำดับการทำงาน
3. ทดสอบ Real-time Seat Update และสภาวะ Timeout ปลดล็อกที่นั่ง

Integrate the four workstreams against the documented contracts. First check migrations, environment variable names, role assumptions, status transitions, fare units, date/time zones, and generated types. Trace one passenger flow end to end: search, hold, passenger details, simulated payment, ticket issue, and staff verification; then trace failure, expiry, cancellation, and duplicate-payment paths.

Resolve contract mismatches at the owning boundary, not with silent UI workarounds. Verify RLS for each role and run concurrency tests for same-seat requests. Confirm no service secrets enter browser bundles or commits. Update architecture/database/workflow docs and report exactly which automated checks ran and any remaining gaps.
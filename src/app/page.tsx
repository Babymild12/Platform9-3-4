import { ArrowRight, TrainFront } from "lucide-react";
import BookingSearch from "@/components/booking-search";

export default function Home() {
  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="Platform9-3-4 หน้าหลัก">
          <span className="brand-mark"><TrainFront size={21} strokeWidth={1.8} /></span>
          <span className="brand-name">PLATFORM<span>9-3-4</span></span>
        </a>
        <nav className="main-nav" aria-label="เมนูหลัก">
          <a className="nav-active" href="#search">จองตั๋ว</a>
          <a href="#timetable">ตารางเดินรถ</a>
          <a href="#footer">ช่วยเหลือ</a>
        </nav>
        <a className="account-link" href="#footer">เข้าสู่ระบบ <ArrowRight size={15} /></a>
      </header>
      <BookingSearch />
      <footer className="footer" id="footer">
        <span>Platform9-3-4 <span className="footer-dot">/</span> เดินทางสบายใจ ไปได้ทุกเส้นทาง</span>
        <span>ข้อมูลตารางรถตัวอย่างสำหรับการพัฒนา</span>
      </footer>
    </main>
  );
}

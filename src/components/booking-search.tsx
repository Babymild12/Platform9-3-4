"use client";

import { useState, useSyncExternalStore } from "react";
import { ArrowLeftRight, ArrowRight, CalendarDays, ChevronDown, CircleHelp, Clock3, MapPin, Search, ShieldCheck, TrainFront, UsersRound } from "lucide-react";
import BookingFlow from "@/components/booking-flow";
import { getDemoTicketsSnapshot, getServerDemoTicketsSnapshot, saveDemoTickets, subscribeToDemoTickets } from "@/lib/demo-ticket-store";
import type { DemoTicket, FareOption, TripSchedule } from "@/types/booking";

const stations = ["กรุงเทพอภิวัฒน์", "เชียงใหม่", "อยุธยา", "พิษณุโลก", "นครราชสีมา"];
const schedules: TripSchedule[] = [
  { id: "9", number: "ขบวน 9", kind: "ด่วนพิเศษ · CNR", from: "กรุงเทพอภิวัฒน์", to: "เชียงใหม่", depart: "18:40", arrive: "07:15", duration: "12 ชม. 35 นาที", price: 271, seats: 18, fares: [{ code: "first", label: "ชั้น 1", price: 1253 }, { code: "second", label: "ชั้น 2", price: 791 }, { code: "third", label: "ชั้น 3", price: 271 }] },
  { id: "13", number: "ขบวน 13", kind: "ด่วนพิเศษ · รถนอน", from: "กรุงเทพอภิวัฒน์", to: "เชียงใหม่", depart: "20:05", arrive: "08:45", duration: "12 ชม. 40 นาที", price: 251, seats: 26, fares: [{ code: "first", label: "ชั้น 1", price: 1153 }, { code: "second", label: "ชั้น 2", price: 771 }, { code: "third", label: "ชั้น 3", price: 251 }] },
  { id: "109", number: "ขบวน 109", kind: "รถเร็ว · ดีเซลราง", from: "กรุงเทพอภิวัฒน์", to: "อยุธยา", depart: "06:10", arrive: "07:28", duration: "1 ชม. 18 นาที", price: 85, seats: 42, fares: [{ code: "second", label: "ชั้น 2", price: 195 }, { code: "third", label: "ชั้น 3", price: 85 }] },
  { id: "7", number: "ขบวน 7", kind: "ด่วนพิเศษ · Sprinter", from: "กรุงเทพอภิวัฒน์", to: "พิษณุโลก", depart: "09:05", arrive: "13:35", duration: "4 ชม. 30 นาที", price: 239, seats: 31, fares: [{ code: "second", label: "ชั้น 2", price: 479 }, { code: "third", label: "ชั้น 3", price: 239 }] },
];

export default function BookingSearch() {
  const [origin, setOrigin] = useState(stations[0]);
  const [destination, setDestination] = useState(stations[1]);
  const [travelDate, setTravelDate] = useState("");
  const [passengers, setPassengers] = useState("1");
  const [hasSearched, setHasSearched] = useState(false);
  const [expandedFare, setExpandedFare] = useState<string | null>(null);
  const tickets = useSyncExternalStore(subscribeToDemoTickets, getDemoTicketsSnapshot, getServerDemoTicketsSnapshot);
  const [bookingSelection, setBookingSelection] = useState<{ schedule: TripSchedule; fare: FareOption } | null>(null);
  const [ticketToView, setTicketToView] = useState<DemoTicket | null>(null);
  const [searchError, setSearchError] = useState("");
  const results = schedules.filter((schedule) => schedule.from === origin && schedule.to === destination);

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const today = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Bangkok" }).format(new Date());
    if (!travelDate || travelDate < today) {
      setSearchError("เลือกวันเดินทางตั้งแต่วันนี้เป็นต้นไป");
      return;
    }
    if (origin === destination) {
      setSearchError("สถานีต้นทางและปลายทางต้องไม่ใช่สถานีเดียวกัน");
      return;
    }
    setSearchError("");
    setHasSearched(true);
    setExpandedFare(null);
  }

  function swapStations() {
    setOrigin(destination);
    setDestination(origin);
  }

  function saveTicket(ticket: DemoTicket) {
    const updated = [ticket, ...tickets.filter((item) => item.id !== ticket.id)];
    saveDemoTickets(updated);
  }

  function openBooking(schedule: TripSchedule, fare: FareOption) {
    if (!travelDate) {
      setSearchError("เลือกวันเดินทางและกดค้นหาก่อนเริ่มจอง");
      document.getElementById("search")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setSearchError("");
    setTicketToView(null);
    setBookingSelection({ schedule, fare });
  }

  function closeBooking() {
    setBookingSelection(null);
    setTicketToView(null);
  }

  function cancelTicket(ticket: DemoTicket) {
    saveTicket(ticket);
  }

  return <>
    <section className="hero" id="home">
      <div className="hero-copy">
        <p className="eyebrow">RAIL JOURNEYS, MADE SIMPLE</p>
        <h1>ทุกเส้นทาง<br />เริ่มต้นที่ <span>สถานีของคุณ</span></h1>
        <p className="hero-description">วางแผนการเดินทางทั่วไทย ค้นหาเที่ยวรถที่ใช่ แล้วออกเดินทางไปพร้อมความสบายใจ</p>
        <div className="route-art" aria-hidden="true"><MapPin size={16} /><span className="route-art-label">ต้นทาง</span><span className="route-art-line" /><span className="route-art-label">ปลายทาง</span><TrainFront size={17} /></div>
      </div>
      <section className="search-panel" id="search" aria-labelledby="search-title">
        <div className="panel-heading"><div><h2 id="search-title">ค้นหาเที่ยวรถไฟ</h2><p>เลือกเส้นทางและวันเดินทางของคุณ</p></div><span className="one-way">เที่ยวเดียว</span></div>
        <form onSubmit={submitSearch}>
          <div className="search-fields">
            <label className="field">สถานีต้นทาง<span className="field-control"><MapPin size={15} /><select value={origin} onChange={(event) => setOrigin(event.target.value)} aria-label="สถานีต้นทาง">{stations.map((station) => <option key={station}>{station}</option>)}</select><button className="swap-button" type="button" onClick={swapStations} aria-label="สลับสถานีต้นทางและปลายทาง" title="สลับสถานี"><ArrowLeftRight size={14} /></button></span></label>
            <label className="field">สถานีปลายทาง<span className="field-control"><MapPin size={15} /><select value={destination} onChange={(event) => setDestination(event.target.value)} aria-label="สถานีปลายทาง">{stations.map((station) => <option key={station}>{station}</option>)}</select></span></label>
            <label className="field">วันเดินทาง<span className="field-control"><CalendarDays size={15} /><input type="date" value={travelDate} onChange={(event) => setTravelDate(event.target.value)} required /></span></label>
            <label className="field">ผู้โดยสาร<span className="field-control"><UsersRound size={15} /><select value={passengers} onChange={(event) => setPassengers(event.target.value)} aria-label="จำนวนผู้โดยสาร">{[1, 2, 3, 4, 5, 6].map((count) => <option key={count} value={count}>{count} คน</option>)}</select></span></label>
          </div>
          <button className="search-submit" type="submit"><Search size={17} /> ค้นหาเที่ยวรถ <ArrowRight size={16} /></button>
          <p className="search-footnote"><ShieldCheck size={13} /> ไม่มีค่าธรรมเนียมการค้นหา · ทดลองใช้งานด้วยข้อมูลจำลอง</p>
          {searchError && <p className="booking-error" role="alert">{searchError}</p>}
        </form>
      </section>
    </section>
    <section className="timetable" id="timetable" aria-labelledby="timetable-title">
      <div className="section-head"><div><p className="section-kicker">YOUR NEXT DEPARTURE</p><h2 id="timetable-title">{hasSearched ? "เที่ยวรถที่ค้นหา" : "เที่ยวรถแนะนำ"}</h2></div><div className="result-caption"><span className="demo-label"><CircleHelp size={13} /> ตารางตัวอย่าง · จองทดลองเท่านั้น</span>{hasSearched && <span> · {origin} ไป {destination} · {passengers} คน</span>}</div></div>
      {results.length === 0 ? <div className="empty-state"><strong>ยังไม่มีเที่ยวรถในเส้นทางนี้</strong>ลองเลือกเส้นทาง กรุงเทพอภิวัฒน์ไปเชียงใหม่ อยุธยา หรือพิษณุโลก</div> : <div className="train-list">{results.map((schedule, index) => <article className="train-card" key={schedule.id} style={{ animationDelay: `${index * 70}ms` }}>
        <div className="train-identity"><span className="train-icon"><TrainFront size={19} /></span><div><p className="train-number">{schedule.number}</p><p className="train-type">{schedule.kind}</p></div></div>
        <div className="journey-times"><div><span className="time">{schedule.depart}</span><span className="station-name">{schedule.from}</span></div><div><div className="journey-line"><span /><ArrowRight size={13} /><span /></div><div className="duration"><Clock3 size={10} /> {schedule.duration}</div></div><div><span className="time">{schedule.arrive}</span><span className="station-name">{schedule.to}</span></div></div>
        <div className="fare-block"><span className="fare-label">เริ่มต้น</span><span className="fare-value">฿{schedule.price.toLocaleString("th-TH")}</span><span className="fare-unit">/ คน</span></div>
        <div className="train-actions"><span className="availability"><span className="availability-dot" /> ว่างโดยประมาณ {schedule.seats}</span><button className="fare-toggle" type="button" onClick={() => setExpandedFare(expandedFare === schedule.id ? null : schedule.id)} aria-expanded={expandedFare === schedule.id}>ชั้นโดยสาร <ChevronDown size={13} /></button></div>
        {expandedFare === schedule.id && <div className="fare-details">{schedule.fares.map((fare) => <button className="fare-chip fare-chip-button" type="button" key={fare.code} onClick={() => openBooking(schedule, fare)}><span>{fare.label}</span><strong>฿{fare.price.toLocaleString("th-TH")}</strong><span>เลือกที่นั่ง <ArrowRight size={12} /></span></button>)}</div>}
      </article>)}</div>}
      {tickets.length > 0 && <div className="demo-ticket-history"><div><p className="section-kicker">THIS SESSION</p><h3>ตั๋วทดลองของฉัน</h3></div><div className="demo-ticket-list">{tickets.map((ticket) => <div className="demo-ticket-row" key={ticket.id}><div><strong>{ticket.bookingReference}</strong><span>{ticket.trainNumber} · {ticket.origin} ไป {ticket.destination} · {ticket.travelDate}</span></div><span className={`demo-ticket-status ${ticket.status === "cancelled" ? "is-cancelled" : ""}`}>{ticket.status === "cancelled" ? "ยกเลิกแล้ว" : "ทดลอง"}</span><button className="fare-toggle" type="button" onClick={() => { setBookingSelection(null); setTicketToView(ticket); }}>เปิดตั๋ว <ArrowRight size={13} /></button></div>)}</div></div>}
    </section>
    {bookingSelection && <BookingFlow key={`${bookingSelection.schedule.id}-${bookingSelection.fare.code}`} schedule={bookingSelection.schedule} fare={bookingSelection.fare} travelDate={travelDate} passengerCount={Number(passengers)} tickets={tickets} onClose={closeBooking} onComplete={saveTicket} onCancelTicket={cancelTicket} />}
    {ticketToView && <BookingFlow key={ticketToView.id} ticket={ticketToView} tickets={tickets} onClose={closeBooking} onComplete={saveTicket} onCancelTicket={cancelTicket} />}
  </>;
}
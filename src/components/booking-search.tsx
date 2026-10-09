"use client";

import { useState } from "react";
import { ArrowLeftRight, ArrowRight, CalendarDays, ChevronDown, CircleHelp, Clock3, MapPin, Search, ShieldCheck, TrainFront, UsersRound } from "lucide-react";

const stations = ["กรุงเทพอภิวัฒน์", "เชียงใหม่", "อยุธยา", "พิษณุโลก", "นครราชสีมา"];
const schedules = [
  { id: "9", number: "ขบวน 9", kind: "ด่วนพิเศษ · CNR", from: "กรุงเทพอภิวัฒน์", to: "เชียงใหม่", depart: "18:40", arrive: "07:15", duration: "12 ชม. 35 นาที", price: 1253, seats: 18, fares: [["ชั้น 1", "1,253"], ["ชั้น 2", "791"], ["ชั้น 3", "271"]] },
  { id: "13", number: "ขบวน 13", kind: "ด่วนพิเศษ · รถนอน", from: "กรุงเทพอภิวัฒน์", to: "เชียงใหม่", depart: "20:05", arrive: "08:45", duration: "12 ชม. 40 นาที", price: 1153, seats: 26, fares: [["ชั้น 1", "1,153"], ["ชั้น 2", "771"], ["ชั้น 3", "251"]] },
  { id: "109", number: "ขบวน 109", kind: "รถเร็ว · ดีเซลราง", from: "กรุงเทพอภิวัฒน์", to: "อยุธยา", depart: "06:10", arrive: "07:28", duration: "1 ชม. 18 นาที", price: 195, seats: 42, fares: [["ชั้น 2", "195"], ["ชั้น 3", "85"]] },
  { id: "7", number: "ขบวน 7", kind: "ด่วนพิเศษ · Sprinter", from: "กรุงเทพอภิวัฒน์", to: "พิษณุโลก", depart: "09:05", arrive: "13:35", duration: "4 ชม. 30 นาที", price: 479, seats: 31, fares: [["ชั้น 2", "479"], ["ชั้น 3", "239"]] },
];

export default function BookingSearch() {
  const [origin, setOrigin] = useState(stations[0]);
  const [destination, setDestination] = useState(stations[1]);
  const [travelDate, setTravelDate] = useState("");
  const [passengers, setPassengers] = useState("1");
  const [hasSearched, setHasSearched] = useState(false);
  const [expandedFare, setExpandedFare] = useState<string | null>(null);
  const results = schedules.filter((schedule) => schedule.from === origin && schedule.to === destination);

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasSearched(true);
    setExpandedFare(null);
  }

  function swapStations() {
    setOrigin(destination);
    setDestination(origin);
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
          <p className="search-footnote"><ShieldCheck size={13} /> ไม่มีค่าธรรมเนียมการค้นหา</p>
        </form>
      </section>
    </section>
    <section className="timetable" id="timetable" aria-labelledby="timetable-title">
      <div className="section-head"><div><p className="section-kicker">YOUR NEXT DEPARTURE</p><h2 id="timetable-title">{hasSearched ? "เที่ยวรถที่ค้นหา" : "เที่ยวรถแนะนำ"}</h2></div><div className="result-caption"><span className="demo-label"><CircleHelp size={13} /> ข้อมูลตัวอย่าง</span>{hasSearched && <span> · {origin} ไป {destination} · {passengers} คน</span>}</div></div>
      {results.length === 0 ? <div className="empty-state"><strong>ยังไม่มีเที่ยวรถในเส้นทางนี้</strong>ลองเลือกเส้นทาง กรุงเทพอภิวัฒน์ไปเชียงใหม่ อยุธยา หรือพิษณุโลก</div> : <div className="train-list">{results.map((schedule, index) => <article className="train-card" key={schedule.id} style={{ animationDelay: `${index * 70}ms` }}>
        <div className="train-identity"><span className="train-icon"><TrainFront size={19} /></span><div><p className="train-number">{schedule.number}</p><p className="train-type">{schedule.kind}</p></div></div>
        <div className="journey-times"><div><span className="time">{schedule.depart}</span><span className="station-name">{schedule.from}</span></div><div><div className="journey-line"><span /><ArrowRight size={13} /><span /></div><div className="duration"><Clock3 size={10} /> {schedule.duration}</div></div><div><span className="time">{schedule.arrive}</span><span className="station-name">{schedule.to}</span></div></div>
        <div className="fare-block"><span className="fare-label">เริ่มต้น</span><span className="fare-value">฿{schedule.price.toLocaleString("th-TH")}</span><span className="fare-unit">/ คน</span></div>
        <div className="train-actions"><span className="availability"><span className="availability-dot" /> ว่าง {schedule.seats} ที่นั่ง</span><button className="fare-toggle" type="button" onClick={() => setExpandedFare(expandedFare === schedule.id ? null : schedule.id)} aria-expanded={expandedFare === schedule.id}>ชั้นโดยสาร <ChevronDown size={13} /></button></div>
        {expandedFare === schedule.id && <div className="fare-details">{schedule.fares.map(([seatClass, price]) => <span className="fare-chip" key={seatClass}>{seatClass}<strong>฿{price}</strong></span>)}</div>}
      </article>)}</div>}
    </section>
  </>;
}
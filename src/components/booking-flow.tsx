"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Ban, Check, CreditCard, Printer, QrCode, ShieldAlert, TrainFront, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import type { DemoTicket, FareOption, TripSchedule } from "@/types/booking";

type BookingFlowProps = {
  schedule?: TripSchedule;
  fare?: FareOption;
  travelDate?: string;
  passengerCount?: number;
  tickets: DemoTicket[];
  ticket?: DemoTicket;
  onClose: () => void;
  onComplete: (ticket: DemoTicket) => void;
  onCancelTicket: (ticket: DemoTicket) => void;
};

type Stage = "seats" | "passengers" | "payment" | "ticket";
type PaymentMethod = DemoTicket["paymentMethod"];

const fareSeatPrefix: Record<string, string> = { first: "1", second: "2", third: "3" };

function formatDate(date: string) {
  if (!date) return "ไม่ระบุวันเดินทาง";
  return new Intl.DateTimeFormat("th-TH", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}

function seatOptions(prefix: string, count: number) {
  const seats: string[] = [];
  for (let row = 1; seats.length < count; row += 1) {
    for (const column of ["A", "B", "C", "D"]) {
      seats.push(`${prefix}${String(row).padStart(2, "0")}${column}`);
      if (seats.length === count) break;
    }
  }
  return seats;
}

export default function BookingFlow({
  schedule,
  fare,
  travelDate = "",
  passengerCount = 1,
  tickets,
  ticket,
  onClose,
  onComplete,
  onCancelTicket,
}: BookingFlowProps) {
  const [stage, setStage] = useState<Stage>(ticket ? "ticket" : "seats");
  const [currentTicket, setCurrentTicket] = useState(ticket ?? null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [names, setNames] = useState<string[]>(() => Array.from({ length: passengerCount }, () => ""));
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("promptpay-demo");
  const [error, setError] = useState("");

  const prefix = fareSeatPrefix[fare?.code ?? "second"] ?? "2";
  const availableSeats = seatOptions(prefix, schedule?.seats ?? 0);
  const occupiedSeats = new Set(tickets
    .filter((item) => item.status === "simulation-paid" && item.scheduleId === schedule?.id && item.travelDate === travelDate && item.fareCode === fare?.code)
    .flatMap((item) => item.passengers.map((passenger) => passenger.seat)));
  const totalPrice = (fare?.price ?? currentTicket?.unitPrice ?? 0) * passengerCount;

  function toggleSeat(seat: string) {
    setError("");
    setSelectedSeats((current) => {
      if (current.includes(seat)) return current.filter((item) => item !== seat);
      if (current.length >= passengerCount) return current;
      return [...current, seat];
    });
  }

  function finishDemoPayment() {
    if (!schedule || !fare || !travelDate) return;
    const reference = `P934-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const newTicket: DemoTicket = {
      id: crypto.randomUUID(),
      bookingReference: reference,
      scheduleId: schedule.id,
      trainNumber: schedule.number,
      trainKind: schedule.kind,
      origin: schedule.from,
      destination: schedule.to,
      departure: schedule.depart,
      arrival: schedule.arrive,
      travelDate,
      fareCode: fare.code,
      fareLabel: fare.label,
      unitPrice: fare.price,
      totalPrice,
      passengers: names.map((name, index) => ({ name: name.trim(), seat: selectedSeats[index] })),
      paymentMethod,
      qrPayload: `PLATFORM9-3-4-DEMO:${crypto.randomUUID()}`,
      status: "simulation-paid",
      createdAt: new Date().toISOString(),
    };
    setCurrentTicket(newTicket);
    setStage("ticket");
    onComplete(newTicket);
  }

  function cancelDemoTicket() {
    if (!currentTicket || currentTicket.status === "cancelled") return;
    const cancelled = { ...currentTicket, status: "cancelled" as const };
    setCurrentTicket(cancelled);
    onCancelTicket(cancelled);
  }

  const stageIndex = stage === "seats" ? 0 : stage === "passengers" ? 1 : stage === "payment" ? 2 : 3;

  return <div className="booking-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="booking-dialog" role="dialog" aria-modal="true" aria-labelledby="booking-title">
      <header className="booking-dialog-head">
        <div><p className="section-kicker">PLATFORM9-3-4 · DEMO</p><h2 id="booking-title">{stage === "ticket" ? "ตั๋วเดินทางของคุณ" : "จองตั๋วรถไฟ"}</h2></div>
        <button className="icon-button" type="button" onClick={onClose} aria-label="ปิดหน้าต่าง"><X size={19} /></button>
      </header>

      {stage !== "ticket" && <div className="booking-steps" aria-label="ขั้นตอนการจอง">{["ที่นั่ง", "ผู้โดยสาร", "ชำระเงิน"].map((label, index) => <div className={`booking-step ${stageIndex >= index ? "is-current" : ""}`} key={label}><span>{index < stageIndex ? <Check size={13} /> : index + 1}</span>{label}</div>)}</div>}

      {stage !== "ticket" && schedule && fare && <div className="booking-trip-summary"><TrainFront size={18} /><div><strong>{schedule.number} · {fare.label}</strong><span>{schedule.from} ไป {schedule.to} · {formatDate(travelDate)} · {passengerCount} คน</span></div><strong>฿{totalPrice.toLocaleString("th-TH")}</strong></div>}

      {error && <p className="booking-error" role="alert">{error}</p>}

      {stage === "seats" && schedule && fare && <div className="booking-content">
        <div className="seat-legend"><span><i className="seat-swatch" /> ว่าง</span><span><i className="seat-swatch seat-swatch-selected" /> เลือกแล้ว</span><span><i className="seat-swatch seat-swatch-taken" /> ไม่ว่าง</span></div>
        <div className="seat-map" aria-label="ผังที่นั่งตัวอย่าง">
          <div className="seat-map-header"><span>หัวขบวน</span><TrainFront size={18} /></div>
          <div className="seat-grid">{availableSeats.map((seat, index) => {
            const aisle = index % 4 === 2;
            const unavailable = occupiedSeats.has(seat);
            const selected = selectedSeats.includes(seat);
            return <button className={`seat ${selected ? "seat-selected" : ""} ${unavailable ? "seat-taken" : ""} ${aisle ? "seat-aisle" : ""}`} key={seat} type="button" disabled={unavailable} aria-pressed={selected} aria-label={`ที่นั่ง ${seat}${unavailable ? " ไม่ว่าง" : selected ? " เลือกแล้ว" : " ว่าง"}`} onClick={() => toggleSeat(seat)}>{seat.slice(-1)}</button>;
          })}</div>
          <div className="seat-map-foot">เลือก {selectedSeats.length} จาก {passengerCount} ที่นั่ง <span>· ผังจำลอง</span></div>
        </div>
        <button className="search-submit" type="button" disabled={selectedSeats.length !== passengerCount} onClick={() => { setError(""); setStage("passengers"); }}>
          กรอกข้อมูลผู้โดยสาร <ArrowRight size={16} />
        </button>
      </div>}

      {stage === "passengers" && schedule && fare && <form className="booking-content" onSubmit={(event) => { event.preventDefault(); setError(""); setStage("payment"); }}>
        <h3>ข้อมูลผู้โดยสาร</h3>
        <p className="booking-muted">กรอกชื่อสำหรับแสดงบนตั๋วทดลอง ไม่ต้องระบุเลขบัตรประชาชน</p>
        {selectedSeats.map((seat, index) => <label className="field passenger-field" key={seat}>ผู้โดยสาร {index + 1} · ที่นั่ง {seat}<input className="passenger-input" value={names[index] ?? ""} onChange={(event) => setNames((current) => current.map((name, nameIndex) => nameIndex === index ? event.target.value : name))} autoComplete="name" required maxLength={80} placeholder="ชื่อและนามสกุล" /></label>)}
        <div className="booking-actions"><button className="secondary-button" type="button" onClick={() => setStage("seats")}><ArrowLeft size={15} /> กลับไปเลือกที่นั่ง</button><button className="search-submit" type="submit">ตรวจสอบและชำระเงิน <ArrowRight size={16} /></button></div>
      </form>}

      {stage === "payment" && schedule && fare && <div className="booking-content">
        <h3>เลือกวิธีชำระเงินจำลอง</h3>
        <p className="booking-muted">ระบบจะไม่ตัดเงินจริงและไม่ขอข้อมูลบัตร</p>
        <label className={`payment-option ${paymentMethod === "promptpay-demo" ? "payment-selected" : ""}`}><input type="radio" name="payment-method" value="promptpay-demo" checked={paymentMethod === "promptpay-demo"} onChange={() => setPaymentMethod("promptpay-demo")} /><QrCode size={19} /><span><strong>PromptPay QR จำลอง</strong><small>แสดงตั๋วทดลองทันทีหลังยืนยัน</small></span></label>
        <label className={`payment-option ${paymentMethod === "card-demo" ? "payment-selected" : ""}`}><input type="radio" name="payment-method" value="card-demo" checked={paymentMethod === "card-demo"} onChange={() => setPaymentMethod("card-demo")} /><CreditCard size={19} /><span><strong>บัตรเครดิตจำลอง</strong><small>ไม่ต้องกรอกหมายเลขบัตรหรือ CVV</small></span></label>
        <div className="payment-total"><span>ยอดรวมสำหรับ {passengerCount} คน</span><strong>฿{totalPrice.toLocaleString("th-TH")}</strong></div>
        <div className="demo-warning"><ShieldAlert size={17} /><span>การยืนยันนี้สร้างเฉพาะตั๋วทดลองในเบราว์เซอร์ ไม่ใช่การสำรองที่นั่งหรือหลักฐานเดินทางจริง</span></div>
        <div className="booking-actions"><button className="secondary-button" type="button" onClick={() => setStage("passengers")}><ArrowLeft size={15} /> กลับไปแก้ข้อมูล</button><button className="search-submit" type="button" onClick={finishDemoPayment}>ยืนยันการชำระเงินจำลอง <ArrowRight size={16} /></button></div>
      </div>}

      {stage === "ticket" && currentTicket && <div className="booking-content ticket-content">
        {currentTicket.status === "cancelled" ? <div className="cancelled-notice"><Ban size={21} /><strong>ยกเลิกตั๋วทดลองแล้ว</strong><span>ไม่มีการคืนเงินจริงหรือเปลี่ยนแปลงการจองรถไฟ</span></div> : <div className="ticket-status"><Check size={15} /> ชำระเงินจำลองสำเร็จ · ตั๋วทดลอง</div>}
        <div className="ticket-layout"><div className="ticket-details">
          <p className="ticket-reference">รหัสทดลอง <strong>{currentTicket.bookingReference}</strong></p>
          <h3>{currentTicket.origin} <ArrowRight size={15} /> {currentTicket.destination}</h3>
          <div className="ticket-info-grid"><span>ขบวน<strong>{currentTicket.trainNumber}</strong></span><span>วันเดินทาง<strong>{formatDate(currentTicket.travelDate)}</strong></span><span>เวลาออก<strong>{currentTicket.departure}</strong></span><span>เวลาเข้า<strong>{currentTicket.arrival}</strong></span><span>ชั้นโดยสาร<strong>{currentTicket.fareLabel}</strong></span><span>ยอดจำลอง<strong>฿{currentTicket.totalPrice.toLocaleString("th-TH")}</strong></span></div>
          <div className="ticket-passengers">{currentTicket.passengers.map((passenger, index) => <div key={`${passenger.seat}-${index}`}><span>ผู้โดยสาร {index + 1}</span><strong>{passenger.name}</strong><span>ที่นั่ง {passenger.seat}</span></div>)}</div>
        </div><div className="ticket-qr"><QRCodeSVG value={currentTicket.qrPayload} size={148} level="M" title="QR code สำหรับตั๋วทดลอง" /><span>QR สำหรับทดสอบเท่านั้น</span></div></div>
        <div className="demo-warning"><ShieldAlert size={17} /><span>ตั๋วนี้สร้างจากข้อมูลจำลอง ไม่สามารถใช้ขึ้นรถไฟหรือยืนยันการเดินทางจริงได้</span></div>
        <div className="booking-actions ticket-actions"><button className="secondary-button" type="button" onClick={() => window.print()}><Printer size={15} /> พิมพ์ตั๋วทดลอง</button>{currentTicket.status === "simulation-paid" && <button className="cancel-button" type="button" onClick={cancelDemoTicket}><Ban size={15} /> ยกเลิกตั๋วทดลอง</button>}<button className="search-submit" type="button" onClick={onClose}>เสร็จสิ้น <Check size={16} /></button></div>
      </div>}
    </section>
  </div>;
}
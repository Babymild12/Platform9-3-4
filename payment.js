const paymentSummary = document.getElementById('paymentSummary');
const totalAmount = document.getElementById('totalAmount');
const paymentForm = document.getElementById('paymentForm');

function getBookingData() {
  const data = localStorage.getItem('platform9_booking');
  if (!data) {
    return null;
  }
  return JSON.parse(data);
}

function renderPaymentSummary() {
  const booking = getBookingData();

  if (!booking) {
    paymentSummary.innerHTML = '<p>ไม่พบข้อมูลการจอง กรุณาเลือกขบวนรถก่อนชำระเงิน</p>';
    totalAmount.textContent = '฿0';
    return;
  }

  const total = booking.train.price * booking.travelers;
  paymentSummary.innerHTML = `
    <div class="summary-line">
      <span>ขบวน</span>
      <strong>${booking.train.name}</strong>
    </div>
    <div class="summary-line">
      <span>เส้นทาง</span>
      <strong>${booking.train.from} → ${booking.train.to}</strong>
    </div>
    <div class="summary-line">
      <span>ที่นั่ง</span>
      <strong>${booking.seats.join(', ')}</strong>
    </div>
    <div class="summary-line">
      <span>ผู้โดยสาร</span>
      <strong>${booking.passenger.name}</strong>
    </div>
  `;

  totalAmount.textContent = `฿${total.toLocaleString()}`;
}

paymentForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const booking = getBookingData();
  if (!booking) {
    alert('ไม่พบข้อมูลการจอง');
    return;
  }

  const name = document.getElementById('cardName').value.trim();
  const cardNumber = document.getElementById('cardNumber').value.trim();
  const expiry = document.getElementById('expiry').value.trim();
  const cvv = document.getElementById('cvv').value.trim();

  if (!name || !cardNumber || !expiry || !cvv) {
    alert('กรุณากรอกข้อมูลบัตรให้ครบถ้วน');
    return;
  }

  const ticket = {
    ...booking,
    ticketId: `P9-${Date.now()}`,
    paidAt: new Date().toISOString()
  };

  localStorage.setItem('platform9_ticket', JSON.stringify(ticket));
  localStorage.removeItem('platform9_booking');
  paymentForm.reset();

  alert(`ชำระเงินสำเร็จ\n\n${booking.train.name}\n${booking.train.from} → ${booking.train.to}\nที่นั่ง: ${booking.seats.join(', ')}\nยอดชำระ: ฿${(booking.train.price * booking.travelers).toLocaleString()}`);
  window.location.href = 'ticket.html';
});

renderPaymentSummary();

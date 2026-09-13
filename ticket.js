const ticketContent = document.getElementById('ticketContent');

function getTicketData() {
  const data = localStorage.getItem('platform9_ticket');
  if (!data) {
    return null;
  }
  return JSON.parse(data);
}

function generateQrCodeText(ticket) {
  return JSON.stringify({
    ticketId: ticket.ticketId,
    name: ticket.passenger.name,
    route: `${ticket.train.from} → ${ticket.train.to}`,
    seats: ticket.seats,
    paidAt: ticket.paidAt
  });
}

function saveCompletedTicket(ticket) {
  const currentUser = JSON.parse(localStorage.getItem('platform9_current_user') || 'null');
  const key = currentUser ? `platform9_history_${currentUser.email}` : 'platform9_history_guest';
  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  existing.unshift(ticket);
  localStorage.setItem(key, JSON.stringify(existing));
}

function renderTicket() {
  const ticket = getTicketData();

  if (!ticket) {
    ticketContent.innerHTML = `
      <div class="ticket-main" style="padding: 40px;">
        <h3>ไม่พบตั๋ว</h3>
        <p>กรุณาทำการจองและชำระเงินก่อน</p>
      </div>
    `;
    return;
  }

  saveCompletedTicket(ticket);
  const qrValue = generateQrCodeText(ticket);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrValue)}`;

  ticketContent.innerHTML = `
    <div class="ticket-main">
      <div class="ticket-top">
        <div>
          <div class="eyebrow">Electronic Ticket</div>
          <h3 style="margin: 8px 0 0;">${ticket.train.name}</h3>
        </div>
        <span class="ticket-chip">ชำระเงินสำเร็จ</span>
      </div>

      <div class="ticket-grid">
        <div>
          <div class="label">หมายเลขตั๋ว</div>
          <div class="value">${ticket.ticketId}</div>
        </div>
        <div>
          <div class="label">ผู้โดยสาร</div>
          <div class="value">${ticket.passenger.name}</div>
        </div>
        <div>
          <div class="label">เส้นทาง</div>
          <div class="value">${ticket.train.from} → ${ticket.train.to}</div>
        </div>
        <div>
          <div class="label">เวลา</div>
          <div class="value">${ticket.train.depart} - ${ticket.train.arrive}</div>
        </div>
        <div>
          <div class="label">ที่นั่ง</div>
          <div class="value">${ticket.seats.join(', ')}</div>
        </div>
        <div>
          <div class="label">ยอดรวม</div>
          <div class="value">฿${(ticket.train.price * ticket.travelers).toLocaleString()}</div>
        </div>
      </div>

      <div class="ticket-actions">
        <button class="primary-btn" onclick="window.print()">พิมพ์ตั๋ว</button>
        <button class="secondary-btn" onclick="window.location.href='index.html'">กลับหน้าแรก</button>
      </div>
    </div>

    <aside class="ticket-side">
      <div class="qr-box">
        <img src="${qrUrl}" alt="QR Code" />
      </div>
      <div class="label">Scan เพื่อแสดงข้อมูลตั๋ว</div>
      <div class="value" style="font-size: 1rem; margin-top: 8px;">${ticket.ticketId}</div>
    </aside>
  `;
}

renderTicket();

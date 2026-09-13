const historyContent = document.getElementById('historyContent');

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('platform9_current_user'));
  } catch {
    return null;
  }
}

function getHistoryItems() {
  const user = getCurrentUser();
  const key = user ? `platform9_history_${user.email}` : 'platform9_history_guest';
  const items = JSON.parse(localStorage.getItem(key) || '[]');
  return Array.isArray(items) ? items : [];
}

function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function renderHistory() {
  const items = getHistoryItems();

  if (!items.length) {
    historyContent.innerHTML = `
      <div class="empty-box">
        <h3>ยังไม่มีประวัติการเดินทาง</h3>
        <p>คุณสามารถจองตั๋วและดูประวัติย้อนหลังได้ที่นี่</p>
      </div>
    `;
    return;
  }

  historyContent.innerHTML = items
    .map(
      (item) => `
        <div class="history-item">
          <div class="history-top">
            <div>
              <div class="eyebrow">${item.ticketId}</div>
              <h3 style="margin: 8px 0 0;">${item.train.name}</h3>
            </div>
            <span class="status-badge">ชำระเงินสำเร็จ</span>
          </div>

          <div class="history-grid">
            <div class="info-box">
              <div class="label">เส้นทาง</div>
              <div class="value">${item.train.from} → ${item.train.to}</div>
            </div>
            <div class="info-box">
              <div class="label">เวลา</div>
              <div class="value">${item.train.depart} - ${item.train.arrive}</div>
            </div>
            <div class="info-box">
              <div class="label">ที่นั่ง</div>
              <div class="value">${item.seats.join(', ')}</div>
            </div>
            <div class="info-box">
              <div class="label">วันที่ชำระ</div>
              <div class="value">${formatDate(item.paidAt)}</div>
            </div>
          </div>
        </div>
      `
    )
    .join('');
}

renderHistory();

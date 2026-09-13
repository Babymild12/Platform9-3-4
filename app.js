const stations = [
  'กรุงเทพฯ',
  'เชียงใหม่',
  'ขอนแก่น',
  'นครราชสีมา',
  'พิษณุโลก',
  'สุราษฎร์ธานี',
  'หาดใหญ่',
  'เชียงราย'
];

const trains = [
  {
    id: 'TR-101',
    name: 'รถไฟทางไกล 101',
    from: 'กรุงเทพฯ',
    to: 'เชียงใหม่',
    depart: '06:30',
    arrive: '10:20',
    duration: '3 ชั่วโมง 50 นาที',
    className: 'ชั้น 2 Sleeper',
    price: 620,
    seatsLeft: 18,
    rating: 'ดีเยี่ยม'
  },
  {
    id: 'TR-204',
    name: 'รถไฟทางไกล 204',
    from: 'กรุงเทพฯ',
    to: 'ขอนแก่น',
    depart: '08:15',
    arrive: '12:45',
    duration: '4 ชั่วโมง 30 นาที',
    className: 'ชั้น 1 Reserved',
    price: 780,
    seatsLeft: 11,
    rating: 'พิเศษ'
  },
  {
    id: 'TR-315',
    name: 'รถไฟรางเมือง 315',
    from: 'พิษณุโลก',
    to: 'กรุงเทพฯ',
    depart: '09:00',
    arrive: '12:15',
    duration: '3 ชั่วโมง 15 นาที',
    className: 'ชั้น 3 Economy',
    price: 410,
    seatsLeft: 24,
    rating: 'สะดวก'
  },
  {
    id: 'TR-428',
    name: 'รถไฟภาคใต้ 428',
    from: 'กรุงเทพฯ',
    to: 'สุราษฎร์ธานี',
    depart: '17:40',
    arrive: '23:00',
    duration: '5 ชั่วโมง 20 นาที',
    className: 'ชั้น 2 Aircon',
    price: 690,
    seatsLeft: 14,
    rating: 'ยอดนิยม'
  },
  {
    id: 'TR-511',
    name: 'รถไฟด่วน 511',
    from: 'นครราชสีมา',
    to: 'กรุงเทพฯ',
    depart: '06:10',
    arrive: '09:05',
    duration: '2 ชั่วโมง 55 นาที',
    className: 'ชั้น 1 Express',
    price: 540,
    seatsLeft: 20,
    rating: 'เร็ว'
  },
  {
    id: 'TR-620',
    name: 'รถไฟทุ่งกุลาร้องไห้ 620',
    from: 'เชียงราย',
    to: 'กรุงเทพฯ',
    depart: '12:55',
    arrive: '19:10',
    duration: '6 ชั่วโมง 15 นาที',
    className: 'ชั้น 2 Deluxe',
    price: 820,
    seatsLeft: 9,
    rating: 'แรงบันดาลใจ'
  }
];

const seatMap = {};

const state = {
  selectedTrain: null,
  selectedSeats: [],
  travelers: 1
};

const fromStation = document.getElementById('fromStation');
const toStation = document.getElementById('toStation');
const travelDate = document.getElementById('travelDate');
const travelerCount = document.getElementById('travelerCount');
const trainList = document.getElementById('trainList');
const seatMapRoot = document.getElementById('seatMap');
const bookingSummary = document.getElementById('bookingSummary');
const resultsMeta = document.getElementById('resultsMeta');
const seatSummary = document.getElementById('seatSummary');
const searchForm = document.getElementById('searchForm');
const bookingForm = document.getElementById('bookingForm');
const authStatus = document.getElementById('authStatus');

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('platform9_current_user'));
  } catch {
    return null;
  }
}

function updateAuthUI() {
  const user = getCurrentUser();
  const loginLink = document.querySelector('[data-role="login-link"]');
  const logoutLink = document.querySelector('[data-role="logout-link"]');

  if (!user) {
    authStatus.textContent = 'ยังไม่ได้เข้าสู่ระบบ';
    if (loginLink) loginLink.textContent = 'เข้าสู่ระบบ';
    if (logoutLink) logoutLink.style.display = 'none';
    return;
  }

  const name = user.name || user.email.split('@')[0];
  authStatus.textContent = `สวัสดี, ${name}`;
  if (loginLink) loginLink.textContent = 'บัญชีของฉัน';
  if (logoutLink) logoutLink.style.display = 'inline';
}

function initStationOptions() {
  const options = stations
    .map((station) => `<option value="${station}">${station}</option>`)
    .join('');

  fromStation.innerHTML = options;
  toStation.innerHTML = options;

  fromStation.value = 'กรุงเทพฯ';
  toStation.value = 'เชียงใหม่';
  const today = new Date();
  travelDate.value = formatDateInput(today);
}

function formatDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function renderSearchResults() {
  const from = fromStation.value;
  const to = toStation.value;
  const travelers = Number(travelerCount.value);
  state.travelers = travelers;

  if (!from || !to || from === to) {
    trainList.innerHTML = '<div class="empty-state">กรุณาเลือกสถานีต้นทางและปลายทางให้ต่างกัน</div>';
    resultsMeta.textContent = 'กรุณาเลือกเส้นทางที่ถูกต้อง';
    return;
  }

  const filtered = trains.filter((train) => train.from === from && train.to === to);

  if (!filtered.length) {
    trainList.innerHTML = '<div class="empty-state">ไม่พบขบวนรถที่ตรงกับเส้นทางนี้ ลองเปลี่ยนวันหรือสถานี</div>';
    resultsMeta.textContent = 'ไม่มีเที่ยวที่ตรงกับข้อมูล';
    return;
  }

  resultsMeta.textContent = `${filtered.length} ขบวนรถ • ${travelers} ผู้โดยสาร`;

  trainList.innerHTML = filtered
    .map(
      (train) => `
        <article class="train-card ${state.selectedTrain && state.selectedTrain.id === train.id ? 'selected' : ''}">
          <div class="train-top">
            <div>
              <div class="train-name">${train.name}</div>
              <div class="small-note">${train.id} • ${train.className}</div>
            </div>
            <span class="train-badge">${train.rating}</span>
          </div>

          <div class="route">
            <div class="time-box">
              <div class="time-label">ออก</div>
              <div class="time">${train.depart}</div>
              <div class="small-note">${train.from}</div>
            </div>
            <div class="route-arrow">→</div>
            <div class="time-box">
              <div class="time-label">ถึง</div>
              <div class="time">${train.arrive}</div>
              <div class="small-note">${train.to}</div>
            </div>
          </div>

          <div class="train-meta">
            <span>ระยะเวลา ${train.duration}</span>
            <span>ที่นั่งว่าง ${train.seatsLeft}</span>
          </div>

          <div class="train-footer">
            <div class="price-wrap">
              <span class="small-note">เริ่มที่</span>
              <span class="price">฿${train.price.toLocaleString()}</span>
            </div>
            <button class="select-btn" data-train-id="${train.id}">
              ${state.selectedTrain && state.selectedTrain.id === train.id ? 'เลือกแล้ว' : 'เลือกขบวน'}
            </button>
          </div>
        </article>
      `
    )
    .join('');

  document.querySelectorAll('.select-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const selectedTrain = filtered.find((train) => train.id === button.dataset.trainId);
      state.selectedTrain = selectedTrain;
      state.selectedSeats = [];
      setupSeatMap(selectedTrain);
      renderSearchResults();
      renderBookingSummary();
    });
  });

  if (!state.selectedTrain || !filtered.some((train) => train.id === state.selectedTrain.id)) {
    state.selectedTrain = filtered[0];
    setupSeatMap(state.selectedTrain);
  }
}

function setupSeatMap(train) {
  if (!train) {
    seatMapRoot.innerHTML = '<div class="empty-state">กรุณาเลือกขบวนรถ</div>';
    seatSummary.textContent = 'ยังไม่ได้เลือกขบวน';
    return;
  }

  const seatNumbers = ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'B4', 'C1', 'C2', 'C3', 'C4'];
  const occupiedSet = new Set(['A2', 'B3', 'C1', 'C4']);
  const lockedSet = new Set(['A4']);

  const seatState = {};
  seatNumbers.forEach((seat) => {
    if (occupiedSet.has(seat)) {
      seatState[seat] = 'occupied';
    } else if (lockedSet.has(seat)) {
      seatState[seat] = 'locked';
    } else {
      seatState[seat] = 'available';
    }
  });

  seatMap[train.id] = seatState;

  const currentMap = seatMap[train.id] || seatState;
  seatMapRoot.innerHTML = seatNumbers
    .map((seat) => {
      const status = currentMap[seat];
      const isSelected = state.selectedSeats.includes(seat);
      const classes = ['seat', status];
      if (isSelected) classes.push('selected');
      return `<button class="${classes.join(' ')}" data-seat="${seat}" ${status === 'occupied' || status === 'locked' ? 'disabled' : ''}>${seat}</button>`;
    })
    .join('');

  seatSummary.textContent = `${train.name} • ${train.depart} - ${train.arrive}`;

  seatMapRoot.querySelectorAll('.seat.available, .seat.selected').forEach((button) => {
    button.addEventListener('click', () => {
      const seat = button.dataset.seat;
      const seatIndex = state.selectedSeats.indexOf(seat);

      if (seatIndex >= 0) {
        state.selectedSeats.splice(seatIndex, 1);
      } else {
        if (state.selectedSeats.length >= state.travelers) {
          alert(`คุณเลือกที่นั่งแล้ว ${state.travelers} ที่นั่ง`);
          return;
        }
        state.selectedSeats.push(seat);
      }

      setupSeatMap(train);
      renderBookingSummary();
    });
  });
}

function renderBookingSummary() {
  const train = state.selectedTrain;
  if (!train) {
    bookingSummary.innerHTML = '<p>ยังไม่มีข้อมูลการเลือก</p>';
    return;
  }

  const total = train.price * state.travelers;
  const seatsText = state.selectedSeats.length ? state.selectedSeats.join(', ') : 'ยังไม่ได้เลือก';

  bookingSummary.innerHTML = `
    <div class="summary-line">
      <span>ขบวน</span>
      <strong>${train.name}</strong>
    </div>
    <div class="summary-line">
      <span>เส้นทาง</span>
      <strong>${train.from} → ${train.to}</strong>
    </div>
    <div class="summary-line">
      <span>เวลา</span>
      <strong>${train.depart} - ${train.arrive}</strong>
    </div>
    <div class="summary-line">
      <span>ที่นั่ง</span>
      <strong>${seatsText}</strong>
    </div>
    <div class="summary-line">
      <span>จำนวน</span>
      <strong>${state.travelers} คน</strong>
    </div>
    <div class="summary-line">
      <span>รวม</span>
      <strong>฿${total.toLocaleString()}</strong>
    </div>
  `;
}

function saveBookingSession() {
  if (!state.selectedTrain) {
    return;
  }

  const booking = {
    train: state.selectedTrain,
    seats: state.selectedSeats,
    travelers: state.travelers,
    passenger: {
      name: document.getElementById('passengerName').value.trim(),
      phone: document.getElementById('passengerPhone').value.trim(),
      email: document.getElementById('passengerEmail').value.trim()
    }
  };

  localStorage.setItem('platform9_booking', JSON.stringify(booking));
}

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  renderSearchResults();
});

bookingForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!getCurrentUser()) {
    alert('กรุณาเข้าสู่ระบบก่อนทำการจองตั๋ว');
    window.location.href = 'login.html';
    return;
  }

  const name = document.getElementById('passengerName').value.trim();
  const phone = document.getElementById('passengerPhone').value.trim();
  const email = document.getElementById('passengerEmail').value.trim();

  if (!state.selectedTrain) {
    alert('กรุณาเลือกขบวนรถก่อนยืนยัน');
    return;
  }

  if (state.selectedSeats.length !== state.travelers) {
    alert(`กรุณาเลือกที่นั่งให้ครบ ${state.travelers} ที่นั่ง`);
    return;
  }

  if (!name || !phone || !email) {
    alert('กรุณากรอกข้อมูลผู้โดยสารให้ครบถ้วน');
    return;
  }

  saveBookingSession();
  window.location.href = 'payment.html';
});

const logoutLink = document.querySelector('[data-role="logout-link"]');
if (logoutLink) {
  logoutLink.addEventListener('click', (event) => {
    event.preventDefault();
    localStorage.removeItem('platform9_current_user');
    updateAuthUI();
  });
}

initStationOptions();
updateAuthUI();
renderSearchResults();
renderBookingSummary();

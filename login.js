const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  if (!email || !password) {
    alert('กรุณากรอกอีเมลและรหัสผ่าน');
    return;
  }

  const user = {
    email,
    name: email.split('@')[0],
    password
  };

  localStorage.setItem('platform9_current_user', JSON.stringify(user));
  alert('เข้าสู่ระบบสำเร็จ');
  window.location.href = 'index.html';
});

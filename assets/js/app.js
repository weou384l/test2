// شبیه‌سازی ورود به سیستم
function login(event) {
  event.preventDefault(); // جلوگیری از ارسال فرم

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === "admin" && password === "1234") {
    document.getElementById("login-page").classList.add("hidden");
    document.getElementById("dashboard-page").classList.remove("hidden");
    showDate();
    runCreditBar();
  } else {
    alert("نام کاربری یا کلمه عبور اشتباه است!");
  }
}

// نمایش تاریخ
function showDate() {
  const now = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const miladi = now.toLocaleDateString('en-US', options);
  const farsi = now.toLocaleDateString('fa-IR', options);

  document.getElementById("date-info").innerHTML = `
    <div>میلادی: ${miladi}</div>
    <div>شمسی: ${farsi}</div>
  `;
}

// گرافیک مانده اعتبار
function runCreditBar() {
  const creditText = document.getElementById("credit-text");
  const creditBar = document.getElementById("credit-bar");
  let percent = 85; // درصد مانده اعتبار

  // حرکت دادن بار گرافیکی
  creditBar.style.strokeDashoffset = (314 - (314 * percent) / 100).toString();
  creditText.innerText = `${percent}%`;
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("login-form").addEventListener("submit", login);
});

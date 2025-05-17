function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (username && password) {
    document.getElementById("login-section").classList.add("hidden");
    document.getElementById("dashboard-section").classList.remove("hidden");
    checkHttps();
    getIpInfo();
  } else {
    alert("لطفاً نام کاربری و رمز عبور را وارد کنید.");
  }
}

function checkHttps() {
  const status = document.getElementById("https-status");
  if (location.protocol === "https:") {
    status.textContent = "اتصال شما امن است (HTTPS)";
    status.style.color = "#0f0";
  } else {
    status.textContent = "اتصال شما امن نیست (HTTP)";
    status.style.color = "#f00";
  }
}

function getIpInfo() {
  fetch("https://ipinfo.io/json?token=YOUR_TOKEN_HERE")
    .then(response => response.json())
    .then(data => {
      const info = `${data.ip} - ${data.city}, ${data.country}`;
      document.getElementById("ip-info").textContent = info;
    })
    .catch(() => {
      document.getElementById("ip-info").textContent = "خطا در دریافت اطلاعات IP";
    });
}

function runSpeedTest() {
  const startTime = performance.now();
  fetch("https://via.placeholder.com/500x500.png")
    .then(() => {
      const endTime = performance.now();
      const duration = (endTime - startTime) / 1000; // seconds
      const sizeMB = 0.25; // MB (تقریبی برای placeholder)
      const speedMbps = ((sizeMB * 8) / duration).toFixed(2);
      document.getElementById("speed-result").textContent = `سرعت تقریبی: ${speedMbps} مگابیت بر ثانیه`;
    })
    .catch(() => {
      document.getElementById("speed-result").textContent = "خطا در انجام تست سرعت";
    });
}

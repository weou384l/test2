function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (username && password) {
    document.getElementById("login-section").classList.add("hidden");
    document.getElementById("dashboard-section").classList.remove("hidden");
    checkHttps();
    getIpInfo();
  } else {
    alert("نام کاربری و رمز عبور الزامیست.");
  }
}

function checkHttps() {
  const status = document.getElementById("https-status");
  if (location.protocol === "https:") {
    status.textContent = "🔒 اتصال امن (HTTPS)";
    status.style.color = "lightgreen";
  } else {
    status.textContent = "⚠️ اتصال ناامن (HTTP)";
    status.style.color = "orange";
  }
}

function getIpInfo() {
  fetch("https://ipinfo.io/json?token=8a1e6b0e4d4f69")
    .then(response => response.json())
    .then(data => {
      const info = `IP: ${data.ip} - ${data.city}, ${data.country}`;
      document.getElementById("ip-info").textContent = info;
    })
    .catch(() => {
      document.getElementById("ip-info").textContent = "خطا در دریافت آی‌پی.";
    });
}

function runSpeedTest() {
  const url = "https://speed.hetzner.de/100MB.bin"; // تست واقعی با فایل بزرگ
  const start = new Date().getTime();

  fetch(url, { method: "GET", cache: "no-store" })
    .then(response => response.blob())
    .then(blob => {
      const end = new Date().getTime();
      const duration = (end - start) / 1000; // زمان بر حسب ثانیه
      const sizeMB = blob.size / (1024 * 1024); // مگابایت
      const speedMbps = ((sizeMB * 8) / duration).toFixed(2);
      document.getElementById("speed-result").textContent =
        `سرعت دانلود: ${speedMbps} مگابیت بر ثانیه`;
    })
    .catch(() => {
      document.getElementById("speed-result").textContent = "خطا در تست سرعت.";
    });
}

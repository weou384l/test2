function login() {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();
  if (user && pass) {
    document.getElementById("login-section").classList.add("hidden");
    document.getElementById("dashboard-section").classList.remove("hidden");
    checkHttps();
    getIP();
  } else {
    alert("لطفاً نام کاربری و رمز را وارد کنید.");
  }
}

function checkHttps() {
  const el = document.getElementById("https-status");
  if (location.protocol === "https:") {
    el.textContent = "✅ اتصال امن (HTTPS)";
    el.style.color = "lightgreen";
  } else {
    el.textContent = "⚠️ اتصال ناامن (HTTP)";
    el.style.color = "orange";
  }
}

function getIP() {
  fetch("https://ipinfo.io/json?token=8a1e6b0e4d4f69")
    .then(res => res.json())
    .then(data => {
      document.getElementById("ip-info").textContent = `${data.ip} (${data.country})`;
    })
    .catch(() => {
      document.getElementById("ip-info").textContent = "❌ خطا در دریافت اطلاعات آی‌پی";
    });
}

function runSpeedTest() {
  const startTime = performance.now();

  fetch("https://corsproxy.io/?https://speed.cloudflare.com/__down?bytes=5000000", { cache: "no-store" })
    .then(() => {
      const endTime = performance.now();
      const duration = (endTime - startTime) / 1000;
      const bitsLoaded = 5000000 * 8;
      const speedMbps = (bitsLoaded / duration / 1024 / 1024).toFixed(2);
      document.getElementById("speed-result").textContent = `📶 سرعت تقریبی: ${speedMbps} مگابیت بر ثانیه`;
    })
    .catch(() => {
      document.getElementById("speed-result").textContent = "❌ تست سرعت با خطا مواجه شد";
    });
}

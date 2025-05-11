document.body.className = 'login-background';

let loggedIn = false;

async function getUserNetworkInfo() {
  const response = await fetch('https://ipinfo.io/json?token=8824fa830e1d01');
  const data = await response.json();
  const networkInfo = {
    ip: data.ip,
    isp: data.org
  };

  // بررسی اینکه آیا IP مربوط به Cloudflare هست یا نه
  if (networkInfo.isp.includes("Cloudflare")) {
    networkInfo.isCloudflare = true; // علامت‌گذاری به عنوان Cloudflare
  } else {
    networkInfo.isCloudflare = false;
  }

  return networkInfo;
}

function renderLogin() {
  app.innerHTML = `
    <div class="flex items-center justify-center min-h-screen px-4">
      <div class="bg-gray-900 p-8 rounded-2xl shadow-2xl max-w-sm w-full">
        <h2 class="text-2xl font-bold text-center mb-6">ورود به حساب</h2>
        <input id="username" type="text" placeholder="نام کاربری"
          class="w-full p-3 mb-4 rounded bg-gray-800 text-white focus:outline-none" />
        <input id="password" type="password" placeholder="رمز عبور"
          class="w-full p-3 mb-6 rounded bg-gray-800 text-white focus:outline-none" />
        <button onclick="handleLogin()" class="w-full py-3 button-glow rounded text-black font-bold">ورود</button>
      </div>
    </div>
  `;
}

function renderDashboard(networkInfo) {
  document.body.className = 'dashboard-background';

  app.innerHTML = `
    <div class="min-h-screen p-6 flex flex-col items-center space-y-8">
      <h1 class="text-3xl font-bold">داشبورد کاربر</h1>

      <!-- ردیف اول -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <div class="card text-center">
          <h2 class="text-xl font-bold mb-4">مانده اعتبار</h2>
          <svg class="circle-progress mx-auto mb-4" width="120" height="120">
            <circle cx="60" cy="60" r="50" stroke="#333" stroke-width="10" fill="none" />
            <circle class="progress" cx="60" cy="60" r="50" stroke="#00c2ff" stroke-width="10" fill="none" stroke-linecap="round" transform="rotate(-90 60 60)" />
          </svg>
          <div id="credit-percent" class="text-2xl font-bold text-cyan-400">85%</div>
          <p class="text-gray-300">از حجم سرویس شما باقی‌مانده است.</p>
        </div>

        <div class="card text-center">
          <h2 class="text-xl font-bold mb-4">اطلاعات شبکه</h2>
          <div class="text-lg mb-2 text-gray-300">آی‌پی: <span class="text-cyan-400">${networkInfo.ip}</span></div>
          <div class="text-lg mb-2 text-gray-300">شرکت اینترنت: <span class="text-cyan-400">${networkInfo.isp}</span></div>
          
          <!-- اضافه کردن پیام Cloudflare یا غیر Cloudflare -->
          ${networkInfo.isCloudflare ? 
            `<div class="text-sm text-green-400 mt-2">شما اکنون در حال استفاده از سرویس Cloudflare می‌باشید.</div>`
            : `<div class="text-sm text-orange-400 mt-2">شما در حال استفاده از سرویس ما نمی‌باشید.</div>`
          }
        </div>
      </div>

      <!-- سایر بخش‌های داشبورد ... -->

      <button onclick="logout()" class="mt-8 py-2 px-4 bg-red-600 rounded hover:bg-red-700 transition">خروج</button>
    </div>
  `;

  // بروزرسانی دایره اعتبار
  updateCreditCircle(85); // درصد مانده اعتبار
}

function handleLogin() {
  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;

  if (user === 'admin' && pass === '1234') {
    loggedIn = true;
    getUserNetworkInfo().then(networkInfo => renderDashboard(networkInfo));
  } else {
    alert('نام کاربری یا رمز عبور اشتباه است.');
  }
}

function logout() {
  loggedIn = false;
  renderLogin();
}

function updateCreditCircle(percent) {
  const circle = document.querySelector('.circle-progress .progress');
  const radius = circle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;

  circle.style.strokeDasharray = `${circumference}`;
  circle.style.strokeDashoffset = `${circumference * (1 - percent / 100)}`;

  document.getElementById('credit-percent').innerText = `${percent}%`;
}

renderLogin();

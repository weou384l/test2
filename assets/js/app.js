document.body.className = 'login-background';

let loggedIn = false;

async function getUserNetworkInfo() {
  try {
    const response = await fetch('https://ipinfo.io/json?token=8824fa830e1d01');
    const data = await response.json();
    const country = data.country || "IR";
    const ip = data.ip || "نامشخص";
    const isp = data.org || null;
    const flagURL = `https://flagcdn.com/24x18/${country.toLowerCase()}.png`;

    const isCloudflare = isp && isp.toLowerCase().includes("cloudflare");
    return { ip, isp, country, isCloudflare, flagURL };
  } catch (e) {
    return {
      ip: "نامشخص",
      isp: null,
      country: "IR",
      isCloudflare: false,
      flagURL: "https://flagcdn.com/24x18/ir.png"
    };
  }
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

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">

        <!-- مانده اعتبار -->
        <div class="card text-center">
          <h2 class="text-xl font-bold mb-4">مانده اعتبار</h2>
          <div class="relative w-32 h-32 mx-auto">
            <svg class="circle-progress" width="128" height="128">
              <circle cx="64" cy="64" r="60" stroke="#2d3748" stroke-width="8" fill="none" />
              <circle class="progress" cx="64" cy="64" r="60" stroke="#00c2ff" stroke-width="8" fill="none" stroke-linecap="round" transform="rotate(-90 64 64)" />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center text-cyan-400 text-2xl font-bold" id="credit-percent">85%</div>
          </div>
          <p class="mt-2">از حجم سرویس شما باقی‌مانده است.</p>
        </div>

        <!-- اطلاعات شبکه -->
        <div class="card text-center">
          <h2 class="text-xl font-bold mb-4">اطلاعات شبکه</h2>
          <div class="text-lg mb-2 text-gray-300">
            ${
              networkInfo.ip === "نامشخص"
                ? `<span class="text-cyan-400">ایران</span> <img src="https://flagcdn.com/24x18/ir.png" class="inline ml-2 w-6 h-4">`
                : `آی‌پی: <span class="text-cyan-400">${networkInfo.ip}</span> 
                   ${networkInfo.flagURL ? `<img src="${networkInfo.flagURL}" class="inline ml-2 w-6 h-4">` : ''}`
            }
          </div>
          ${
            networkInfo.ip === "نامشخص" || !networkInfo.isp
              ? ``
              : `<div class="text-lg mb-2 text-gray-300">شرکت اینترنت: <span class="text-cyan-400">${networkInfo.isp}</span></div>`
          }
          ${
            networkInfo.isCloudflare
              ? `<div class="text-green-400 mt-2">شما اکنون در حال استفاده از سرویس ما می‌باشید.</div>`
              : networkInfo.country === "IR"
                ? `<div class="text-yellow-400 mt-2">شما در حال استفاده از سرویس ما نمی‌باشید.</div>`
                : ``
          }
        </div>
      </div>

      <!-- وضعیت اتصال -->
      <div class="w-full max-w-2xl">
        <div class="card text-center flex items-center justify-center gap-4">
          ${
            window.location.protocol === "https:" 
              ? `<span class="text-green-400 text-xl">🟢 اتصال شما امن است (HTTPS)</span>`
              : `<span class="text-yellow-400 text-xl">🟡 اتصال امن نیست (HTTP)</span>`
          }
        </div>
      </div>

      <!-- تست سرعت -->
      <div class="w-full max-w-2xl">
        <div class="card text-center">
          <h2 class="text-xl font-bold mb-4">تست سرعت اینترنت</h2>
          <iframe src="https://fast.com" class="w-full h-64 rounded" frameborder="0" loading="lazy"></iframe>
        </div>
      </div>

      <button onclick="logout()" class="mt-8 py-2 px-4 bg-red-600 rounded hover:bg-red-700 transition">خروج</button>
    </div>
  `;

  updateCreditCircle(85);
}

function updateCreditCircle(percent) {
  const circle = document.querySelector('.circle-progress .progress');
  const radius = circle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;
  circle.style.strokeDasharray = `${circumference}`;
  circle.style.strokeDashoffset = `${circumference * (1 - percent / 100)}`;
  document.getElementById('credit-percent').innerText = `${percent}%`;
}

function handleLogin() {
  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;

  if (user === 'admin' && pass === '1234') {
    loggedIn = true;
    getUserNetworkInfo().then(info => renderDashboard(info));
  } else {
    alert('نام کاربری یا رمز عبور اشتباه است.');
  }
}

function logout() {
  loggedIn = false;
  renderLogin();
}

renderLogin();

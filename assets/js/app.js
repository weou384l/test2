document.body.className = 'login-background';

let loggedIn = false;

async function getUserNetworkInfo() {
  try {
    const response = await fetch('https://ipinfo.io/json?token=8824fa830e1d01');
    const data = await response.json();
    return {
      ip: data.ip,
      isp: data.org || '',
      country: data.country || 'IR'
    };
  } catch (error) {
    return {
      ip: null,
      isp: null,
      country: 'IR'
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

  const isCloudflare = networkInfo.isp && networkInfo.isp.toLowerCase().includes('cloudflare');
  const isIran = networkInfo.country === 'IR' || networkInfo.ip === null;

  let ipDisplay = '';
  let ispDisplay = '';
  let statusNote = '';

  if (networkInfo.ip === null) {
    ipDisplay = `<span class="text-cyan-400">ایران 🇮🇷</span>`;
    statusNote = `<div class="text-yellow-400 text-sm mt-2">🟡 شما در حال استفاده از سرویس ما نمی‌باشید</div>`;
  } else {
    const flag = `<img src="https://flagcdn.com/24x18/${networkInfo.country.toLowerCase()}.png" class="inline ml-1"/>`;
    ipDisplay = `${networkInfo.ip} ${flag}`;
    if (isCloudflare) {
      statusNote = `<div class="text-green-400 text-sm mt-2">🟢 شما اکنون در حال استفاده از سرویس ما می‌باشید</div>`;
    } else {
      statusNote = `<div class="text-yellow-400 text-sm mt-2">🟡 شما در حال استفاده از سرویس ما نمی‌باشید</div>`;
    }
    ispDisplay = isCloudflare ? '' : `<div class="text-lg mb-2 text-gray-300">شرکت اینترنت: <span class="text-cyan-400">${networkInfo.isp}</span></div>`;
  }

  const today = new Date();
  const jdate = jalaali.toJalaali(today);
  const jalaliStr = `${jdate.jy}/${jdate.jm.toString().padStart(2, '0')}/${jdate.jd.toString().padStart(2, '0')}`;
  const gregorianStr = `${today.getFullYear()}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getDate().toString().padStart(2, '0')}`;

  app.innerHTML = `
    <div class="min-h-screen p-6 flex flex-col items-center space-y-8">
      <h1 class="text-3xl font-bold">داشبورد کاربر</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">

        <div class="card text-center">
          <h2 class="text-xl font-bold mb-4">مانده اعتبار</h2>
          <div class="circle-progress">
            <svg width="120" height="120">
              <circle class="progress-bg" cx="60" cy="60" r="50"/>
              <circle class="progress" cx="60" cy="60" r="50"/>
            </svg>
            <div class="percent-text" id="credit-percent">0%</div>
          </div>
        </div>

        <div class="card text-center">
          <h2 class="text-xl font-bold mb-4">اطلاعات شبکه</h2>
          <div class="text-lg mb-2 text-gray-300">آی‌پی: <span class="text-cyan-400">${ipDisplay}</span></div>
          ${ispDisplay}
          ${statusNote}
        </div>
      </div>

      <div class="w-full max-w-2xl">
        <div class="card text-center flex items-center justify-center gap-4">
          ${
            window.location.protocol === "https:" 
              ? `<span class="text-green-400 text-xl">🟢 اتصال شما امن است (HTTPS)</span>`
              : `<span class="text-yellow-400 text-xl">🟡 اتصال امن نیست (HTTP)</span>`
          }
        </div>
      </div>

      <div class="w-full max-w-2xl">
        <div class="card text-center">
          <h2 class="text-xl font-bold mb-4">تاریخ امروز</h2>
          <p class="text-lg text-gray-200">شمسی: <span class="text-cyan-400">${jalaliStr}</span></p>
          <p class="text-lg text-gray-200 mt-2">میلادی: <span class="text-cyan-400">${gregorianStr}</span></p>
        </div>
      </div>

      <button onclick="logout()" class="mt-8 py-2 px-4 bg-red-600 rounded hover:bg-red-700 transition">خروج</button>
    </div>
  `;

  updateCreditCircle(85);
}

function updateCreditCircle(percent) {
  const circle = document.querySelector('.circle-progress .progress');
  if (!circle) return;
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
    getUserNetworkInfo().then(networkInfo => renderDashboard(networkInfo));
  } else {
    alert('نام کاربری یا رمز عبور اشتباه است.');
  }
}

function logout() {
  loggedIn = false;
  renderLogin();
}

renderLogin();

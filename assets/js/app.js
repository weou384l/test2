document.body.className = 'login-background';

let loggedIn = false;

async function getUserNetworkInfo() {
  try {
    const response = await fetch('https://ipinfo.io/json?token=8824fa830e1d01');
    const data = await response.json();

    return {
      ip: data.ip,
      isp: data.org,
      country: data.country
    };
  } catch (e) {
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

  const isCloudflare = networkInfo.isp?.toLowerCase().includes('cloudflare');
  const flagURL = networkInfo.country ? `https://flagcdn.com/w40/${networkInfo.country.toLowerCase()}.png` : '';
  let ipSection = '';
  let statusText = '';

  if (!networkInfo.ip) {
    ipSection = `<div class="text-lg mb-2 text-gray-300">
      <img src="https://flagcdn.com/w40/ir.png" class="flag-icon" /> ایران
    </div>`;
    statusText = `<div class="text-orange-400 text-sm mt-2">🟠 شما در حال استفاده از سرویس ما نمی‌باشید</div>`;
  } else {
    ipSection = `
      <div class="text-lg mb-2 text-gray-300">آی‌پی: <span class="text-cyan-400">${networkInfo.ip}</span></div>
      <div class="text-lg mb-2 text-gray-300">
        <img src="${flagURL}" class="flag-icon" />
        کشور: ${networkInfo.country === 'IR' ? 'ایران' : networkInfo.country}
      </div>
    `;
    statusText = isCloudflare
      ? `<div class="text-green-400 text-sm mt-2">🟢 شما اکنون در حال استفاده از سرویس ما می‌باشید</div>`
      : `<div class="text-orange-400 text-sm mt-2">🟠 شما در حال استفاده از سرویس ما نمی‌باشید</div>`;
  }

  const jalali = window.jalaali.toJalaali(new Date());
  const gregorian = new Date().toLocaleDateString('fa-IR');

  app.innerHTML = `
    <div class="min-h-screen p-6 flex flex-col items-center space-y-8">
      <h1 class="text-3xl font-bold">داشبورد کاربر</h1>

      <!-- تاریخ -->
      <div class="card text-center">
        <div>تاریخ شمسی: ${jalali.jy}/${jalali.jm}/${jalali.jd}</div>
        <div>تاریخ میلادی: ${gregorian}</div>
      </div>

      <!-- ردیف اول -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <div class="card text-center">
          <h2 class="text-xl font-bold mb-4">مانده اعتبار</h2>
          <div class="circle-progress">
            <svg width="120" height="120">
              <circle class="bg" cx="60" cy="60" r="50" />
              <circle class="progress" cx="60" cy="60" r="50" />
            </svg>
            <div class="percent-text" id="credit-percent">85%</div>
          </div>
          <p class="mt-2">از حجم سرویس شما باقی‌مانده است.</p>
        </div>

        <div class="card text-center">
          <h2 class="text-xl font-bold mb-4">اطلاعات شبکه</h2>
          ${ipSection}
          ${networkInfo.ip && networkInfo.isp ? `<div class="text-lg mb-2 text-gray-300">شرکت اینترنت: <span class="text-cyan-400">${networkInfo.isp}</span></div>` : ''}
          ${statusText}
        </div>
      </div>

      <!-- تست سرعت -->
      <div class="w-full max-w-2xl">
        <div class="card text-center">
          <h2 class="text-xl font-bold mb-4">تست سرعت اینترنت</h2>
          <iframe src="https://fast.com" class="w-full h-80 rounded" style="border: none;"></iframe>
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
    getUserNetworkInfo().then(renderDashboard);
  } else {
    alert('نام کاربری یا رمز عبور اشتباه است.');
  }
}

function logout() {
  loggedIn = false;
  renderLogin();
}

renderLogin();

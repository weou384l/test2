document.body.className = 'login-background';

let loggedIn = false;

async function getUserNetworkInfo() {
  try {
    const response = await fetch('https://ipinfo.io/json?token=8824fa830e1d01');
    const data = await response.json();
    return {
      ip: data.ip,
      isp: data.org,
      countryCode: data.country
    };
  } catch (error) {
    return {
      ip: 'IR',
      isp: null,
      countryCode: 'IR'
    };
  }
}

function getFlagEmoji(countryCode) {
  if (!countryCode) return '';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
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
  const isIPUnavailable = !networkInfo.isp || !networkInfo.ip || networkInfo.ip === 'IR';
  const flag = getFlagEmoji(networkInfo.countryCode);

  let ipInfoHTML = '';
  if (isIPUnavailable) {
    ipInfoHTML = `
      <div class="text-lg mb-2 text-gray-300">آی‌پی: <span class="text-cyan-400">ایران ${flag}</span></div>
      <div class="text-orange-400 text-sm">🟠 شما در حال استفاده از سرویس ما نمی‌باشید</div>
    `;
  } else if (isCloudflare) {
    ipInfoHTML = `
      <div class="text-lg mb-2 text-gray-300">آی‌پی: <span class="text-cyan-400">${networkInfo.ip} ${flag}</span></div>
      <div class="text-green-400 text-sm">🟢 شما اکنون در حال استفاده از سرویس ما می‌باشید</div>
    `;
  } else {
    ipInfoHTML = `
      <div class="text-lg mb-2 text-gray-300">آی‌پی: <span class="text-cyan-400">${networkInfo.ip} ${flag}</span></div>
      <div class="text-orange-400 text-sm">🟠 شما در حال استفاده از سرویس ما نمی‌باشید</div>
    `;
  }

  app.innerHTML = `
    <div class="min-h-screen p-6 flex flex-col items-center space-y-8">
      <h1 class="text-3xl font-bold">داشبورد کاربر</h1>

      <!-- ردیف اول -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <div class="card text-center">
          <h2 class="text-xl font-bold mb-4">مانده اعتبار</h2>
          <div class="relative w-32 h-32 mx-auto">
            <svg class="circle-progress" width="100%" height="100%">
              <circle cx="50%" cy="50%" r="48" stroke="#1e293b" stroke-width="10" fill="none" />
              <circle class="progress" cx="50%" cy="50%" r="48" stroke="#00c2ff" stroke-width="10" fill="none"
                stroke-linecap="round" transform="rotate(-90,64,64)" />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center text-2xl font-bold text-cyan-400" id="credit-percent">85%</div>
          </div>
          <p class="mt-2 text-sm text-gray-400">از حجم سرویس شما باقی‌مانده است.</p>
        </div>

        <div class="card text-center">
          <h2 class="text-xl font-bold mb-4">اطلاعات شبکه</h2>
          ${ipInfoHTML}
        </div>
      </div>

      <!-- امنیت اتصال -->
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
          <div id="speed-result" class="mb-4 text-lg text-gray-300">برای شروع، دکمه زیر را بزنید.</div>
          <button onclick="testSpeed()" class="py-2 px-6 bg-green-600 rounded hover:bg-green-700 transition">شروع تست</button>
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

function testSpeed() {
  const result = document.getElementById('speed-result');
  result.innerText = "در حال تست...";
  setTimeout(() => {
    const download = (Math.random() * 50 + 10).toFixed(2);
    const upload = (Math.random() * 10 + 1).toFixed(2);
    result.innerHTML = `
      سرعت دانلود: <span class="text-cyan-400">${download} Mbps</span><br/>
      سرعت آپلود: <span class="text-cyan-400">${upload} Mbps</span>
    `;
  }, 2000);
}

renderLogin();

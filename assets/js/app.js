document.body.className = 'login-background';
let loggedIn = false;

async function getUserNetworkInfo() {
  try {
    const response = await fetch('https://ipinfo.io/json?token=8824fa830e1d01');
    const data = await response.json();

    return {
      ip: data.ip,
      isp: data.org || null,
      country: data.country || 'IR'
    };
  } catch {
    return {
      ip: 'نامشخص',
      isp: null,
      country: 'IR'
    };
  }
}

function renderLogin() {
  app.innerHTML = `
    <div class="flex items-center justify-center min-h-screen px-4">
      <div class="bg-gray-900 p-8 rounded-2xl shadow-2xl max-w-sm w-full backdrop-blur">
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
  const isCloudflare = networkInfo.isp && networkInfo.isp.toLowerCase().includes("cloudflare");

  app.innerHTML = `
    <div class="min-h-screen p-6 flex flex-col items-center space-y-8">
      <h1 class="text-3xl font-bold">پنل کاربری</h1>

      <!-- مانده اعتبار -->
      <div class="card text-center">
        <h2 class="text-xl font-bold mb-4">مانده اعتبار</h2>
        <div class="circle-progress">
          <svg>
            <circle class="background" r="50" cx="60" cy="60" />
            <circle class="progress" r="50" cx="60" cy="60" />
          </svg>
          <div id="credit-percent" class="center-text">85%</div>
        </div>
        <p class="mt-2">از حجم سرویس شما باقی‌مانده است.</p>
      </div>

      <!-- اطلاعات شبکه -->
      <div class="card text-center">
        <h2 class="text-xl font-bold mb-4">اطلاعات شبکه</h2>
        <div class="text-lg mb-2 text-gray-300">آی‌پی: 
          <span class="text-cyan-400">${networkInfo.ip}</span>
          <img src="https://flagcdn.com/24x18/${networkInfo.country.toLowerCase()}.png" class="inline ml-2" />
        </div>
        ${
          networkInfo.isp
            ? `<div class="text-lg mb-2 text-gray-300">شرکت اینترنت: <span class="text-cyan-400">${networkInfo.isp}</span></div>`
            : ''
        }
        ${
          networkInfo.isp
            ? (isCloudflare
              ? `<div class="text-green-400 mt-2">شما اکنون در حال استفاده از سرویس ما می‌باشید.</div>`
              : `<div class="text-yellow-400 mt-2">شما در حال استفاده از سرویس ما نمی‌باشید.</div>`)
            : ''
        }
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
  result.innerHTML = `در حال دریافت نتیجه... لطفاً صبر کنید.`;

  const iframe = document.createElement('iframe');
  iframe.src = "https://fast.com";
  iframe.style.display = "none";
  document.body.appendChild(iframe);

  setTimeout(() => {
    result.innerHTML = `
      <span class="text-cyan-400">نتیجه تست با Fast.com انجام شد (برای مشاهده دقیق‌تر به <a href="https://fast.com" target="_blank" class="underline">سایت</a> مراجعه کنید)</span>
    `;
    iframe.remove();
  }, 5000);
}

renderLogin();

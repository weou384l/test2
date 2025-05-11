document.body.className = 'login-background';

let loggedIn = false;

async function getUserNetworkInfo() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch('https://ipinfo.io/json?token=8824fa830e1d01', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const data = await response.json();
    return {
      ip: data.ip,
      isp: data.org
    };
  } catch (error) {
    console.warn('خطا در دریافت اطلاعات شبکه:', error);
    return {
      ip: '🇮🇷 ایران',
      isp: 'نامشخص'
    };
  }
}

function renderLogin() {
  app.innerHTML = `
    <div class="flex items-center justify-center min-h-screen px-4">
      <div class="bg-gray-900 p-8 rounded-2xl shadow-2xl max-w-sm w-full backdrop-blur-sm bg-opacity-70">
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

  const isCloudflare = networkInfo.isp.toLowerCase().includes('cloudflare');
  const ispNote = isCloudflare
    ? `<p class="text-green-400 mt-2">شما اکنون در حال استفاده از سرویس ما می‌باشید.</p>`
    : `<p class="text-yellow-400 mt-2">شما در حال استفاده از سرویس ما نمی‌باشید.</p>`;

  app.innerHTML = `
    <div class="min-h-screen p-6 flex flex-col items-center space-y-8">
      <h1 class="text-3xl font-bold">داشبورد کاربر</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <div class="card text-center">
          <h2 class="text-xl font-bold mb-4">مانده اعتبار</h2>
          <div class="circle-progress mx-auto mb-2">
            <svg width="120" height="120">
              <circle cx="60" cy="60" r="50" stroke="#2d3748" stroke-width="10" fill="none"/>
              <circle class="progress" cx="60" cy="60" r="50" stroke="#00c2ff" stroke-width="10" fill="none" stroke-linecap="round"/>
            </svg>
            <div id="credit-percent" class="text-2xl font-bold text-cyan-400 mt-2">0%</div>
          </div>
          <p>از حجم سرویس شما باقی‌مانده است.</p>
        </div>

        <div class="card text-center">
          <h2 class="text-xl font-bold mb-4">اطلاعات شبکه</h2>
          <div class="text-lg mb-2 text-gray-300">آی‌پی / کشور: <span class="text-cyan-400">${networkInfo.ip}</span></div>
          <div class="text-lg mb-2 text-gray-300">شرکت اینترنت: <span class="text-cyan-400">${networkInfo.isp}</span></div>
          ${ispNote}
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
          <h2 class="text-xl font-bold mb-4">تست سرعت اینترنت</h2>
          <div id="speed-result" class="mb-4 text-lg text-gray-300">برای شروع، دکمه زیر را بزنید.</div>
          <button onclick="testSpeed()" class="py-2 px-6 bg-green-600 rounded hover:bg-green-700 transition">شروع تست</button>
        </div>
      </div>

      <button onclick="logout()" class="mt-8 py-2 px-4 bg-red-600 rounded hover:bg-red-700 transition">خروج</button>
    </div>
  `;

  updateCreditCircle(85); // برای مانده اعتبار
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

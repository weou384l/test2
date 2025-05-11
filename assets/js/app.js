document.body.className = 'login-background';

let loggedIn = false;

async function getUserNetworkInfo() {
  try {
    const response = await fetch('https://ipinfo.io/json?token=8824fa830e1d01');
    const data = await response.json();

    const isCloudflare = data.org && data.org.toLowerCase().includes("cloudflare");
    return {
      ip: data.ip,
      isp: isCloudflare ? "Cloudflare" : data.org,
      countryCode: data.country,
      isCloudflare: isCloudflare
    };
  } catch (error) {
    return {
      ip: "ایران",
      isp: null,
      countryCode: "IR",
      isCloudflare: false
    };
  }
}

function renderLogin() {
  app.innerHTML = `
    <div class="flex items-center justify-center min-h-screen px-4">
      <div class="bg-gray-900 bg-opacity-80 p-8 rounded-2xl shadow-2xl max-w-sm w-full">
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
        <div class="card text-center">
          <h2 class="text-xl font-bold mb-4">مانده اعتبار</h2>
          <div class="circle-progress">
            <svg width="120" height="120">
              <circle class="bg" cx="60" cy="60" r="50" />
              <circle class="progress" cx="60" cy="60" r="50" />
            </svg>
            <div class="text" id="credit-percent">85%</div>
          </div>
        </div>

        <div class="card text-center">
          <h2 class="text-xl font-bold mb-4">اطلاعات شبکه</h2>
          <div class="text-lg mb-2 text-gray-300">
            آی‌پی: <span class="text-cyan-400">${networkInfo.ip}</span>
            <img src="https://flagcdn.com/24x18/${networkInfo.countryCode.toLowerCase()}.png" class="inline ml-2" />
          </div>
          ${
            networkInfo.isp
              ? `<div class="text-lg mb-2 text-gray-300">شرکت اینترنت: <span class="text-cyan-400">${networkInfo.isp}</span></div>`
              : ''
          }
          <div class="text-md font-bold mt-2 ${
            networkInfo.isCloudflare ? 'text-green-400' : 'text-yellow-400'
          }">
            ${
              networkInfo.isCloudflare
                ? 'شما اکنون در حال استفاده از سرویس ما می‌باشید.'
                : 'شما در حال استفاده از سرویس ما نمی‌باشید.'
            }
          </div>
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
          <button onclick="startSpeedTest()" class="py-2 px-6 bg-green-600 rounded hover:bg-green-700 transition">شروع تست</button>
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

function startSpeedTest() {
  const result = document.getElementById("speed-result");
  result.innerText = "در حال تست با سرور Speedtest...";

  const test = new SpeedtestNet({
    maxTime: 10000
  });

  test.onupdate = data => {
    result.innerHTML = `در حال تست...<br/>دانلود: ${data.download} Mbps<br/>آپلود: ${data.upload} Mbps`;
  };

  test.onend = data => {
    result.innerHTML = `
      ✅ تست کامل شد:<br/>
      سرعت دانلود: <span class="text-cyan-400">${data.download} Mbps</span><br/>
      سرعت آپلود: <span class="text-cyan-400">${data.upload} Mbps</span>
    `;
  };

  test.start();
}

renderLogin();

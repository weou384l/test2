const app = document.getElementById('app');

let loggedIn = false;

async function getUserNetworkInfo() {
  const response = await fetch('https://ipinfo.io/json?token=at_mz4G3v9KWtTYdEXAMPLE');
  const data = await response.json();
  return {
    ip: data.ip,
    isp: data.org
  };
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
  app.innerHTML = `
    <div class="min-h-screen p-6 flex flex-col items-center justify-center space-y-8">
      <h1 class="text-3xl font-bold">داشبورد کاربر</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        <div class="card text-center">
          <h2 class="text-xl font-bold mb-4">مانده اعتبار</h2>
          <div class="text-4xl font-bold text-cyan-400 mb-2">85%</div>
          <p>از حجم سرویس شما باقی‌مانده است.</p>
        </div>
        <div class="card text-center">
          <h2 class="text-xl font-bold mb-4">اطلاعات شبکه</h2>
          <div class="text-lg mb-2 text-gray-300">آی‌پی: <span class="text-cyan-400">${networkInfo.ip}</span></div>
          <div class="text-lg mb-2 text-gray-300">شرکت ارائه‌دهنده اینترنت: <span class="text-cyan-400">${networkInfo.isp}</span></div>
          <button onclick="testSpeed()" class="mt-4 py-2 px-4 bg-green-600 rounded hover:bg-green-700 transition">شروع تست</button>
        </div>
      </div>
      <button onclick="logout()" class="mt-8 py-2 px-4 bg-red-600 rounded hover:bg-red-700 transition">خروج</button>
    </div>
  `;
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

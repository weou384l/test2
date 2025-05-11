const app = document.getElementById('app');

let loggedIn = false;

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

function renderDashboard() {
    app.innerHTML = `
    <div class="min-h-screen p-6 bg-black flex flex-col items-center justify-center">
        <h1 class="text-3xl mb-6 font-bold">داشبورد کاربر</h1>
        <div class="w-64 h-64 relative mb-6">
            <svg class="absolute top-0 left-0 w-full h-full">
                <circle cx="50%" cy="50%" r="90" stroke="#333" stroke-width="20" fill="none"/>
                <circle cx="50%" cy="50%" r="90" stroke="#00c2ff" stroke-width="20" fill="none"
                    stroke-dasharray="565.48" stroke-dashoffset="84.82" stroke-linecap="round"
                    transform="rotate(-90, 128, 128)"/>
            </svg>
            <div class="absolute w-full h-full flex items-center justify-center text-2xl font-bold">85%</div>
        </div>
        <p class="mb-6">مانده اعتبار سرویس شما</p>
        <button onclick="logout()" class="py-2 px-4 bg-red-600 rounded hover:bg-red-700 transition">خروج</button>
    </div>
    `;
}

function handleLogin() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    if (user === 'admin' && pass === '1234') {
        loggedIn = true;
        renderDashboard();
    } else {
        alert('نام کاربری یا رمز عبور اشتباه است.');
    }
}

function logout() {
    loggedIn = false;
    renderLogin();
}

renderLogin();

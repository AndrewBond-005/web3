const themeTag = document.getElementById('themeTag');
document.addEventListener('DOMContentLoaded', function () {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateButtonText(savedTheme);

    }
});
themeTag.addEventListener('click', function () {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = (currentTheme === 'dark') ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateButtonText(newTheme);
});

function updateButtonText(theme) {
    themeTag.innerHTML = theme === 'dark' ? '☀️' : '🌙';
}
document.addEventListener('DOMContentLoaded', startTimer);
function startTimer() {
    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('ru-RU');
        const dateString = now.toLocaleDateString('ru-RU');
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.textContent = `${dateString} ${timeString}`;
        }
    }
    updateTime();
    setInterval(updateTime, 11*1000);
}


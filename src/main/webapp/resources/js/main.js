import {addResults, clearTable} from './table.js';
import {
    addPoint,
    clearArea,
    clearPoints,
    drawArea,
    drawLabel,
    drawPoint,
    getXYR,
    redrawArea,
    setTheme
} from './area.js';
import {validateX} from "./validation.js";

const form = document.getElementById('controlForm');
const hiddenForm = document.getElementById('hiddenForm');
const clearButton = document.getElementById('clearButton');
const errorTag = document.getElementById('errorMessage');
const themeTag = document.getElementById('themeTag');
const xSlider = document.getElementById('xSlider');
const yInput = document.getElementById('yInput');
const ElemR = document.getElementById('rRadio');
const submitButton = document.getElementById('submitButton');
const table = document.getElementById("resultTable");

const clickX = document.getElementById('clickX');
const clickY = document.getElementById('clickY');
const clickR = document.getElementById('clickR');
const submitClick = document.getElementById('submitClick'); // скрытая кнопка
var R = null;
document.addEventListener("DOMContentLoaded", () => {
    drawArea();
    updateSubmitButton(false);
    yInput.value = "-5";
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(button => {
        button.addEventListener('change', () => {
            const Rnew = parseFloat(button.value);
            if (Rnew !== R) {
                R = Rnew;
                redrawArea(R);
                const xVal = xSlider ? xSlider.value : "";
                if (xVal.trim() === "") {
                    showError("Выберите X");
                } else {
                    validateX(xVal) ? hideError() : null;
                    updateSubmitButton(validateX(xVal));
                }
            }
        });
    });
});
function updateSubmitButton(ok) {
    submitButton.disabled = !ok;
    submitButton.style.opacity = ok ? '1' : '0.5';
}
document.addEventListener("DOMContentLoaded", () => {
    const table = document.getElementById('resultTable');
    const tableBody = table.getElementsByTagName('tbody');
    if (tableBody.length > 0) {
        const rows = tableBody[0].getElementsByTagName('tr');
        for (let row of rows) {
            const cells = row.getElementsByTagName('td');
            const x = parseFloat(cells[0].textContent);
            const y = parseFloat(cells[1].textContent);
            const r = parseInt(cells[2].textContent);
            const isHit = cells[3].textContent.trim() === 'попал';
            if (!isNaN(x) && !isNaN(y) && !isNaN(r)) {
                addPoint(x, y, r, isHit.toString());
                if (R == null) {
                    R = r;
                    ElemR.value = r;
                }
            }
        }
        if (R == null) {
            drawLabel("R");
        } else {
            drawLabel(R);
        }
    }
});
canvas.addEventListener('click', async function (event) {
    try {
        if (isNaN(Number(R)) || R == null) {
            Error("Нельзя ставить точку без точного R");
            return;
        }
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const [x0, y0, r0] = getXYR();
        const x1 = (x - x0) * R / r0;
        const y1 = (y0 - y) * R / r0;
        clickX.value = x1;
        clickY.value = y1;
        clickR.value = R;
        submitClick.click();
    } catch (error) {
        Error(error.message);
    }
});
yInput.addEventListener('input', function () {
    try {
        if (validateX(yInput.value)) {
            if (ElemR.value !== "") {
                updateSubmitButton(true);
            } else {
                new Error("Введите R");
            }
            hideError();
        }
    } catch (e) {
        showError(e.message);
        updateSubmitButton(false);
    }
});
clearButton.addEventListener('click', function (event) {
    clearTable();
    clearPoints();
    clearArea();
    drawArea();
    drawLabel(R === null ? "R" : R);
});
function handleAjax(data) {
    try {
        if (data.status === "success") {
            var firstRow = table.rows[0];
            drawPoint(firstRow.cells[0].textContent,
                firstRow.cells[1].textContent,
                firstRow.cells[2].textContent,
                firstRow.cells[3].textContent)
        }
    } catch (e) {
        Error(e.message);
    }
}


function Error(message) {
    showError(message)
    setTimeout(() => {
        hideError()
    }, 3000);
}
function showError(message) {
    errorTag.textContent = "Ошибка: " + message;
    errorTag.style.display = "inline";
}
function hideError() {
    errorTag.textContent = "";
    errorTag.style.display = "none";
}


document.addEventListener('DOMContentLoaded', function () {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateButtonText(savedTheme);
        setTheme(savedTheme);
        redrawArea(R == null ? "R" : R);
    }
});
themeTag.addEventListener('click', function () {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = (currentTheme === 'dark') ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateButtonText(newTheme);
    setTheme(newTheme);
    redrawArea(R == null ? "R" : R);
});
function updateButtonText(theme) {
    themeTag.innerHTML = theme === 'dark' ? '☀️' : '🌙';
}


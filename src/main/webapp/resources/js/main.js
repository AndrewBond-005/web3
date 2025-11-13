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
import {validateX, validateY} from "./validation.js";
const form = document.getElementById('controlForm');
const hiddenForm = document.getElementById('hiddenForm');
const clearButton = document.getElementById('controlForm:clearButton');
const errorTag = document.getElementById('controlForm:errorMessage');
const themeTag = document.getElementById('themeTag');
const xSlider = document.getElementById('controlForm:xSlider');
const yInput = document.getElementById('controlForm:yInput');
const rRadioGroupId = 'controlForm:rRadio';
const submitButton = document.getElementById('controlForm:submitButton');
const table = document.getElementById('resultsForm:resultTable');
const clickX = document.getElementById('hiddenForm:clickX');
const clickY = document.getElementById('hiddenForm:clickY');
const clickR = document.getElementById('hiddenForm:clickR');
const submitClick = document.getElementById('hiddenForm:submitClick');
const canvas = document.getElementById('canvas');
var R = 3;

document.addEventListener("DOMContentLoaded", () => {
    drawArea();
    updateSubmitButton(false);
    yInput.value = "-5";
    const radioButtons = document.querySelectorAll(`input[name="${rRadioGroupId}"]`);
    radioButtons.forEach(button => {
        button.addEventListener('change', () => {
            const Rnew = parseFloat(button.value);
            if (Rnew !== R) {
                R = Rnew;
                redrawArea(R);
                const sliderInput = xSlider;
                const xVal = sliderInput ? sliderInput.value : "";
                if (!xVal || xVal.trim() === "") {
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
    const tableBody = table.querySelector('tbody');
    if (tableBody) {
        const rows = tableBody.getElementsByTagName('tr');
        for (let row of rows) {
            const cells = row.getElementsByTagName('td');
            if (cells.length >= 6) {
                const x = parseFloat(cells[0].textContent.trim());
                const y = parseFloat(cells[1].textContent.trim());
                const r = parseInt(cells[2].textContent.trim());
                const isHit = cells[3].textContent.trim() === 'попал';
                if (!isNaN(x) && !isNaN(y) && !isNaN(r)) {
                    addPoint(x, y, r, isHit.toString());
                    if (R == null) {
                        R = r;
                        setSelectedR(r);
                    }
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
function getSelectedR() {
    const selected = document.querySelector(`input[name="${rRadioGroupId}"]:checked`);
    return selected ? parseFloat(selected.value) : null;
}

function setSelectedR(r) {
    const radio = document.querySelector(`input[name="${rRadioGroupId}"][value="${r}"]`);
    if (radio) {
        radio.checked = true;
    }
}
canvas.addEventListener('click', async function (event) {
    try {
        if (isNaN(Number(R)) || R == null) {
            showTempError("Нельзя ставить точку без точного R");
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
        showTempError(error.message);
    }
});

yInput.addEventListener('input', function () {
    try {
        if (validateY(yInput.value)) {
            if (getSelectedR() !== null) {
                updateSubmitButton(true);
            } else {
                throw new Error("Введите R");
            }
            hideError();
        }
    } catch (e) {
        showError(e.message);
        updateSubmitButton(false);
    }
});

clearButton.addEventListener('click', function (event) {
    clearPoints();
});

jsf.ajax.addOnEvent(function (data) {
    if (data.status === "complete") {
        redrawArea(R);
        try {
            setTimeout(() => {
                const jsonField = document.getElementById('hiddenForm:pointData');
                if (jsonField != null && jsonField.textContent != null) {
                    const point = JSON.parse(jsonField.textContent);
                    if (point) {
                        addPoint(point.x, point.y, point.r, point.hit.toString());
                        drawPoint(point.x, point.y, point.r, point.hit.toString());
                    }
                }
            }, 200);
        } catch (e) {
            showTempError(e.message);
        }
    }
});

function showTempError(message) {
    showError(message);
    setTimeout(() => {
        hideError();
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
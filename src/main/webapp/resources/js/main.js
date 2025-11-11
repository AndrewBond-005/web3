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

const form = document.getElementById('inputForm');
const clearButton = document.getElementById('clearButton');
const errorTag = document.getElementById('errorMessage');
const errorCell = document.getElementById('errorCell');
const themeTag = document.getElementById('themeTag');
const xInput = document.getElementById('x');
const yForm = document.getElementById('yform');
const yInput = document.getElementById('y');
const ElemR = document.getElementById('r-hidden');
const clearParam = document.getElementById('clear');
const submitButton = document.querySelector('input[type="submit"]');
const table = document.getElementById("resultTable");
var R = null;
drawArea();
clearParam.value = "false";
updateSubmitButton(false);
yInput.value = -5;
document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll('.r-button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(otherButton => {
                otherButton.classList.remove('pressed');
            });
            button.classList.add('pressed');
            let Rnew = parseFloat(button.value);
            if (Rnew != R) {
                R = Rnew;
                ElemR.value = Rnew;
                redrawArea(R);
                if (xInput.value.trim() === "") {
                    showError("Введите x");
                } else {
                    validateX(xInput.value) ? hideError() : null;
                    updateSubmitButton(validateX(xInput.value));
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
            document.getElementById("r" + R).click();
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
        await processPoint(x1, y1, R, false);
    } catch (error) {
        Error(error.message);
    }
});

function processPoint(x, y, r, clear) {
    const input = {
        x: x,
        y: y,
        r: r,
        clear: clear || false
    };
    let answer = send(input);
}

async function send(input) {
    try {
        xInput.value = input.x;
        yInput.value = input.y;
        ElemR.value = input.r;
        clearParam.value = input.clear;
        form.submit();
    } catch (error) {
        Error(error.message);
    }
    return null;
}

function onAjaxComplete(data) {
    if (data.status === 'success') {
        const newPointEl = document.getElementById('newPointJson');
        if (newPointEl && newPointEl.textContent) {
            try {
                const point = JSON.parse(newPointEl.textContent);
                addPoint(point.x, point.y, point.r, point.hit);
                drawPoint(point.x, point.y, point.r, point.hit);
                addResults(point.x, point.y, point.r, point.hit, null, null);
            } catch (e) {
                console.error("Ошибка парсинга JSON:", e);
            }
        }
    }
}

xInput.addEventListener('input', function () {
    try {
        function processAnswer(answer) {
            if (answer != null) {
                addPoint(answer.x, answer.y, answer.r, String(answer.isHit));
                drawPoint(answer.x, answer.y, answer.r, String(answer.isHit));
                addResults(answer);
            } else {
                Error("Сервер ответил пустой строкой");
            }
        }

        if (validateX(xInput.value)) {
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
yForm.addEventListener('input', function () {
    yInput.value = yForm.value;
});
clearButton.addEventListener('click', function (event) {
    event.preventDefault();
    send({clear: "true"});
    clearTable();
    clearArea();
    drawArea();
    drawLabel("R");
    clearPoints();
});

function Error(message) {
    showError(message)
    setTimeout(() => {
        hideError()
    }, 3000);
}

function showError(message) {
    errorTag.textContent = "Ошибка: " + message;
    errorTag.style.display = "inline";
    errorCell.style.display = "inline";
}

function hideError() {
    errorTag.textContent = "";
    errorTag.style.display = "none";
    errorCell.style.display = "none";
}


function handleAjax(data) {
    try{
    if (data.status === "success") {
        var firstRow = table.rows[0];
        drawPoint(firstRow.cells[0].textContent,
            firstRow.cells[1].textContent,
            firstRow.cells[2].textContent,
            firstRow.cells[3].textContent)
    }}catch (e) {
        Error(e.message);
    }
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

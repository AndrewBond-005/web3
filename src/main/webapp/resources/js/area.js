const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let x0 = canvas.width / 2;
let y0 = canvas.height / 2;
let r0 = x0 * 0.7;
let r1 = x0 * 0.7;
let R = 3;
let width = canvas.width;
let height = canvas.height;
let pi = Math.PI;
let points = [];
let dark = {
    shape: "#0f01caff",
    shapeBorder: "#007bffff",
    text: "#ffffffff",
    textBorder: "#000000ff",
    axis: "#c6c6c6ff",
    isHit: "#0ea800ff",
    noHit: "#9c0000ff",
    pointBorder: "#ffffffff"
};
let light = {
    shape: "#0f01caff",
    shapeBorder: "#070068ff",
    text: "#000000ff",
    textBorder: "#000000ff",
    axis: "#000000ff",
    isHit: "#0ea800ff",
    noHit: "#9c0000ff",
    pointBorder: "#000000ff"
};
let colors = light;
export function getXYR() {
    return [x0, y0, r0];
}
export function setTheme(theme) {
    if (theme === "dark")
        colors = dark;
    else
        colors = light;
}
export function redrawArea(r) {
    clearArea();
    setR(r)
    drawArea();
    drawLabel(r);
    drawPoints();
}
function setR(r) {
    r1 = r1 / R;
    R = r;
    r1 = r1 * R;
}
export function drawArea() {
    ctx.globalAlpha = 0.6;
    ctx.strokeStyle = colors.axis;
    ctx.lineWidth = 2;
    ctx.font = "15px Arial";
    ctx.clearRect(0, 0, width, height);

    //координатные оси
    ctx.beginPath();
    ctx.moveTo(0, x0);
    ctx.lineTo(height, x0);
    ctx.moveTo(y0, 0);
    ctx.lineTo(y0, width);
    ctx.stroke();

    //стрелки
    drawArrow(x0, 0, 10, pi / 6, pi / 2);
    drawArrow(width, y0, 10, pi / 6, 0);

    ctx.strokeStyle = colors.shapeBorder;
    ctx.lineWidth = 2;
    ctx.fillStyle = colors.shape;
//четверть круга
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.arc(x0, y0, r0,  pi/2, pi/1,false);
    ctx.lineTo(x0, y0);
    ctx.fill();
    ctx.stroke();

    //треугольник
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x0, y0 - r0 / 2);
    ctx.lineTo(x0 - r0, y0);
    ctx.lineTo(x0, y0);
    ctx.fill();
    ctx.stroke();

    //прямоугольник
    ctx.beginPath();
    ctx.fillRect(x0, y0, r0 / 2, -r0);
    ctx.strokeRect(x0, y0, r0 / 2, -r0)

    drawSticks();
}
function drawSticks() {
    ctx.globalAlpha = 1;
    ctx.strokeStyle = colors.axis;
    ctx.font = "12px Arial";
    let l = 3;
    for (let i = -2; i <= 2; i += 1) {
        if (i != 0) {
            drawArrow(x0 + r0 * i / 2, y0, l, pi / 2, 0);
        }
    }
    for (let i = -2; i <= 2; i += 1) {
        if (i != 0) {
            drawArrow(x0, y0 + r0 * i / 2, l, pi / 2, pi / 2);
        }
    }
}
function drawArrow(x, y, l, direction, angle) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - l * Math.cos(-angle - direction),
        y - l * Math.sin(-angle - direction));
    ctx.moveTo(x, y);
    ctx.lineTo(x - l * Math.cos(-angle + direction),
        y - l * Math.sin(-angle + direction));
    ctx.stroke();
}
export function drawLabel(n) {
    ctx.fillStyle = colors.text;
    if (isNaN(Number(n))) {
        for (let i = -2; i <= 2; i += 1) {
            if (i != 0) {
                ctx.fillText((i > 0 ? "" : "-") + n + (i % 2 != 0 ? "/2" : ""), x0 + r0 * i / 2, y0 - 10, 100);
            }
        }
        for (let i = -2; i <= 2; i += 1) {
            if (i != 0) {
                ctx.fillText((i < 0 ? "" : "-") + n + (i % 2 != 0 ? "/2" : ""), x0 + 10, y0 + r0 * i / 2, 100);
            }
        }
    }
    else {
        let margin = 10;
        for (let i = -2; i <= 2; i += 1) {
            if (i != 0) {
                ctx.fillText(n / 2 * i, x0 + r0 * i / 2, y0 - margin, 100);
            }
        }
        for (let i = -2; i <= 2; i += 1) {
            if (i != 0) {
                ctx.fillText(n / 2 * i, x0 + margin, y0 + r0 * i / 2, 100);
            }
        }
    }
}
export function addPoint(x, y, r, hit) {
    points.push({
        x: x,
        y: y,
        r: r,
        hit: hit
    });
}
export function drawPoint(x, y, r, hit) {

    ctx.beginPath();
    ctx.arc(x0 + x * r0 * r / (R*R) , y0 - y * r0 * r / (R*R), 4, 0, pi * 2);
    ctx.fillStyle = (hit == "true" ? colors.isHit : colors.noHit);
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.stroke();

}
function drawPoints() {
    points.forEach(point => {
        drawPoint(point.x, point.y, point.r, point.hit);
    });
}
export function getPoints() {
    return points;
}
export function clearPoints() {
    points = [];
}
export function clearArea() {
    ctx.clearRect(0, 0, width, height);
}

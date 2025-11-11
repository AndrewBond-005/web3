const ACCEPTABLE_Y = [-5, -4, -3, -2, -1, 0, 1, 2, 3];
const ACCEPTABLE_R = [1, 2, 3, 4, 5];
export function parseNumber(str) {
    const normalizedStr = str.toString().replace(',', '.');
    const numberRegex = /^-?\d+(\.\d+)?$/;
    if (!numberRegex.test(normalizedStr)) {
        throw new Error("Введено не число!");
    }
    const num = Number(normalizedStr);
    if (isNaN(num)) {
        throw new Error("Введено не число!");
    }
    return num;
}
export function validateInput(input) {
    return validatePoint(input.x,input.y,input.r);
}
export function validatePoint(x,y,r) {
    return validateX(x) && validateY(y)&& validateR(r);
}
export function validateX(x){
    if(x.trim() === ""){throw new Error("Введите x");}
    x = Number(parseNumber(x));
    if (isNaN(x)) throw new Error('Поле X должно быть числом от -5 до 5!');
    if (x < -5 || x > 5) throw new Error('Поле X должно быть числом от -5 до 5!');
    return true;
}
export function validateY(y){
    y = Number(parseNumber(y));
    if (isNaN(y)) throw new Error('Поле Y должно быть числом!');
    if (!ACCEPTABLE_Y.includes(y)) throw new Error('Недопустимое значение Y!');
    return true;
}
export function validateR(r){
    if(r==null){throw new Error("Введите R");}
    r = Number(parseNumber(r));
    if (isNaN(r)) throw new Error('Поле R должно быть числом!');
    if (!ACCEPTABLE_R.includes(r)) throw new Error('Недопустимое значение R!');
    return true;
}

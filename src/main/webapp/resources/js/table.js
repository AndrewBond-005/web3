const table = document.getElementById("resultTable");
export function addResults(results) {
    let k = -1;
    if (!Array.isArray(results)) {
        k = 1;
        results = [results];
    }
    results.forEach((result) => {
        const newRow = table.insertRow(k);
        const cellsData = [
            result.x?.toString() ?? '',
            result.y?.toString() ?? '',
            result.r?.toString() ?? '',
            result.isHit ? 'попал' : 'не попал',
            result.time ?? '',
            result.executionTime ?? '',
        ];
        cellsData.forEach((text, index) => {
            const cell = newRow.insertCell();
            cell.textContent = text;
            if (index === 3) { 
                cell.classList.add(result.isHit ? 'yes' : 'no');
            }
        });
    });
}
export function clearTable() {
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }
}
export function saveResults(answer, prevResults) {
    prevResults.unshift({
        x: answer.x,
        y: answer.y,
        r: answer.r,
        time: answer.time,
        executionTime: answer.executionTime / 1000,
        result: answer.result
    });
    localStorage.setItem('resultRow', JSON.stringify(prevResults));
}

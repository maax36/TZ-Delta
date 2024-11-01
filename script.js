"use strict";

/*Данный код написан очень очень на скорую руку так что как говорится не судите строго,
        если посидеть подумать может еще что то гениальное можно придумать*/

const thead = document.querySelector("thead tr");
const tbody = document.querySelector("tbody");

const head = ['Показатель', 'Текущий день', 'Вчера', 'Этот день недели'];
const data = [
    { indicator: 'Выручка руб', currentDay: 500521, Yesterday: { sum: 480521, percent: 4 }, thisDay: { sum: 4805121, percent: -1 } },
    { indicator: 'Наличные', currentDay: 300000, Yesterday: { sum: 300000, percent: 0 }, thisDay: { sum: 300000, percent: 0 } },
    { indicator: 'Безналичный расчет', currentDay: 100000, Yesterday: { sum: 100000, percent: 0 }, thisDay: { sum: 100000, percent: 0 } },
    { indicator: 'Кредитные карты', currentDay: 100521, Yesterday: { sum: 100521, percent: 0 }, thisDay: { sum: 100521, percent: 0 } },
    { indicator: 'Средний чек, руб', currentDay: 1300, Yesterday: { sum: 900, percent: 44 }, thisDay: { sum: 900, percent: 1 } },
    { indicator: 'Средний гость, руб', currentDay: 1200, Yesterday: { sum: 800, percent: 50 }, thisDay: { sum: 900, percent: 1 } },
    { indicator: 'Удаления из чека (после оплаты), руб', currentDay: 1000, Yesterday: { sum: 1100, percent: -9 }, thisDay: { sum: 900, percent: 1 } },
    { indicator: 'Удаления из чека (до оплаты), руб', currentDay: 1000, Yesterday: { sum: 1000, percent: 0 }, thisDay: { sum: 900, percent: 1 } },
    { indicator: 'Количество чеков', currentDay: 34, Yesterday: { sum: 36, percent: -6 }, thisDay: { sum: 34, percent: 0 } },
    { indicator: 'Количество гостей', currentDay: 34, Yesterday: { sum: 36, percent: -6 }, thisDay: { sum: 32, percent: 1 } }
];


head.forEach((title) => {
    const td = document.createElement("td");
    td.textContent = title;
    thead.append(td);
});

data.forEach(({ indicator, currentDay, Yesterday, thisDay }, index) => {
    const tr = document.createElement("tr");
    tr.setAttribute("data-id", index);
    const values = [indicator, currentDay, Yesterday, thisDay];

    values.forEach((value, index) => {
        const cell = index === 0 ? document.createElement("th") : document.createElement("td");

        if (index === 2 || index === 3) {
            const sumSpan = document.createElement("span");
            sumSpan.textContent = `${value.sum}`;

            const percentSpan = document.createElement("span");
            if (index === 2) { percentSpan.textContent = `${value.percent}%`; }

            if (value.percent > 0) {
                cell.classList.add('positive');
                percentSpan.classList.add('percentP');
            } else if (value.percent < 0) {
                cell.classList.add('negative');
                percentSpan.classList.add('percentN');
            }

            cell.append(sumSpan);
            if(index === 2) { cell.append(percentSpan); }
        } else {
            cell.textContent = value;
        }

        tr.append(cell);
    });

    tbody.append(tr);
});

document.addEventListener("click", (ev) => {
    const row = ev.target.closest("tr");
    if (!row) return;
    const dataID = row.getAttribute('data-id');

    if (row.nextElementSibling && row.nextElementSibling.classList.contains("chart-row")) {
        row.nextElementSibling.remove();
        return;
    }

    const chartRow = document.createElement("tr");
    chartRow.classList.add("chart-row");
    const chartCell = document.createElement("td");
    chartCell.colSpan = 4;
    const chartContainer = document.createElement("div");
    chartContainer.classList.add("chart-container");
    chartCell.append(chartContainer);
    chartRow.append(chartCell);
    row.after(chartRow);

    Highcharts.chart(chartContainer, {
        chart: {
            type: 'line'
        },
        title: {
            text: data[dataID].indicator
        },
        xAxis: {
            categories: ['Текущий день', 'Вчера', 'Этот день недели']
        },
        yAxis: {
            title: {
                text: 'Values'
            }
        },
        series: [{
            name: 'Values',
            data: [data[dataID].currentDay, data[dataID].Yesterday.sum, data[dataID].thisDay.sum]
        }]
    });
});
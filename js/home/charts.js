/*
Names: Lucas Leung
Student Numbers: 400582219
Date Created: April 2, 2025
Description: JS file to allow the chart of completed tasks to function, will also be updated when a user clicks complete
on a task
*/

let chart;

window.addEventListener("load", function () {
    const ctx = document.getElementById('chart');
    const savedData = JSON.parse(localStorage.getItem("chartData")) || [0, 0, 0, 0, 0, 0, 0];

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            datasets: [{
                label: 'Completed Tasks This Week',
                data: savedData,
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
});

function updateChart(dayIndex) {
    if (!chart) {
        return;
    }

    chart.data.datasets[0].data[dayIndex]++;
    chart.update();
    localStorage.setItem("chartData", JSON.stringify(chart.data.datasets[0].data));
}
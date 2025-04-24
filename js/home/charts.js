/*
Names: Raymond, Aiden, Lucas Leung
Student Numbers:
Date Created: April 2, 2025
Description: Studyflow, a productivity tool that helps students transitioning to university with managing their tasks.
Created by Raymond, Aiden, and Lucas for COMPSCI 1XD3 at McMaster University.
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
                    beginAtZero: true
                }
            }
        }
    });
});

function updateChart(dayIndex) {
    if (!chart) return;

    chart.data.datasets[0].data[dayIndex]++;
    chart.update();

    localStorage.setItem("chartData", JSON.stringify(chart.data.datasets[0].data));
}
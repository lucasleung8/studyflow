window.addEventListener("load", function (event) {

    // spawn the chart
    const ctx = document.getElementById('chart');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Completed Tasks This Week',
                data: [1, 3, 8, 4, 2, 0, 1],
                borderWidth: 1,
                fill: false
            }]
        }
    })
});
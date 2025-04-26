/*
Names: Lucas Leung
Student Numbers: 400582219
Date Created: April 2, 2025
Description: Javascript to allow the timer to function and be adjustable
*/

window.addEventListener("load", function (event) {
    let timer = document.getElementById('timer');
    const timerStart = document.getElementById('timerStart');
    const timerStop = document.getElementById('timerStop');
    const addTime = document.getElementById('addTime');
    const subtractTime = document.getElementById('subtractTime');
    const minutesTotal = document.getElementById('minutesTotal');
    let timerCompleteSound = new Audio("media/timerOver.wav");
    let minutes = 20;
    let seconds = 0;
    // User's set time before starting the timer
    let chosenMinutes = minutes;
    // Running total of how long the study session took, including adjustments
    let totalMinutes = minutes;
    let paused = false;
    let started = false;

    // Event handler to ask user if they actually want to leave mid-session
    const beforeUnloadHandler = (event) => {
        event.preventDefault();
        event.returnValue = true;
      };

    // Prevent duplicate beforeunload event handlers
    window.removeEventListener("beforeunload", beforeUnloadHandler);

    // Reads the stored total time studied from database on page load without actually affecting the total
    let url = "server/timer.php?totalMinutes=0";
    fetch(url)
        .then(response => response.text())
        .then(updateTotal)

    /**
     * Updates the total time studied label
     * 
     * @param {text} text 
     * @returns
     */
    function updateTotal(text) {
        minutesTotal.innerHTML = "Total Minutes Studied: " + text;
    }

    /**
     * Starts timer and keeps track of time
     * 
     * @param {}
     * @returns
     */
    function startTimer() {
        timer_interval = setInterval(function () {

            // Time is up, reset timer to the time that was initially set
            if (minutes === 0 && seconds === 0) {
                clearInterval(timer_interval);
                started = false;
                // Update and return total time on DB
                let url = "server/timer.php?totalMinutes=" + totalMinutes;
                fetch(url)
                    .then(response => response.text())
                    .then(updateTotal)
                minutes = chosenMinutes;
                totalMinutes = chosenMinutes;
                timer.innerHTML = minutes + ":" + "0" + seconds;
                timerStart.setAttribute("value", "Start");
                addTime.removeAttribute("disabled");
                subtractTime.removeAttribute("disabled");
                timerStop.style.display = "none";
                window.removeEventListener("beforeunload", beforeUnloadHandler);
                timerCompleteSound.play();
                return;
            }

            if (minutes !== 0 && seconds === 0) {
                minutes -= 1;
                seconds = 59;
            }

            // Display time
            if (seconds.toString().length === 1) {
                timer.innerHTML = minutes + ":" + "0" + seconds;
            } else {
                timer.innerHTML = minutes + ":" + seconds;
            }

            seconds -= 1;

        }, 1000)
    }

    addTime.addEventListener("click", function (event) {
        if (started === false && minutes <= 120) {
            minutes += 1;
            chosenMinutes = minutes;
            timer.innerHTML = minutes + ":" + "0" + seconds;
        } else if (started && minutes < 120) {
            minutes += 1;
            totalMinutes += 1;
            // Display seconds properly without visual glitch
            if (seconds.toString().length === 1) {
                timer.innerHTML = minutes + ":" + "0" + seconds;
            } else {
                timer.innerHTML = minutes + ":" + seconds;
            }
        }

        // Provide user feedback for timer buttons
        if (minutes >= 120){
            addTime.setAttribute("disabled", "");
            subtractTime.removeAttribute("disabled");
        } else if (minutes <= 1){
            subtractTime.setAttribute("disabled", "");
            addTime.removeAttribute("disabled");
        } else {
            addTime.removeAttribute("disabled");
            subtractTime.removeAttribute("disabled");
        }
    });

    subtractTime.addEventListener("click", function (event) {
        if (started === false && minutes > 1) {
            minutes -= 1;
            chosenMinutes = minutes;
            timer.innerHTML = minutes + ":" + "0" + seconds;
        } else if (started && minutes > 1){
            minutes -= 1;
            totalMinutes -= 1;
            // Display seconds properly without visual glitch
            if (seconds.toString().length === 1) {
                timer.innerHTML = minutes + ":" + "0" + seconds;
            } else {
                timer.innerHTML = minutes + ":" + seconds;
            }
        }

        // Provide user feedback for timer buttons
        if (minutes >= 120){
            addTime.setAttribute("disabled", "");
            subtractTime.removeAttribute("disabled");
        } else if (minutes <= 1){
            subtractTime.setAttribute("disabled", "");
            addTime.removeAttribute("disabled");
        } else {
            addTime.removeAttribute("disabled");
            subtractTime.removeAttribute("disabled");
        }
        
    });

    // Functionality for Start/Pause button
    timerStart.addEventListener("click", function (event) {
        // User unpauses timer
        if (paused) {
            startTimer();
            paused = false;
            timerStart.setAttribute("value", "Pause");
        // User pauses timer after starting it
        } else if (paused === false && started === true) {
            clearInterval(timer_interval);
            paused = true;
            timerStart.setAttribute("value", "Start");
        }

        // User starts timer for first time
        if (started === false) {
            started = true;
            totalMinutes = chosenMinutes;
            timerStart.setAttribute("value", "Pause");
            timerStop.style.display = "block";
            window.addEventListener("beforeunload", beforeUnloadHandler);
            startTimer();
        }
    });

    // Reset time when user presses stop
    timerStop.addEventListener("click", function(event) {
        if (started) {
            minutes = 0;
            seconds = 0;
            totalMinutes = 0;
        }
    });
});
/*
Names: Raymond, Aiden, Lucas Leung
Student Numbers:
Date Created: April 2, 2025
Description: Studyflow, a productivity tool that helps students transitioning to university with managing their tasks.
Created by Raymond, Aiden, and Lucas for COMPSCI 1XD3 at McMaster University.
*/

window.addEventListener("load", function (event) {
    // Declare timer variables
    let timer = document.getElementById('timer');
    const timerStart = document.getElementById('timerStart');
    const addTime = document.getElementById('addTime');
    const subtractTime = document.getElementById('subtractTime');
    const minutesTotal = document.getElementById('minutesTotal');
    let timerCompleteSound = new Audio("media/timerOver.wav");
    let minutes = 20;
    let seconds = 0;
    // time the user chooses before starting the timer
    let chosenMinutes = minutes;
    // running total of how long the study session took, including adjustments
    let totalMinutes = minutes;
    let paused = false;
    let started = false;
    let buttonFeedback;

    // reads the stored total time studied from database on page load
    let url = "server/timer.php?totalMinutes=";
    fetch(url)
        .then(response => response.text())
        .then(retrieveTotal)

    // updates the total time studied counter
    function updateTotal(text) {
        minutesTotal.innerHTML = "Total Minutes Studied: " + text;
    }

    // only reads the total time from DB, used on page load
    function retrieveTotal(text) {
        minutesTotal.innerHTML = "Total Minutes Studied: " + text;
    }

    /**
     * Starts timer and keeps track of time
     * 
     * @param {}
     * @returns
     */
    function start_timer() {
        timer_interval = setInterval(function () {

            // time is up, reset timer to previously selected time and offer feedback
            if (minutes === 0 && seconds === 0) {
                clearInterval(timer_interval);
                started = false;
                // fetch
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
                timerCompleteSound.play();
                return;
            }

            if (minutes !== 0 && seconds === 0) {
                minutes -= 1;
                seconds = 59;
            }

            // display time
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
            // display new time
            if (seconds.toString().length === 1) {
                timer.innerHTML = minutes + ":" + "0" + seconds;
            } else {
                timer.innerHTML = minutes + ":" + seconds;
            }
        }

        // user feedback
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
            // display new time
            if (seconds.toString().length === 1) {
                timer.innerHTML = minutes + ":" + "0" + seconds;
            } else {
                timer.innerHTML = minutes + ":" + seconds;
            }
        }

        // user feedback
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

    // Functionality for the Start/Pause button
    timerStart.addEventListener("click", function (event) {
        // user unpauses timer
        if (paused) {
            start_timer();
            paused = false;
            timerStart.setAttribute("value", "Pause");
            // user pauses timer after starting it
        } else if (paused === false && started === true) {
            clearInterval(timer_interval);
            paused = true;
            timerStart.setAttribute("value", "Start");
        }

        // user starts timer for first time
        if (started === false) {
            started = true;
            totalMinutes = chosenMinutes;
            timerStart.setAttribute("value", "Pause");
            start_timer();
        }

    });
});
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
    let timerStart = document.getElementById('timerStart');
    let addTime = document.getElementById('addTime');
    let subtractTime = document.getElementById('subtractTime');
    let minutes = 20;
    let seconds = 0;
    let selectedMinutes = minutes;
    let paused = false;
    let started = false;

    /**
     * Starts timer and keeps track of time
     * 
     * @param {}
     * @returns
     */
    function start_timer(){
        timer_interval = setInterval(function () {

            if (minutes === 0 && seconds === 0) {
                clearInterval(timer_interval);
                started = false;
                minutes = selectedMinutes;
                timer.innerHTML = minutes + ":" + "0" + seconds;
                timerStart.setAttribute("value", "Start");
                addTime.removeAttribute("disabled");
                subtractTime.removeAttribute("disabled");
                return;
            }

            if (minutes !== 0 && seconds === 0) {
                minutes -= 1;
                seconds = 59;
            }

            if (seconds.toString().length === 1) {
                timer.innerHTML = minutes + ":" + "0" + seconds;
            } else {
                timer.innerHTML = minutes + ":" + seconds;
            }
            
            seconds -= 1;

        }, 1000)
    }

    addTime.addEventListener("click", function (event) {
        if (started === false && minutes <= 120){
            minutes += 1;
            selectedMinutes = minutes;
            timer.innerHTML = minutes + ":" + "0" + seconds;
        }
    });

    subtractTime.addEventListener("click", function (event) {
        if (started === false && minutes > 1){
            minutes -= 1;
            selectedMinutes = minutes;
            timer.innerHTML = minutes + ":" + "0" + seconds;
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
            timerStart.setAttribute("value", "Pause");
            addTime.setAttribute("disabled", "");
            subtractTime.setAttribute("disabled", "");
            start_timer();
        }

    });
});
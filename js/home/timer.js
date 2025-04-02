/*
Names: Raymond, Aiden, Lucas Leung
Student Numbers:
Date Created: April 2, 2025
Description: Studyflow, a productivity tool that helps students transitioning to university with managing their tasks.
Created by Raymond, Aiden, and Lucas for COMPSCI 1XD3 at McMaster University.
*/

window.addEventListener("load", function (event) {

    // timer countdown
    let timer = document.getElementById('timer');
    let timer_button = document.getElementById('timer_button');
    let minutes = 0;
    let seconds = 10;
    let paused = false;
    let started = false;

    timer_button.addEventListener("click", function (event) {

        // user unpauses timer
        if (paused) {
            timer_interval = setInterval(function () {
                if (seconds.toString().length == 1) {
                    timer.innerHTML = minutes + ":" + "0" + seconds;
                } else {
                    timer.innerHTML = minutes + ":" + seconds;
                }

                if (minutes === 0 && seconds === 0) {
                    clearInterval(timer_interval);
                } else if (seconds === 0) {
                    minutes -= 1;
                    seconds = 59;
                }
                seconds -= 1;

            }, 1000)
            paused = false;
            timer_button.setAttribute("value", "Pause");
            // user pauses timer after starting it
        } else if (paused === false && started === true) {
            clearInterval(timer_interval);
            paused = true;
            timer_button.setAttribute("value", "Start");
        }

        // user starts timer for first time
        if (started === false) {
            minutes = 0;
            seconds = 10;
            timer_interval = setInterval(function () {
                if (seconds.toString().length == 1) {
                    timer.innerHTML = minutes + ":" + "0" + seconds;
                } else {
                    timer.innerHTML = minutes + ":" + seconds;
                }

                if (minutes === 0 && seconds === 0) {
                    clearInterval(timer_interval);
                } else if (seconds === 0) {
                    minutes -= 1;
                    seconds = 59;
                }
                seconds -= 1;

            }, 1000)
            started = true;
            timer_button.setAttribute("value", "Pause")
        }

    });
});
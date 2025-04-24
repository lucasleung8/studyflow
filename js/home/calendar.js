/*
Names: Raymond, Aiden, Lucas Leung
Student Numbers:
Date Created: April 2, 2025
Description: Studyflow, a productivity tool that helps students transitioning to university with managing their tasks.
Created by Raymond, Aiden, and Lucas for COMPSCI 1XD3 at McMaster University.
*/

window.addEventListener("load", function (event) {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();

    //Names of each month
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    //Variables and DOM elements
    let selectedDay;
    let allDays = document.getElementById("calendarDates");
    let displayMonth = document.getElementById("displayMonth");
    let eventDate = document.getElementById("eventDate");
    let eventItems = document.getElementById("eventItems");

    //Month navigation buttons
    let prevMonth = document.getElementById("prevMonth");
    let nextMonth = document.getElementById("nextMonth");

    prevMonth.addEventListener("click", () => changeMonth("prev"));
    nextMonth.addEventListener("click", () => changeMonth("next"));
    
    //Dark/Light mode button
    let themeSwitch = document.getElementById("themeSwitch");
    themeSwitch.addEventListener("click", () => switchTheme());

    //Change selected date to current date
    eventDate.innerHTML = `${months[month]} ${date.getDate()}, ${year}`;
    selectedDay = `${year}-${month}-${date.getDate()}`;

    //Generate starting calendar
    generateCalendar();


    /**
     * Switches theme to either light/dark
     */
    function switchTheme() {
        if (document.body.classList.contains("darkmode")) {
            //Switch to lightmode
            document.body.classList.remove("darkmode");
        } else {
            //Switch to darkmode
            document.body.classList.add("darkmode");
        }
    }

    /**
     * Generates the calendar according to the current date
     */
    function generateCalendar() {
        let firstDay = new Date(year, month, 1).getDay(); //Day of first date of the month
        let lastDate = new Date(year, month + 1, 0).getDate(); //Last date of the month
        let lastDay = new Date(year, month, lastDate).getDay(); //Day of the last date of the month
        let prevLastDate = new Date(year, month, 0).getDate(); //Last date of the previous month
        let daysList = ""; //List of days(li elements) to be displayed

        //Add all of the previous month's dates that will appear
        for (let i = 1; i <= firstDay; i++) {
            let prevDay = prevLastDate - firstDay + i;
            daysList += `<li class="numb">${prevDay}</li>\n`;
        }

        //Add all current month dates
        for (let i = 1; i <= lastDate; i++) {
            //The date being added
            let current = `${year}-${month}-${i}`;

            //Current date vs every other date
            if (i === date.getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
                //Change font colour of current day
                if (current === selectedDay) {
                    //Previously selected date
                    daysList += `<li class="highlight selectedDate">${i}</li>\n`;
                } else {
                    daysList += `<li class="highlight">${i}</li>\n`;
                }
            } else {
                //Other dates
                if (current === selectedDay) {
                    //Previously selected date
                    daysList += `<li class="selectedDate">${i}</li>`;
                } else {
                    daysList += `<li>${i}</li>`;
                }
            }
        }

        //Add all of the next month's dates that will appear
        for (let i = lastDay; i < 6; i++) {
            daysList += `<li class="numb">${i - lastDay + 1}</li>\n`
        }

        //Add calendar days
        allDays.innerHTML = daysList;

        //Add current date to header and event header
        displayMonth.innerHTML = `${months[month]} ${year}`;

        //Add event listeners
        addDateListeners();
    }


    /**
     * Adds event listener to every date in the 
     * Opens events dropdown on click for the day
     */
    function addDateListeners() {
        let dates = document.querySelectorAll("#calendarDates li:not(.numb)");
        dates.forEach(li => li.addEventListener("click", function (event) {
            for (let day of dates) {
                day.classList.remove("selectedDate");
            }
            let clickedDay = event.target;
            clickedDay.classList.add("selectedDate");
            selectedDay = `${year}-${month}-${clickedDay.textContent}`;
            eventDate.innerHTML = `${months[month]} ${clickedDay.textContent}, ${year}`;
            displayEvents();
        }));
    }


    /**
     * Changes shown month to previous/following month depending on clicked button
     */
    function changeMonth(shift) {
        //Shift month
        if (shift === "prev") {
            month -= 1;
        }
        else if (shift === "next") {
            month += 1;
        }

        //Change date variable to new date
        if (month < 0 || month > 11) {
            //Month change results in year change
            date = new Date(year, month, new Date().getDate());
            year = date.getFullYear();
            month = date.getMonth();
        } else {
            date = new Date();
        }

        //Visually change calendar
        generateCalendar();
    }

    /**
     * Displays events for the selected date
     */
    function displayEvents() {
        eventItems.innerHTML = "";
        if (eventsPerDay[selectedDay]) {
            for (let event of eventsPerDay[selectedDay]) {
                let div = document.createElement("div");
                div.classList.add("eventItem");
                eventItems.appendChild(div);
            }
        }
    }

});

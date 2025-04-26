<!doctype html>
<!--
Names: Raymond, Aiden, Lucas
Student Numbers: 400556509, 400570383, 400582219
Date Created: March 30, 2025
Description: Home page for when you sign in. Has a task list/creator, statistics for completed tasks
timer, calendar to view tasks, and dark mode.
-->
<html>

<head>
    <meta charset="utf-8" name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home - Studyflow</title>
    <meta name="viewport" content="width=device-width">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/darkmode.css">
    <link rel="stylesheet" href="css/header.css">
    <link rel="stylesheet" href="css/calendar.css">
    <link rel="stylesheet" href="css/tasks.css">
    <link rel="stylesheet" href="css/calendarTasks.css">
    <link rel="stylesheet" href="css/timer.css">
    <script src="
    https://cdn.jsdelivr.net/npm/chart.js@4.4.8/dist/chart.umd.min.js
    "></script>
    <script src="js/home/tasks.js"></script>
    <script src="js/home/calendar.js"></script>
    <script src="js/home/charts.js"></script>
    <script src="js/home/timer.js"></script>
    <script src="js/home/darkmode.js"></script>
</head>

<body>
    <?php
    session_start();
    if (!isset($_SESSION['userID'])) {
        header("Location: login.html?error=not_logged_in");
        exit;
    }
    ?>
    <div class="headerContainer container">
        <h1 id="greeting">Welcome, <?php echo htmlspecialchars($_SESSION['realName']); ?>!</h1>
        <div class="headerButtons">
            <button id="themeSwitch">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                    fill="#e3e3e3">
                    <path
                        d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                    fill="#e3e3e3">
                    <path
                        d="M480-280q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Z" />
                </svg>
            </button>
            <form action="server/logout.php" method="POST" id="logoutButton">
                <button type="submit" class="taskButton button">Logout</button>
            </form>
        </div>
    </div>

    <div class="taskFormContainer container">
        <h1 id="taskHeader">Tasks</h1>
        <hr>
        <div id="taskTabs">
            <input id="ongoingTab" class="taskButton button" type="button" value="Ongoing Tasks">
            <input id="completedTab" class="taskButton button" type="button" value="Completed Tasks">
        </div>
        <div id="tasklist"></div>
        <input id="createTask" class="taskButton button" type="button" value="Create Task">
        <hr>
    </div>

    <div id="overlay"></div>
    <div class="taskFormContainer container" id="taskPopup">
        <div id="createTask">
            <h2 id="createTaskHeader">Create Task</h2>
            Name: <input id="taskName" class="taskInput" name="taskName" type="text">
            Description: <input id="taskDesc" class="taskInput" name="taskDesc" type="text">
            Course: <input id="course" class="taskInput" name="course" type="text">
            Due Date: <input id="dueDate" class="taskInput" name="dueDate" type="datetime-local">
            Priority: <select id="priority" class="taskInput" name="priority">
                <option value="1">Low</option>
                <option value="2">Medium</option>
                <option value="3">High</option>
                <option value="4">URGENT</option>
            </select>
            <span id="taskFeedback"></span>
            <input id="taskSubmit" class="taskButton button" type="submit">
        </div>
    </div>

    <div class="taskFormContainer container" id="editTaskPopup">
        <h2 id="editTaskHeader">Edit Task</h2>
        Name: <input id="editTaskName" class="taskInput" name="editTaskName" type="text">
        Description: <input id="editTaskDesc" class="taskInput" name="editTaskDesc" type="text">
        Course: <input id="editCourse" class="taskInput" name="editCourse" type="text">
        Due Date: <input id="editDueDate" class="taskInput" name="editDueDate" type="datetime-local">
        Priority: <select id="editPriority" class="taskInput" name="editPriority">
            <option value="1">Low</option>
            <option value="2">Medium</option>
            <option value="3">High</option>
            <option value="4">URGENT</option>
        </select>
        <span id="editTaskFeedback"></span>
        <input id="editTaskSubmit" class="taskButton button" type="submit" value="Save Changes">
    </div>
    <div id="chartContainer" class="container">
        <canvas id="chart"></canvas>
    </div>
    <div id="timerContainer" class="container">
        <div id="timerHeader">
            <h2>Start a Study Session:</h2>
        </div>
        <h3 id="timer">20:00</h3>
        <div id="timerButtons">
            <button class="timerButton" id="subtractTime">-</button>
            <input id="timerStart" class="button" type="submit" value="Start">
            <input id="timerStop" class="button" type="submit" value="Stop">
            <button class="timerButton" id="addTime">+</button>
        </div>
        <div>
            <h3 id="minutesTotal">Total Minutes Studied: </h3>
        </div>
    </div>

    <div id="calendarContainer" class="container">
        <header id="calendarHeader">
            <p id="displayMonth">Month Year</p>
            <div id="calendarNav">
                <button id="prevMonth" class="monthNav">&lt;</button>
                <button id="nextMonth" class="monthNav">></button>
            </div>
        </header>
        <div id="calendarBody">
            <ul id="calendarWeekdays">
                <li>Sun</li>
                <li>Mon</li>
                <li>Tue</li>
                <li>Wed</li>
                <li>Thu</li>
                <li>Fri</li>
                <li>Sat</li>
            </ul>
            <ul id="calendarDates"></ul>
        </div>
    </div>
    <div id="eventContainer" class="container">
        <div id="eventHeader">
            <p id="eventDate">Month Day, Year</p>
        </div>
        <hr>
        <div id="dateTaskList"></div>
    </div>
</body>

</html>
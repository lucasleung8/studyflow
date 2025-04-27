/*
 * Name: Aiden Ly and Lucas Leung
 * Student Numbers: 400570383, 400582219
 * Date Created: April 2, 2025
 * Description: Manages both task-related functionality, including creating, editing, deleting, displaying tasks, as well as
 * the chart.
 */

window.addEventListener("load", function () {
    let userID;
    const taskList = document.getElementById("tasklist");
    const taskPopup = document.getElementById("taskPopup");
    const editTaskPopup = document.getElementById("editTaskPopup");
    const overlay = document.getElementById("overlay");
    const createTaskButton = document.getElementById("createTask");
    const taskSubmitButton = document.getElementById("taskSubmit");
    const completedTab = document.getElementById("completedTab");
    const ongoingTab = document.getElementById("ongoingTab");
    let currentTab = "ongoing";
    ongoingTab.classList.add("activeTab");
    // Chart variables
    let chart;
    let dataset = [0, 0, 0, 0, 0, 0, 0];
    const ctx = document.getElementById('chart');

    /**
     * Fetches the user ID from the server.
     */
    fetch("server/getUserID.php", {
        method: "GET",
        credentials: "include",
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === "ok") {
                userID = data.userID;
                loadTasks(false);
            } else {
                console.error("Failed to fetch userID:", data.message);
            }
        })
        .catch((error) => {
            console.error("Error fetching userID:", error);
        });

    /**
     * Displays a popup.
     *
     * @param {HTMLElement} popup - The popup element to display.
     */
    function showPopup(popup) {
        popup.style.display = "flex";
        overlay.style.display = "block";
    }

    /**
     * Hides a popup.
     *
     * @param {HTMLElement} popup - The popup element to hide.
     */
    function hidePopup(popup) {
        popup.style.display = "none";
        overlay.style.display = "none";
    }

    createTaskButton.addEventListener("click", () => {
        showPopup(taskPopup);
    });

    overlay.addEventListener("click", () => {
        hidePopup(taskPopup);
        hidePopup(editTaskPopup);
    });

    /**
     * Submits a new task to the server.
     */
    taskSubmitButton.addEventListener("click", (event) => {
        event.preventDefault();
        const name = document.getElementById("taskName").value;
        const description = document.getElementById("taskDesc").value;
        const course = document.getElementById("course").value;
        const dueDate = document.getElementById("dueDate").value;
        const priority = document.getElementById("priority").value;

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("course", course);
        formData.append("duedate", dueDate);
        formData.append("priority", priority);
        formData.append("userid", userID);

        fetch("server/tasks.php", {
            method: "POST",
            body: formData,
            credentials: "include",
        })
            .then((response) => {
                if (!response.ok) throw new Error("Network response was not ok " + response.statusText);
                return response.json();
            })
            .then((json) => {
                const feedbackElement = document.getElementById("taskFeedback");
                feedbackElement.textContent = json.status === "ok" ? json.message : "Error: " + json.error;
                feedbackElement.style.color = json.status === "ok" ? "green" : "red";
                if (json.status === "ok") {
                    hidePopup(taskPopup);
                    loadTasks(false);
                }
            })
            .catch((error) => {
                console.error("Fetch error:", error);
                const feedbackElement = document.getElementById("taskFeedback");
                feedbackElement.textContent = "An error occurred while submitting the task.";
                feedbackElement.style.color = "red";
            });
    });

    /**
     * Loads tasks from the server.
     *
     * @param {Boolean} completed - Whether to load completed tasks (true) or ongoing tasks (false).
     */
    function loadTasks(completed = false) {
        fetch(`server/getTasks.php?userid=${userID}&completed=${completed}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "ok") {
                    const sortedTasks = data.tasks.sort((a, b) => b.priority - a.priority);
                    displayTasks(sortedTasks, completed);
                } else {
                    taskList.innerHTML = `<p>Error: ${data.message}</p>`;
                }
            })
            .catch((error) => {
                console.error("Error loading tasks:", error);
                taskList.innerHTML = "<p>Failed to load tasks.</p>";
            });
    }

    /**
     * Displays tasks in the task list.
     *
     * @param {Array} tasks - The list of tasks to display.
     * @param {Boolean} completed - Whether the tasks are completed.
     */
    function displayTasks(tasks, completed) {
        taskList.innerHTML = "";
        if (tasks.length === 0) {
            taskList.innerHTML = `<p>No ${completed ? "completed" : "ongoing"} tasks available.</p>`;
            return;
        }

        tasks.forEach((task) => {
            const taskItem = document.createElement("div");
            taskItem.className = "taskItem";

            let completedTime = "";
            if (task.completed && task.completedDate) {
                const serverDate = new Date(task.completedDate);
                const estDate = new Date(serverDate.getTime() - 6 * 60 * 60 * 1000);
                completedTime = `<p>Completed on: ${estDate.toLocaleString("en-US", { timeZone: "America/New_York" })}</p>`;
            }

            const dueDate = new Date(task.dueDate);
            const isOverdue = !task.completed && dueDate < new Date();

            if (isOverdue) {
                taskItem.style.backgroundColor = "#FFCCCB";
            }

            taskItem.innerHTML = `
                <h3>${task.name}</h3>
                <p>${task.description}</p>
                <p>Course: ${task.course}</p>
                <p>Due: ${dueDate.toLocaleString()}</p>
                <p>Priority: ${["Low", "Medium", "High", "URGENT"][task.priority - 1]}</p>
                ${completedTime}
                ${isOverdue ? `<p style="color: white; font-weight: bold;">Overdue!</p>` : ""}
                <div class="taskActions">
                    ${!task.completed
                    ? `<button class="editTaskButton taskButton" data-task-id="${task.taskID}">Edit</button>
                            <button class="completeTaskButton taskButton" data-task-id="${task.taskID}">Complete</button>`
                    : ""
                }
                    <button class="deleteTaskButton taskButton" data-task-id="${task.taskID}">Delete</button>
                </div>
            `;
            taskList.appendChild(taskItem);

            if (!task.completed) {
                taskItem.querySelector(".editTaskButton").addEventListener("click", () => openEditPopup(task));
                taskItem.querySelector(".completeTaskButton").addEventListener("click", () => updateTaskCompletion(task.taskID, true));
            }

            taskItem.querySelector(".deleteTaskButton").addEventListener("click", () => deleteTask(task.taskID));
        });
    }

    /**
     * Opens the edit task popup and populates it with task details.
     *
     * @param {Object} task - The task to edit.
     */
    function openEditPopup(task) {
        document.getElementById("editTaskName").value = task.name;
        document.getElementById("editTaskDesc").value = task.description;
        document.getElementById("editCourse").value = task.course;
        document.getElementById("editDueDate").value = task.dueDate;
        document.getElementById("editPriority").value = task.priority;

        showPopup(editTaskPopup);

        const editTaskSubmitButton = document.getElementById("editTaskSubmit");
        editTaskSubmitButton.onclick = function (event) {
            event.preventDefault();

            const updatedName = document.getElementById("editTaskName").value;
            const updatedDescription = document.getElementById("editTaskDesc").value;
            const updatedCourse = document.getElementById("editCourse").value;
            const updatedDueDate = document.getElementById("editDueDate").value;
            const updatedPriority = document.getElementById("editPriority").value;

            fetch("server/updateTask.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `task_id=${task.taskID}&name=${encodeURIComponent(updatedName)}&description=${encodeURIComponent(updatedDescription)}&course=${encodeURIComponent(updatedCourse)}&duedate=${encodeURIComponent(updatedDueDate)}&priority=${updatedPriority}`
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.status === "ok") {
                        hidePopup(editTaskPopup);
                        loadTasks(currentTab === "completed");
                    } else {
                        alert("Failed to update task: " + data.message);
                    }
                })
                .catch((error) => console.error("Error updating task:", error));

            // Retrieve number of completed tasks per day based on dates of completed tasks in DB
            let url = "server/charts.php";
            fetch(url)
                .then(response => response.json())
                .then(updateChart)
        };
    }

    /**
     * Deletes a task from the server.
     *
     * @param {Number} taskID - The ID of the task to delete.
     */
    function deleteTask(taskID) {
        fetch("server/deleteTask.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `task_id=${taskID}`
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "ok") {
                    loadTasks(currentTab === "completed");
                } else {
                    console.error("Failed to delete task:", data.message);
                }
            })
            .catch((error) => console.error("Error deleting task:", error));
    }

    /**
     * Updates the chart with new task completion stats.
     *
     * @param {Array} newDataset The new dataset to replace the old with, a 7-element integer array representing tasks completed each day
     */
    function updateChart(newDataset) {
        chart.data.datasets[0].data = newDataset;
        chart.update();
    }

    /**
     * Updates the completion status of a task.
     *
     * @param {Number} taskID - The ID of the task to update.
     * @param {Boolean} completed - Whether the task is completed.
     */
    function updateTaskCompletion(taskID, completed) {
        fetch("server/updateTask.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `task_id=${taskID}&completed=${completed}`
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "ok") {
                    loadTasks(currentTab === "completed");
                } else {
                    alert("Failed to update task: " + data.message);
                }
            })
            .catch((error) => console.error("Error updating task:", error));

        // Update chart data 
        fetch("server/charts.php")
            .then(response => response.json())
            .then(updateChart)
    }

    ongoingTab.addEventListener("click", () => {
        currentTab = "ongoing";
        loadTasks(false);

        ongoingTab.classList.add("activeTab");
        completedTab.classList.remove("activeTab");
    });

    completedTab.addEventListener("click", () => {
        currentTab = "completed";
        loadTasks(true);

        completedTab.classList.add("activeTab");
        ongoingTab.classList.remove("activeTab");
    });

    loadTasks(false);

    // Retrieve data for graph - number of completed tasks per day based on dates of completed tasks in DB
    let url = "server/charts.php";
    fetch(url)
        .then(response => response.json())
        .then(updateChart)

    // Create the chart
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            datasets: [{
                label: 'Completed Tasks This Week',
                data: dataset,
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
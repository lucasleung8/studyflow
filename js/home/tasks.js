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
    const editTaskSubmitButton = document.getElementById("editTaskSubmit");
    let currentTab = "ongoing";

    ongoingTab.classList.add("activeTab");

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

    function showPopup(popup) {
        popup.style.display = "flex";
        overlay.style.display = "block";
    }

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

    function loadTasks(completed = false) {
        fetch(`server/getTasks.php?userid=${userID}&completed=${completed}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "ok") {
                    const sortedTasks = data.tasks.sort((a, b) => b.priority - a.priority); // Sort by priority (descending)
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
                    ${
                        !task.completed
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

    function openEditPopup(task) {
        const editTaskPopup = document.getElementById("editTaskPopup");
        const overlay = document.getElementById("overlay");
    
        document.getElementById("editTaskName").value = task.name;
        document.getElementById("editTaskDesc").value = task.description;
        document.getElementById("editCourse").value = task.course;
        document.getElementById("editDueDate").value = task.dueDate;
        document.getElementById("editPriority").value = task.priority;
    
        editTaskPopup.style.display = "flex";
        overlay.style.display = "block";
    
        const editTaskSubmitButton = document.getElementById("editTaskSubmit");
        editTaskSubmitButton.onclick = function (event) {
            event.preventDefault();
    
            const updatedName = document.getElementById("editTaskName").value;
            const updatedDescription = document.getElementById("editTaskDesc").value;
            const updatedCourse = document.getElementById("editCourse").value;
            const updatedDueDate = document.getElementById("editDueDate").value;
            const updatedPriority = document.getElementById("editPriority").value;
    
            // Send the updated task data to the server
            fetch("server/updateTask.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `task_id=${task.taskID}&name=${encodeURIComponent(updatedName)}&description=${encodeURIComponent(updatedDescription)}&course=${encodeURIComponent(updatedCourse)}&duedate=${encodeURIComponent(updatedDueDate)}&priority=${updatedPriority}`
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === "ok") {
                        hidePopup(editTaskPopup);
                        loadTasks(currentTab === "completed");
                    } else {
                        alert("Failed to update task: " + data.message);
                    }
                })
                .catch(error => console.error("Error updating task:", error));
        };
    }

    function deleteTask(taskID) {
        fetch("server/deleteTask.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `task_id=${taskID}`
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === "ok") {
                    loadTasks(currentTab === "completed");
                } else {
                    console.error("Failed to delete task:", data.message);
                }
            })
            .catch(error => console.error("Error deleting task:", error));
    }

    function updateTaskCompletion(taskID, completed) {
        fetch("server/updateTask.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `task_id=${taskID}&completed=${completed}`
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === "ok") {
                    loadTasks(currentTab === "completed");
                    if (completed) {
                        const dayIndex = new Date().getDay();
                        updateChart(dayIndex);
                    }
                } else {
                    alert("Failed to update task: " + data.message);
                }
            })
            .catch(error => console.error("Error updating task:", error));
    }

    function updateChart(completed) {
        if (completed) {
            const dayIndex = new Date().getDay();
            chart.data.datasets[0].data[dayIndex]++;
            chart.update();
        }
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
});
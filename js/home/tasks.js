/*
Names: Raymond, Aiden, Lucas Leung
Student Numbers:
Date Created: April 2, 2025
Description: Studyflow, a productivity tool that helps students transitioning to university with managing their tasks.
Created by Raymond, Aiden, and Lucas for COMPSCI 1XD3 at McMaster University.
*/

window.addEventListener("load", function (event) {
    // UserId set at 1 as a placeholder, will be from session after login is made
    let userID = 1;
    let taskSubmit = document.getElementById("taskSubmit");
    let createTask = document.getElementById("createTask");
    let taskPopup = document.getElementById("taskPopup");
    let overlay = document.getElementById("overlay");

    function taskAdded(feedback) {
        const feedbackElement = document.getElementById("taskFeedback");
        if (feedback.status === "ok") {
            feedbackElement.textContent = feedback.message; // Display success message
            feedbackElement.style.color = "green"; 
        } else if (feedback.error) {
            feedbackElement.textContent = "Error: " + feedback.error; 
            feedbackElement.style.color = "red"; 
        }
    }

    createTask.addEventListener("click", function (event) {
        taskPopup.style["display"] = "flex";
        overlay.style["display"] = "block";
        overlay.addEventListener("click", function (event) {
            taskPopup.style["display"] = "none";
            overlay.style["display"] = "none";
        })
    }) 

    taskSubmit.addEventListener("click", function (event) {
        event.preventDefault();

        let name = document.getElementById("taskName").value;
        let description = document.getElementById("taskDesc").value;
        let course = document.getElementById("course").value;
        let duedate = document.getElementById("dueDate").value;
        let priority = document.getElementById("priority").value;

        let formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("course", course);
        formData.append("duedate", duedate);
        formData.append("priority", priority);
        formData.append("userid", userID);

        fetch("server/tasks.php", {
            method: "POST",
            body: formData,
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok " + response.statusText);
            }
            return response.text(); 
        })
        .then(text => {
            console.log("Response text:", text); 
            try {
                let json = JSON.parse(text);
                taskAdded(json);
            } catch (error) {
                console.error("Failed to parse JSON:", error);
                console.error("Response text:", text);
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
            const feedbackElement = document.getElementById("taskFeedback");
            feedbackElement.textContent = "An error occurred while submitting the task.";
            feedbackElement.style.color = "red";
        });
    });
});
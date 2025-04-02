window.addEventListener("load", function (event) {
    // UserId set at 1 as a placeholder, will be from session after login is made
    let userID = 1;

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

    let taskSubmit = document.getElementById("taskSubmit");

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
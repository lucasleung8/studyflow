window.addEventListener("load", function (event) {
    let userID = 1;

    function taskAdded(feedback) {


    
    }
    

    let taskSubmit = document.getElementById("taskSubmit");

    taskSubmit.addEventListener("click", function (event) {
        let name = document.getElementById("taskName").value;
        let description = document.getElementById("taskDesc").value;
        let course = document.getElementById("course").value;
        let duedate = document.getElementById("dueDate").value;
        let priority = (int)(document.getElementById("priority").value);

        let url = "server/tasks.php?name=" + name + "&description=" + description + 
        "&course=" + course + "&duedate=" + duedate + "&priority=" + priority + "&userid=" + userID;

        fetch(url, {credentials: 'include'})
            .then(response => response.json())
            .then(taskAdded)

    });



})
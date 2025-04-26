/*
 * Name: Aiden Ly
 * Student Number: 400570383
 * Date Created: April 23, 2025
 * Description: Handles user login functionality, including form validation and server communication.
 */

window.addEventListener("load", function () {
    const loginButton = document.getElementById("submitLogin");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const loginFeedback = document.getElementById("loginFeedback");

    /**
     * Handles the login button click event.
     *
     * Validates the input fields, sends the login request to the server, and processes the response.
     */
    loginButton.addEventListener("click", (event) => {
        event.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // Validate input fields
        if (!username || !password) {
            loginFeedback.textContent = "Please fill in both fields.";
            loginFeedback.className = "feedback error";
            return;
        }

        // Send login request to the server
        fetch("server/login.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === "ok") {
                    // Redirect to the specified page on successful login
                    window.location.href = data.redirect;
                } else {
                    // Display error message on failed login
                    loginFeedback.textContent = data.message;
                    loginFeedback.className = "feedback error";
                }
            })
            .catch(error => {
                console.error("Error logging in:", error);
                loginFeedback.textContent = "An error occurred. Please try again.";
                loginFeedback.className = "feedback error";
            });
    });
});
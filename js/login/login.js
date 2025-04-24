window.addEventListener("load", function (event) {
    const loginButton = document.getElementById("submitLogin");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const loginFeedback = document.getElementById("loginFeedback");

    loginButton.addEventListener("click", (event) => {
        event.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
            loginFeedback.textContent = "Please fill in both fields.";
            loginFeedback.className = "feedback error";
            return;
        }

        fetch("server/login.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === "ok") {
                    window.location.href = data.redirect; // Redirect to the correct path
                } else {
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
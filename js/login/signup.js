/*
 * Name: Aiden Ly
 * Student Number: 400570383
 * Date Created: April 23, 2025
 * Description: Handles user signup functionality, including form validation and server communication.
 */

window.addEventListener("load", function (event) {
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const realNameInput = document.getElementById("realName");
    const usernameFeedback = document.getElementById("usernameFeedback");
    const passwordFeedback = document.getElementById("passwordFeedback");
    const confirmPasswordFeedback = document.getElementById("confirmPasswordFeedback");
    const signupFeedback = document.getElementById("signupFeedback");
    const signupButton = document.getElementById("submitSignUp");

    /**
     * Validates the username input and checks its availability.
     */
    usernameInput.addEventListener("input", () => {
        const username = usernameInput.value;
        if (username.length < 8) {
            usernameFeedback.textContent = "Username must be at least 8 characters.";
            usernameFeedback.className = "feedback error";
        } else {
            fetch(`server/checkUsername.php?username=${username}`)
                .then(response => response.json())
                .then(data => {
                    if (data.exists) {
                        usernameFeedback.textContent = "Username is already taken.";
                        usernameFeedback.className = "feedback error";
                    } else {
                        usernameFeedback.textContent = "Username is available.";
                        usernameFeedback.className = "feedback success";
                    }
                });
        }
    });

    /**
     * Validates the password input for strength.
     */
    passwordInput.addEventListener("input", () => {
        const password = passwordInput.value;
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!regex.test(password)) {
            passwordFeedback.textContent = "Password must be at least 8 characters, include uppercase, lowercase, number, and special character.";
            passwordFeedback.className = "feedback error";
        } else {
            passwordFeedback.textContent = "Password is valid.";
            passwordFeedback.className = "feedback success";
        }
    });

    /**
     * Validates that the confirm password input matches the password input.
     */
    confirmPasswordInput.addEventListener("input", () => {
        if (confirmPasswordInput.value !== passwordInput.value) {
            confirmPasswordFeedback.textContent = "Passwords do not match.";
            confirmPasswordFeedback.className = "feedback error";
        } else {
            confirmPasswordFeedback.textContent = "Passwords match.";
            confirmPasswordFeedback.className = "feedback success";
        }
    });

    /**
     * Handles the signup button click event.
     *
     * Validates all input fields, sends the signup request to the server, and processes the response.
     */
    signupButton.addEventListener("click", (event) => {
        event.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();
        const realName = realNameInput.value.trim();

        // Validate all fields
        if (!username || !password || !confirmPassword || !realName) {
            signupFeedback.textContent = "Please fill in all fields.";
            signupFeedback.className = "feedback error";
            return;
        }

        if (password !== confirmPassword) {
            signupFeedback.textContent = "Passwords do not match.";
            signupFeedback.className = "feedback error";
            return;
        }

        // Send signup request to the server
        fetch("server/signup.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&realName=${encodeURIComponent(realName)}`
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === "ok") {
                    signupFeedback.textContent = "Sign up successful! Redirecting to login...";
                    signupFeedback.className = "feedback success";
                    setTimeout(() => {
                        window.location.href = "login.html";
                    }, 2000);
                } else {
                    signupFeedback.textContent = data.message;
                    signupFeedback.className = "feedback error";
                }
            })
            .catch(error => {
                console.error("Error signing up:", error);
                signupFeedback.textContent = "An error occurred. Please try again.";
                signupFeedback.className = "feedback error";
            });
    });
});
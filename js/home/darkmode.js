window.addEventListener("load", function (event) {
    //Dark/Light mode button
    let themeSwitch = document.getElementById("themeSwitch");
    themeSwitch.addEventListener("click", () => switchTheme());

    //Check for last saved setting
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("darkmode");
    }

    /**
     * Switches theme to either light/dark
     */
    function switchTheme() {
        if (document.body.classList.contains("darkmode")) {
            //Switch to lightmode
            document.body.classList.remove("darkmode");
            localStorage.setItem("theme", "light");
        } else {
            //Switch to darkmode
            document.body.classList.add("darkmode");
            localStorage.setItem("theme", "dark");
        }
    }
});
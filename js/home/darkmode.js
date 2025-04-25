window.addEventListener("load", function (event) {
    //Dark/Light mode button
    let themeSwitch = document.getElementById("themeSwitch");
    themeSwitch.addEventListener("click", () => switchTheme());

    /**
     * Switches theme to either light/dark
     */
    function switchTheme() {
        if (document.body.classList.contains("darkmode")) {
            //Switch to lightmode
            document.body.classList.remove("darkmode");
        } else {
            //Switch to darkmode
            document.body.classList.add("darkmode");
        }
    }
});
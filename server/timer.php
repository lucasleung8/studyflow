<?php

/**
 * Names: Raymond, Aiden, Lucas Leung
 * Student Numbers:
 * Date Created: April 2, 2025
 * Description: Studyflow, a productivity tool that helps students transitioning to university with managing their tasks.
 * Created by Raymond, Aiden, and Lucas for COMPSCI 1XD3 at McMaster University.
 */

// TODO implement sanitization and error checking to ensure session is active
// TODO implement json to display errors with greater detail
session_start();
include "connect.php";
// header('Content-Type: application/json');


if (isset($_SESSION['userID'])) {

    // selectedMinutes is the time the user set which will increment the elapsed minutes in the DB
    $totalMinutes = filter_input(INPUT_GET, "totalMinutes", FILTER_VALIDATE_INT);

    // retrieve the total minutes
    $stmt = $dbh->prepare("SELECT minutesTotal FROM login WHERE userID = ?");
    $args = [$_SESSION["userID"]];
    $success = $stmt->execute($args);
    $row = $stmt->fetch();
    $storedMinutes = $row["minutesTotal"];

    // user hasn't finished a session, just retrieve the total minutes from the DB
    if ($totalMinutes === null || $totalMinutes === false) {
        echo ($storedMinutes);
    } else {
        // increments the total minutes studied and returns the new total time
        $stmt = $dbh->prepare("UPDATE login SET minutesTotal = minutesTotal + ? WHERE userID = ?");
        $args = [$totalMinutes, $_SESSION["userID"]];
        $success = $stmt->execute($args);
        $storedMinutes = $storedMinutes + $totalMinutes;
        echo ($storedMinutes);
    }
} else {
    echo (-1);
}

<?php

/**
 * Name: Lucas Leung
 * Student Number: 400582219
 * Date Created: April 2, 2025
 * Description: Updates the total minutes associated with the user when they use the timer
 */

session_start();
include "connect.php";

if (isset($_SESSION['userID'])) {

    // TotalMinutes is the elapsed time from the study session
    $totalMinutes = filter_input(INPUT_GET, "totalMinutes", FILTER_VALIDATE_INT);

    // Retrieve the total minutes and assign it to variable
    $stmt = $dbh->prepare("SELECT minutesTotal FROM login WHERE userID = ?");
    $args = [$_SESSION["userID"]];
    $success = $stmt->execute($args);
    $row = $stmt->fetch();
    $storedMinutes = $row["minutesTotal"];

    // Return the minutes stored in the database without updating it, when AJAX call only needs to retrieve from the DB
    if ($totalMinutes === 0) {
        echo ($storedMinutes);
    } else if ($totalMinutes === null || $totalMinutes === false) {
        echo ("ERROR Incorrect Parameter");
    } else {
        // Increment the total minutes studied and returns the new total time
        $stmt = $dbh->prepare("UPDATE login SET minutesTotal = minutesTotal + ? WHERE userID = ?");
        $args = [$totalMinutes, $_SESSION["userID"]];
        $success = $stmt->execute($args);
        $storedMinutes = $storedMinutes + $totalMinutes;
        echo ($storedMinutes);
    }
} else {
    echo ("ERROR User not logged in");
}
<?php
/**
 * Name: Lucas Leung
 * Student Number: 400582219
 * Date Created: April 26, 2025
 * Description: Retrieves completed tasks for the current week to display onto the chart. 
 * Returns an array containing the number of completed tasks each day of the week, without changing the DB.
 */
include "connect.php";
header('Content-Type: application/json');

try {
    // Each index represents Sunday to Saturday
    $dataset = [0, 0, 0, 0, 0, 0, 0];
    $timezone = "America/Toronto";
    date_default_timezone_set($timezone);
    $currentDay = date_create("now", new DateTimeZone($timezone));
    $currentWeekNum = date_format($currentDay, "W");

    $command = "SELECT DATE(completedDate) FROM tasks";
    $stmt = $dbh->prepare($command);
    $stmt->execute();
    while ($row = $stmt->fetch()) {
        // Convert completion date string to PHP Date object
        $completedDate = date_create($row["DATE(completedDate)"]);
        $weekNum = date_format($completedDate, 'W');
        // Increment chart dataset if week numbers match
        if ($weekNum === $currentWeekNum) {
            $dataset[date_format($completedDate, 'w')] += 1;
        }
    }
    echo json_encode($dataset);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}

?>
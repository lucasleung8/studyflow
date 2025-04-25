<?php
/**
* Names: Raymond, Aiden, Lucas Leung
* Student Numbers:
* Date Created: April 23, 2025
* Description: PHP file for task display using calendar
 */
include "connect.php";

header('Content-Type: application/json');

try {
    $user_id = filter_input(INPUT_GET, "userid", FILTER_VALIDATE_INT);
    $date = filter_input(INPUT_GET, "date", FILTER_SANITIZE_SPECIAL_CHARS);

    if ($user_id === null || empty($date)) {
        echo json_encode(["status" => "error", "message" => "Invalid user ID or date"]);
        exit;
    }

    $command = "SELECT taskID, name, description, course, dueDate, priority
                FROM tasks WHERE userID = ? AND DATE(dueDate) = ? AND completed = 0";
    $stmt = $dbh->prepare($command);
    $stmt->execute([$user_id, $date]);
    $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["status" => "ok", "tasks" => $tasks]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
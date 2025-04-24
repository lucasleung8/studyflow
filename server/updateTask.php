<?php
/**
* Names: Raymond, Aiden, Lucas Leung
* Student Numbers:
* Date Created: April 2, 2025
* Description: Studyflow, a productivity tool that helps students transitioning to university with managing their tasks.
* Created by Raymond, Aiden, and Lucas for COMPSCI 1XD3 at McMaster University.
 */
include "connect.php";

header('Content-Type: application/json');

try {
    $task_id = filter_input(INPUT_POST, "task_id", FILTER_VALIDATE_INT);
    $completed = filter_input(INPUT_POST, "completed", FILTER_VALIDATE_BOOLEAN);
    $completedDate = $completed ? date('Y-m-d H:i:s') : null;

    if ($task_id === null || $completed === null) {
        echo json_encode(["status" => "error", "message" => "Invalid input"]);
        exit;
    }

    $command = "UPDATE tasks SET completed = ?, completedDate = ? WHERE taskId = ?";
    $stmt = $dbh->prepare($command);
    $stmt->execute([$completed, $completedDate, $task_id]);

    echo json_encode(["status" => "ok", "message" => "Task updated successfully"]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
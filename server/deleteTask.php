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

$taskID = filter_input(INPUT_POST, 'task_id', FILTER_VALIDATE_INT);

if (!$taskID) {
    echo json_encode(["status" => "error", "message" => "Invalid task ID"]);
    exit;
}

try {
    $stmt = $dbh->prepare("DELETE FROM tasks WHERE taskID = ?");
    $stmt->execute([$taskID]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(["status" => "ok", "message" => "Task deleted successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Task not found"]);
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
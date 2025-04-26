<?php
/**
 * Name: Aiden Ly
 * Student Number: 400570383
 * Date Created: April 24, 2025
 * Description: Deletes a task from the database based on the provided task ID.
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
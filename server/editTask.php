<?php
/**
 * Name: Aiden Ly
 * Student Number: 400570383
 * Date Created: April 24, 2025
 * Description: Updates an existing task in the database with new details.
 */

include "connect.php";

header('Content-Type: application/json');

try {
    $task_id = filter_input(INPUT_POST, "taskID", FILTER_VALIDATE_INT);
    $name = filter_input(INPUT_POST, "name", FILTER_SANITIZE_SPECIAL_CHARS);
    $description = filter_input(INPUT_POST, "description", FILTER_SANITIZE_SPECIAL_CHARS);
    $course = filter_input(INPUT_POST, "course", FILTER_SANITIZE_SPECIAL_CHARS);
    $duedate = filter_input(INPUT_POST, "duedate", FILTER_SANITIZE_SPECIAL_CHARS);
    $priority = filter_input(INPUT_POST, "priority", FILTER_VALIDATE_INT);

    if ($task_id === null || empty($name) || empty($description) || empty($course) || empty($duedate) || $priority === null) {
        echo json_encode(["status" => "error", "message" => "Invalid input"]);
        exit;
    }

    $command = "UPDATE tasks SET name = ?, description = ?, course = ?, dueDate = ?, priority = ? WHERE taskID = ?";
    $stmt = $dbh->prepare($command);
    $stmt->execute([$name, $description, $course, $duedate, $priority, $task_id]);

    echo json_encode(["status" => "ok", "message" => "Task updated successfully"]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
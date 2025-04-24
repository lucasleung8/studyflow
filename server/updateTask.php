<?php
/**
* Names: Raymond, Aiden, Lucas Leung
* Student Numbers:
* Date Created: April 2, 2025
* Description: Studyflow, a productivity tool that helps students transitioning to university with managing their tasks.
* Created by Raymond, Aiden, and Lucas for COMPSCI 1XD3 at McMaster University.
 */
session_start();
if (!isset($_SESSION['userID'])) {
    echo json_encode(["status" => "error", "message" => "User not logged in."]);
    exit;
}

include "connect.php";

$taskID = $_POST['task_id'] ?? null;
$completed = isset($_POST['completed']) ? filter_var($_POST['completed'], FILTER_VALIDATE_BOOLEAN) : null;

if ($completed !== null) {
    $stmt = $dbh->prepare("UPDATE tasks SET completed = ?, completedDate = NOW() WHERE taskID = ? AND userID = ?");
    $stmt->execute([$completed, $taskID, $_SESSION['userID']]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(["status" => "ok", "message" => "Task completion updated successfully."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to update task completion."]);
    }
    exit;
}

$name = $_POST['name'] ?? null;
$description = $_POST['description'] ?? null;
$course = $_POST['course'] ?? null;
$dueDate = $_POST['duedate'] ?? null;
$priority = $_POST['priority'] ?? null;

if (!$taskID || !$name || !$description || !$course || !$dueDate || !$priority) {
    echo json_encode(["status" => "error", "message" => "Invalid input. All fields are required."]);
    exit;
}

$stmt = $dbh->prepare("UPDATE tasks SET name = ?, description = ?, course = ?, dueDate = ?, priority = ? WHERE taskID = ? AND userID = ?");
$stmt->execute([$name, $description, $course, $dueDate, $priority, $taskID, $_SESSION['userID']]);

if ($stmt->rowCount() > 0) {
    echo json_encode(["status" => "ok", "message" => "Task updated successfully."]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to update task."]);
}
?>

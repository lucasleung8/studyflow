<?php
/**
 * Name: Aiden Ly
 * Student Number: 400570383
 * Date Created: April 24, 2025
 * Description: Updates task information or completion status in the database.
 */

session_start();
if (!isset($_SESSION['userID'])) {
    echo json_encode(["status" => "error", "message" => "User not logged in."]);
    exit;
}

include "connect.php";

$taskID = $_POST['task_id'] ?? null;
$completed = isset($_POST['completed']) ? filter_var($_POST['completed'], FILTER_VALIDATE_BOOLEAN) : null;

/**
 * Updates the completion status of a task.
 *
 * @param {Boolean} completed - Whether the task is completed (true/false).
 * @param {Int} taskID - The ID of the task to update.
 * @returns JSON response indicating success or failure.
 */
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

/**
 * Validates and updates task details.
 *
 * @param {String} name - The name of the task.
 * @param {String} description - A description of the task.
 * @param {String} course - The course associated with the task.
 * @param {String} dueDate - The due date of the task in YYYY-MM-DD format.
 * @param {Int} priority - The priority level of the task (1-4).
 * @param {Int} taskID - The ID of the task to update.
 * @returns JSON response indicating success or failure.
 */
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
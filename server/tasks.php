<?php
/**
 * Name: Aiden Ly
 * Student Number: 400570383
 * Date Created: April 2, 2025
 * Description: Handles the creation of new tasks in the database.
*/

include "connect.php";

$name = filter_input(INPUT_POST, "name", FILTER_SANITIZE_SPECIAL_CHARS);
$description = filter_input(INPUT_POST, "description", FILTER_SANITIZE_SPECIAL_CHARS);
$course = filter_input(INPUT_POST, "course", FILTER_SANITIZE_SPECIAL_CHARS);
$duedate = filter_input(INPUT_POST, "duedate", FILTER_SANITIZE_SPECIAL_CHARS);
$priority = filter_input(INPUT_POST, "priority", FILTER_VALIDATE_INT);
$user_id = filter_input(INPUT_POST, "userid", FILTER_VALIDATE_INT);

$duedate_valid = DateTime::createFromFormat('Y-m-d\TH:i', $duedate) !== false;

/**
 * Validates the input fields for creating a task.
 *
 * @param {String} name - The name of the task.
 * @param {String} description - A description of the task.
 * @param {String} course - The course associated with the task.
 * @param {String} duedate - The due date of the task in YYYY-MM-DDTHH:MM format.
 * @param {Int} priority - The priority level of the task (1-4).
 * @param {Int} user_id - The ID of the user creating the task.
 * @returns JSON response indicating success or failure.
 */
if (empty($name) || empty($description) || empty($course) || !$duedate_valid || $priority === null || $user_id === null) {
    header('Content-Type: application/json');
    echo json_encode(["error" => "Invalid input"]);
    exit;
}

try {
    $command = "INSERT INTO tasks (userID, name, description, course, dueDate, priority) VALUES (?, ?, ?, ?, ?, ?)";
    $args = [$user_id, $name, $description, $course, $duedate, $priority];
    $stmt = $dbh->prepare($command);
    $success = $stmt->execute($args);

    if ($success) {
        $response = [
            "status" => "ok",
            "message" => "Task added successfully!"
        ];
    } else {
        $response = ["error" => "Failed to execute query"];
    }
} catch (Exception $e) {
    $response = ["error" => "Something went wrong: {$e->getMessage()}"];
}

header('Content-Type: application/json');
echo json_encode($response);
?>
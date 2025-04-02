<?php
/**
* Names: Raymond, Aiden, Lucas Leung
* Student Numbers:
* Date Created: April 2, 2025
* Description: Studyflow, a productivity tool that helps students transitioning to university with managing their tasks.
* Created by Raymond, Aiden, and Lucas for COMPSCI 1XD3 at McMaster University.
 */
include "connect.php";

$name = filter_input(INPUT_POST, "name", FILTER_SANITIZE_SPECIAL_CHARS);
$description = filter_input(INPUT_POST, "description", FILTER_SANITIZE_SPECIAL_CHARS);
$course = filter_input(INPUT_POST, "course", FILTER_SANITIZE_SPECIAL_CHARS);
$duedate = filter_input(INPUT_POST, "duedate", FILTER_SANITIZE_SPECIAL_CHARS);
$priority = filter_input(INPUT_POST, "priority", FILTER_VALIDATE_INT);
$user_id = filter_input(INPUT_POST, "userid", FILTER_VALIDATE_INT);

$duedate_valid = DateTime::createFromFormat('Y-m-d\TH:i', $duedate) !== false;

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
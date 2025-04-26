<?php
/**
 * Name: Aiden Ly
 * Student Number: 400570383
 * Date Created: April 24, 2025
 * Description: Retrieves tasks for a specific user based on their completion status.
 */

include "connect.php";

header('Content-Type: application/json');

try {
    $user_id = filter_input(INPUT_GET, "userid", FILTER_VALIDATE_INT);
    $completed = filter_input(INPUT_GET, "completed", FILTER_VALIDATE_BOOLEAN);

    if ($user_id === null) {
        echo json_encode(["status" => "error", "message" => "Invalid user ID"]);
        exit;
    }

    $command = "SELECT taskID, name, description, course, dueDate, priority, completed, completedDate 
                FROM tasks WHERE userID = ? AND completed = ?";
    $stmt = $dbh->prepare($command);
    $stmt->execute([$user_id, $completed]);
    $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["status" => "ok", "tasks" => $tasks]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
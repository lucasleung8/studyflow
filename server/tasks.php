<?php
    $name = filter_input(INPUT_POST, "name", FILTER_SANITIZE_SPECIAL_CHARS);
    $description = filter_input(INPUT_POST, "description", FILTER_SANITIZE_SPECIAL_CHARS);
    $course = filter_input(INPUT_POST, "course", FILTER_SANITIZE_SPECIAL_CHARS);
    $duedate = filter_input(INPUT_POST, "duedate", FILTER_SANITIZE_SPECIAL_CHARS);
    $priority = filter_input(INPUT_POST, "priority", FILTER_VALIDATE_INT);
    $user_id = filter_input(INPUT_POST, "userid", FILTER_VALIDATE_INT);

    $command = "INSERT INTO tasks (userID, name, description, course, dueDate, priority) VALUES (?, ?, ?, ?, ?, ?)";
    $args = [$user_id, $name, $description, $course, $duedate, $priority];
    $stmt = $dbh->prepare($command);
    $success = $stmt->execute($args);

?>
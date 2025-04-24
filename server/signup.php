<?php
/**
* Names: Raymond, Aiden, Lucas Leung
* Student Numbers:
* Date Created: April 23, 2025
* Description: Studyflow, a productivity tool that helps students transitioning to university with managing their tasks.
* Created by Raymond, Aiden, and Lucas for COMPSCI 1XD3 at McMaster University.
 */
include "connect.php";

$username = $_POST['username'];
$password = $_POST['password'];
$realName = $_POST['realName'];

if (strlen($username) < 8 || strlen($password) < 8) {
    echo json_encode(["status" => "error", "message" => "Invalid input."]);
    exit;
}

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

$stmt = $dbh->prepare("INSERT INTO login (username, password, realName) VALUES (?, ?, ?)");
$stmt->execute([$username, $hashedPassword, $realName]);

echo json_encode(["status" => "ok", "message" => "User registered successfully."]);
?>
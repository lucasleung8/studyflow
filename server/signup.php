<?php
/**
 * Name: Aiden Ly
 * Student Number: 400570383
 * Date Created: April 23, 2025
 * Description: Handles user registration by validating input and storing user details in the database.
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
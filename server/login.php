<?php
/**
 * Name: Aiden Ly
 * Student Number: 400570383
 * Date Created: April 23, 2025
 * Description: Handles user login by validating credentials and starting a session.
 */

include "connect.php";

$username = $_POST['username'];
$password = $_POST['password'];

$stmt = $dbh->prepare("SELECT * FROM login WHERE username = ?");
$stmt->execute([$username]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user && password_verify($password, $user['password'])) {
    session_start();
    $_SESSION['userID'] = $user['userID'];
    $_SESSION['realName'] = $user['realName'];
    echo json_encode(["status" => "ok", "redirect" => "home.php"]);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid username or password."]);
}
?>
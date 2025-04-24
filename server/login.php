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
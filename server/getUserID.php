<?php
/**
 * Name: Aiden Ly
 * Student Number: 400570383
 * Date Created: April 23, 2025
 * Description: Obtains the user's ID when they log in to be used in other files
 */
session_start();
if (!isset($_SESSION['userID'])) {
    echo json_encode(["status" => "error", "message" => "User not logged in."]);
    exit;
}

echo json_encode(["status" => "ok", "userID" => $_SESSION['userID']]);
?>
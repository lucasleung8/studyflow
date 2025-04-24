<?php
/**
* Names: Raymond, Aiden, Lucas Leung
* Student Numbers:
* Date Created: April 23, 2025
* Description: Studyflow, a productivity tool that helps students transitioning to university with managing their tasks.
* Created by Raymond, Aiden, and Lucas for COMPSCI 1XD3 at McMaster University.
 */
session_start();
if (!isset($_SESSION['userID'])) {
    echo json_encode(["status" => "error", "message" => "User not logged in."]);
    exit;
}

echo json_encode(["status" => "ok", "userID" => $_SESSION['userID']]);
?>
<?php
/**
* Names: Raymond, Aiden, Lucas Leung
* Student Numbers:
* Date Created: April 23, 2025
* Description: Studyflow, a productivity tool that helps students transitioning to university with managing their tasks.
* Created by Raymond, Aiden, and Lucas for COMPSCI 1XD3 at McMaster University.
 */
include "connect.php";

$username = $_GET['username'];

$stmt = $dbh->prepare("SELECT COUNT(*) FROM login WHERE username = ?");
$stmt->execute([$username]);
$count = $stmt->fetchColumn();

echo json_encode(["exists" => $count > 0]);
?>
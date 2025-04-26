<?php
/**
* Name: Aiden Ly
* Student Number: 400570383
* Date Created: April 23, 2025
* Description: Checks if a username already exists in the database.
 */
include "connect.php";

$username = $_GET['username'];

$stmt = $dbh->prepare("SELECT COUNT(*) FROM login WHERE username = ?");
$stmt->execute([$username]);
$count = $stmt->fetchColumn();

echo json_encode(["exists" => $count > 0]);
?>
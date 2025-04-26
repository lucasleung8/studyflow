<?php
/**
 * Name: Aiden Ly
 * Student Number: 400570383
 * Date Created: April 23, 2025
 * Description: Simple file to handle logging out and ending the session
 */
session_start();
session_unset();
session_destroy();
header("Location: ../login.html");
exit;
?>
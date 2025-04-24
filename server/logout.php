<?php
/**
* Names: Raymond, Aiden, Lucas Leung
* Student Numbers:
* Date Created: April 23, 2025
* Description: Studyflow, a productivity tool that helps students transitioning to university with managing their tasks.
* Created by Raymond, Aiden, and Lucas for COMPSCI 1XD3 at McMaster University.
 */
session_start();
session_unset();
session_destroy();
header("Location: ../login.html");
exit;
?>
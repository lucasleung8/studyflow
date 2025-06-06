<?php
/**
 * Include this to connect. Change the dbname to match your database,
 * and make sure your login information is correct after you upload 
 * to csunix or your app will stop working.
 * 
 * Sam Scott, McMaster University, 2025
 */
try {
    $dbh = new PDO(
        "mysql:host=localhost;dbname=leungl16_db",
        "leungl16_local",
        "wfLK[hPsG_tH3vJ7"
    );
} catch (Exception $e) {
    die("ERROR: Couldn't connect. {$e->getMessage()}");
}

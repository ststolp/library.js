<?php
session_start();
require_once("dbConnect.php");
$db = get_db();

$username = $_POST['username'];
$password = $_POST['password'];
$confirm_password = $_POST['confirm_password'];
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

if ($password != $confirm_password) {
        header("Location: Register.php");
} else {
$query = 'INSERT INTO patron (username, password)
        VALUES (:username, :password)';
$statement = $db->prepare($query);
$statement->bindValue(':username', $username);
$statement->bindValue(':password', $hashed_password);
$statement->execute();

header("Location: sign_in.php");
}
die();
?>
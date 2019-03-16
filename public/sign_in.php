<?php
session_start();

?>
<!DOCTYPE html>
<html>
<head>
<link rel="stylesheet" type="text/css" href="lib_style.css">
</head>
<body>
<?php include 'header.php' ?>
<div>
    <form action='Authentication.php' method='post'>
    <label>Username</label>
    <input type='text' name='username' value=""><br>
    <label>Password</label>
    <input type='text' name='password' value=""><br>
    <input class="button" type='submit' value='Sign In'>
    </form>
</div>
<?php include 'footer.php'  ?>
</body>
</html>
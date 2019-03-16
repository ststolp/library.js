<?php
session_start();
$username = $_SESSION['username'];

echo "<div class='header'>
    <h1>Best Library</h1>
    </div>";
echo "<div class='top'>
      <a href='home_library.php'>Home</a>
      <a href='Register.php'>Register</a>";
if ($username == "") {
   echo "<a href='sign_in.php'>Sign in</a>";
}
else {
    echo "<a href='Authentication.php?sign_out=true'>Sign Out</a>";
}
echo "<a href='my_books.php'>My Books</a>";
echo "</div>"
?>
<?php
session_start();
require_once("dbConnect.php");
$db = get_db();
$username = $_SESSION['username'];
if ($username == "") {
    header("Location: home_library.php");
}
?>
 
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <link rel="stylesheet" type="text/css" href="lib_style.css">
</head>
<body>
    <?php
    include 'header.php';
    echo"<div><h2>Your Books</h2>";
  $query_patron_id = "SELECT patron_id FROM patron WHERE username = '$username'";
  $statement_id = $db->prepare($query_patron_id);
  $statement_id->execute();
  $patron_id_array = $statement_id->fetch(PDO::FETCH_ASSOC);
  $patron_id = $patron_id_array['patron_id']; 

   $query = "SELECT b.title, bp.due_date, bp.checked_out FROM books b
    INNER JOIN book_patron bp ON b.book_id = bp.book_id
    INNER JOIN patron p ON p.patron_id = bp.patron_id
    WHERE bp.patron_id = $patron_id";
    $statement = $db->prepare($query);
    $statement->execute();
    echo "<h3>Title                           Due Date</h3>";
    while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
        $title = $row['title'];
        $due_date = $row['due_date'];
        $checked_out = $row['checked_out'];
          echo "<p>$title                       $due_date</p>";
    }
    echo "</div>";
    include 'footer.php';
    die();
?>
</body>
</html>
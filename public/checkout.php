<?php
session_start();
require_once("dbConnect.php");
$db = get_db();
$username = $_SESSION['username'];
if ($username == "") {
    header("Location: library.php");
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
<?php include 'header.php';
$checkout = $_POST['checkout'];
$items_amount = count($checkout); ?>
    <p>Items will be available until the date 
    listed below.</p>
    <h3><?php echo "$items_amount"; ?> item(s) checked out</h3>
    <p>Title                                  Due</p>
<?php



$query = "SELECT patron_id FROM patron WHERE username = '$username'";
$statement = $db->prepare($query);
$statement->execute();
$user_id_array = $statement->fetch(PDO::FETCH_ASSOC);
$user_id = $user_id_array['patron_id'];
$_SESSION['user_id'] = $user_id;

  $query_date = "SELECT CURRENT_DATE AS date";
    $statement_date = $db->prepare($query_date);
    $statement_date->execute();
    $current_date_array = $statement_date->fetch(PDO::FETCH_ASSOC);
   $current_date = $current_date_array['date'];

     $query_due = "SELECT CURRENT_DATE + interval '30' day AS due_date";
    $statement_due = $db->prepare($query_due);
    $statement_due->execute();
    $due_date_array = $statement_due->fetch(PDO::FETCH_ASSOC);
     $due_date = $due_date_array['due_date'];
foreach($checkout as $newBook) {
    $query = "SELECT title FROM books WHERE book_id = '$newBook'";
    $statement = $db->prepare($query);
    $statement->execute();
    $title_array = $statement->fetch(PDO::FETCH_ASSOC);
    $title_of_book = $title_array['title'];
    echo "<p>$title_of_book                            $due_date</p>";

}
echo "<p>$current_date</p>";
foreach($checkout as $newBook) {
    $query = "INSERT INTO book_patron (book_id, patron_id, due_date, checked_out)
    VALUES (:book_id, :patron_id, CURRENT_DATE + interval '30' day, CURRENT_DATE)";
    $statement = $db->prepare($query);
    $statement->bindValue(':book_id', $newBook);
    $statement->bindValue(':patron_id', $user_id);
    $statement->execute();
}
include 'footer.php';
die();

?>
</body>
</html>
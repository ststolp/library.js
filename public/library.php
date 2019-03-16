<?php
require_once("dbConnect.php");

$db = get_db();
$statement = "";
$query = "";
?>
<!DOCTYPE html>
<head>
<link rel="stylesheet" type="text/css" href="lib_style.css">
</head>
<body>
<?php
include 'header.php';
echo "<div><h1>The Library</h1>";
$search = $_POST['search'];
if ($search != "") {
	$method = $_POST['method'];
	if ($method == 'lname') {
		$query = "SELECT b.title, a.fname, a.lname, b.year, b.publisher FROM books b
		INNER JOIN author a ON b.author_id = a.author_id
		WHERE a.lname = '$search'
		ORDER BY b.title";
		$statement = $db->prepare($query);
		$statement->execute();
	} else if ($method == 'title') {
		$query = "SELECT b.title, a.fname, a.lname, b.year, b.publisher FROM books b
		INNER JOIN author a ON b.author_id = a.author_id
		WHERE b.title = '$search'
		ORDER BY b.title";
$statement = $db->prepare($query);
		$statement->execute();
	
	} else if ($method == 'genre') {
       	$query = "SELECT b.title, a.fname, a.lname, b.year, b.publisher FROM books b
		INNER JOIN author a ON b.author_id = a.author_id
		INNER JOIN genre g ON a.genre_id = g.genre_id
		WHERE g.genre = '$search'
		ORDER BY b.title";
$statement = $db->prepare($query);
		$statement->execute();
	
  } else {

	$query = "SELECT b.title, a.fname, a.lname, b.year, b.publisher FROM books b
		INNER JOIN author a ON b.author_id = a.author_id
		WHERE b.title = '$search'
		ORDER BY b.title";
$statement = $db->prepare($query);
		$statement->execute();
	
	}
} else {

   $query = "SELECT b.book_id, b.title, a.fname, a.lname, b.year, b.publisher FROM books b 
   INNER JOIN author a ON b.author_id = a.author_id
   ORDER BY b.title";
   $statement = $db->prepare($query);
   $statement->execute();
}


echo '<form action="checkout.php" method="post">';
  while ($row = $statement->fetch(PDO::FETCH_ASSOC))
  {
	   $book_id = $row['book_id'];
	   $title = $row['title'];
	   $fname = $row['fname'];
	   $lname = $row['lname'];
	   $publisher = $row['publisher'];
	   $year = $row['year'];
	 echo "<p><b>$title</b> by $fname $lname</p><p>Publisher: $publisher, $year.</p>";
	 echo "<label>Check out this book</label><br>";
	 echo "<input type='checkbox' name='checkout[]' value='$book_id'>";
 
  }
  echo '<br><input class="button" type="submit" value="Check Out">';
  echo '</form></div><div>';
?>
<br>
<h2>Add a Book</h2>
<form action="add_book.php" method="post">
	<label>Title</label>
	<input type="text" name="title"><br>

	<?php

	  $genre_statement = $db->prepare('SELECT genre_id, genre FROM genre');
	  $genre_statement->execute();
echo "<h3>Genre</h3>";
	while($row = $genre_statement->fetch(PDO::FETCH_ASSOC))
	  {
		  $genre = $row['genre'];
		  $genre_id = $row['genre_id'];
	
		  echo "<label>$genre</label>";
		  echo "<input type='radio' name='genre_id' value='$genre_id'><br>";
	  }
	  ?>
      <label>Other Genre</label>
        <input type="text" name="new_genre" value=""><br>

	  <?php
	  try 
	{
		  $statement2 = $db->prepare('SELECT author_id, fname, lname FROM author');
		  $statement2->execute();
	 echo "<h3>Author</h3>";
		  while ($row = $statement2->fetch(PDO::FETCH_ASSOC))
		  {
			  $fname = $row['fname'];
			  $lname = $row['lname'];
					 $author_id = $row['author_id'];
				
					 echo "<label>$fname $lname</label>";
			  echo "<input type='radio' name='author' value='$author_id'><br>";
		  }
	}
	catch (PDOException $ex)
	{
       echo 'Error!: ' . $ex->getMessage();
       die();
     }
 ?>
	<label>Other Author</label>
	<input type="text" name="fname" value="">
	<input type="text" name="lname" value=""><br>
	<label>year</label>
	<input type="date" name="year"><br>
	<label>Publisher</label>
	<input type="text" name="publisher"><br>
	<input class="button" type="submit" value="Add book">
	</form>
	</div>
<?php include 'footer.php'; ?>
</body>
</html>
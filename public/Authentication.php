<?php
    session_start();
    require_once("dbConnect.php");
    $db = get_db();

    $sign_out = $_REQUEST['sign_out'];
    if ($sign_out != NULL && $sign_out == true) {
        $_SESSION['username'] = "";

    }
 //   $_SESSION['id'] = 
    $username = $_POST['username'];
    $password = $_POST['password'];

if ($password != "") {

    $query = "SELECT password, patron_id FROM patron WHERE username = '$username'";
    $statement = $db->prepare($query);
    $statement->execute();


    $row = $statement->fetch(PDO::FETCH_ASSOC);
    $queried_password = $row['password'];
    $patron_id = $row['patron_id'];

    if (password_verify($password, $queried_password)) {
        $_SESSION['username'] = $username;
        $query1 = "DELETE FROM book_patron WHERE (CURRENT_DATE) > due_date";
        $statement1 = $db->prepare($query1);
        $statement1->execute();

        header("Location: home_library.php");
        die();
    }
    else 
    {
        $_SESSION['username'] = "";
       header("Location: home_library.php");
       die();
    }
} else {
    $_SESSION['username'] = "";
    header("Location: home_library.php");
    die();
}

?>
<?php 
    if($_SERVER['REQUEST_METHOD'] == 'POST'){
        if(!empty($_POST["username"]) && !empty($_POST["password"])) { 
            include 'dbconfig.php';
            $username = $_POST["username"];
            $password = $_POST["password"];
            
            $conn = db_connect();  // Connect to Database

            $sql = "SELECT * FROM DV_User WHERE login='$username' AND password='$password'";
            
            $result = $conn->query($sql) or die($conn->error);

            // If Successful login
            if ($result->num_rows == 1) { 
                // Fetch User info
                $row = $result->fetch_assoc();  //fetch data from database

                $uid = $row["uid"];
                $username = $row["login"];
                $name = $row["name"];
                $gender = $row["gender"];

                //store user details in cookie
                setcookie("uid", $uid, time() + 172800, "/");    // Cookie will last for 48 hours 
                setcookie("username", $username, time() + 172800, "/");
                setcookie("name", $name, time() + 172800, "/");
                setcookie("gender", $gender, time() + 172800, "/");
                
                header('Content-Type: application/json');
                echo json_encode(array("message" => "SUCCESS: Correct username and password", "username" => $username));
            } else {
                header('HTTP/1.1 500 Internal Server Error');  // HTTP code not equal to 200 for error
                header('Content-Type: application/json; charset=UTF-8');
                die(json_encode(array('message' => 'ERROR: Login incorrect')));
            }
        } else {
            echo "Username and Password not entered correctly!";
        }
    } else {
        echo "You can't access this webpage seperatly!";
    }
?>
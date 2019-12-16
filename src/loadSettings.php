<?php 
    function loadData() {
        include 'dbconfig.php';

        $uid = $_POST["uid"];

        $conn = db_connect();  // Connect to Database

        $sql = "SELECT * FROM 2019F_tapiake.User_Setting WHERE uid='$uid'";

        $result = $conn->query($sql) or die($conn->error);

        if ($result->num_rows == 1){
            $rows = array();
            while($row = $result->fetch_assoc()){
                $rows[] = $row;
            }
            header('Content-Type: application/json');
            echo json_encode(array("message" => "Retreived Settings Successfully", "settings" => json_encode($rows)));
        } else {
            header('HTTP/1.1 500 Internal Server Error');  // HTTP code not equal to 200 for error
            header('Content-Type: application/json; charset=UTF-8');
            die(json_encode(array('message' => 'No setting found')));
        }
    }

    loadData();
?>
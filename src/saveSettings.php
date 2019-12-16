<?php 
    function saveData() {
        include 'dbconfig.php';

        $uid = $_POST["uid"];
        $login = $_POST["login"];
        $AvgWages = $_POST["AvgWages"];
        $EstimatedPopulation = $_POST["EstimatedPopulation"];

        $conn = db_connect();  // Connect to Database

        $sql = "SELECT * FROM 2019F_tapiake.User_Setting WHERE uid='$uid'";

        $result = $conn->query($sql) or die($conn->error);


        if ($result->num_rows == 1) {
            $sql = "UPDATE 2019F_tapiake.User_Setting SET AvgWages='$AvgWages', EstimatedPopulation='$EstimatedPopulation', datetime=NOW() WHERE uid='$uid'";
            
            $result = $conn->query($sql) or die($conn->error);

            header('Content-Type: application/json');
            echo json_encode(array('message' => 'Successfully Updated Saved Settings'));
        } elseif ($result->num_rows == 0) {
            $sql = "INSERT INTO 2019F_tapiake.User_Setting (uid, login, AvgWages, EstimatedPopulation, datetime) VALUES ('$uid', '".$login."','$AvgWages','$EstimatedPopulation', NOW())";

            $result = $conn->query($sql) or die($conn->error);

            header('Content-Type: application/json');
            echo json_encode(array('message' => 'Successfully Saved Settings'));
        } else {
            header('Content-Type: application/json');
            echo json_encode(array('message' => 'Could not save setting'));
        }
    }

    saveData();
?>
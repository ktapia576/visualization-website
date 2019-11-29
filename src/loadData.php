<?php 
    function loadData($database) {
        include 'dbconfig.php';

        $conn = db_connect();  // Connect to Database

        $sql = "SELECT RecordNumber, Zipcode, City, State, EstimatedPopulation, AvgWages, Latitude, Longitude FROM vDV_Data".$database;
                
        $result = $conn->query($sql) or die($conn->error);

        if ($result->num_rows >= 0) {
            $rows = array();
            while($row = $result->fetch_assoc()){
                $rows[] = $row;
            }

            header('Content-Type: application/json');
            echo json_encode(array("message" => "Retreived Data Successfully", "data" => json_encode($rows)));
        } else {
            header('HTTP/1.1 500 Internal Server Error');  // HTTP code not equal to 200 for error
            header('Content-Type: application/json; charset=UTF-8');
            die(json_encode(array('message' => 'Error Retreiving Data from Database')));
        }
    }

    // Check if cookie is set
    if(!isset($_COOKIE['username'])) {
        header('HTTP/1.1 500 Internal Server Error');  // HTTP code not equal to 200 for error
        header('Content-Type: application/json; charset=UTF-8');
        die(json_encode(array('message' => 'User must be logged in to display data')));
    }

    $database = $_POST["database"];

    loadData($database);
?>
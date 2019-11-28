<?php 
    function loadData($database) {
        echo "$fname Refsnes.<br>";
    }

    // Check if cookie is set
    if(!isset($_COOKIE['username'])) {
        header('HTTP/1.1 500 Internal Server Error');  // HTTP code not equal to 200 for error
        header('Content-Type: application/json; charset=UTF-8');
        die(json_encode(array('message' => 'User must be logged in to display data')));
    }

    include 'dbconfig.php';

    $conn = db_connect();  // Connect to Database

    $sql = "SELECT RecordNumber, Zipcode, City, State, EstimatedPopulation, AvgWages, Latitude, Longitude FROM vDV_Data1";
            
    $result = $conn->query($sql) or die($conn->error);

    if ($result->num_rows >= 0) {
        header('Content-Type: application/json');
        echo json_encode(array("message" => "Retreived Data Successfully", "data" => $result));
    } else {
        header('HTTP/1.1 500 Internal Server Error');  // HTTP code not equal to 200 for error
        header('Content-Type: application/json; charset=UTF-8');
        die(json_encode(array('message' => 'Error Retreiving Data from Database')));
    }
?>
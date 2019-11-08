<?php
    function db_connect() {
        $conn;
        
        if(!isset($conn)) {
            $config = parse_ini_file('../config.ini'); // Load database config
            $conn = new mysqli($config['servername'],$config['username'],$config['password'],$config['dbname']);    // Create connection to database using config.ini
        }

        if($conn === false) {
            return mysqli_connect_error(); 
        }
        
        return $conn;
    }
?>
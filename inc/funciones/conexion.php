<?php

$conn = new mysqli('localhost:3307','root','root','uptask');

if($conn->connect_error){
    echo $conn->$connect_error;
}

//Para que se muestren acentos, ñ's , etc en la base de datos
$conn->set_charset('utf8');
<?php

//Obtiene la pagina actual que se ejecuta
function obtenerPaginaActual(){
    //Nos regresara el nombre del archivo actual
    $archivo = basename($_SERVER['PHP_SELF']);
    //Remplaza una parte del string (.php por nada para que )
    $pagina = str_replace(".php","",$archivo);
    return $pagina;
}

/* Consultas */


/* Obtener todos los proyectos*/
function obtenerProyectos(){
    include 'conexion.php';
    try{
        return $conn->query('SELECT id,nombre FROM proyectos');

    }catch(Exception $e){
        echo 'Error: ' . $e->getMessage();
        return false;

    }
}

function obtenerNombreProyecto($id = null){
    include 'conexion.php';
    try{
    return $conn->query("SELECT nombre FROM proyectos WHERE id={$id}");

    }catch(Exception $e){
        echo 'Error: ' . $e->getMessage();
        return false;

    }

}


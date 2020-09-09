<?php

function obtenerPaginaActual(){
    //Nos regresara el nombre del archivo actual
    $archivo = basename($_SERVER['PHP_SELF']);
    //Remplaza una parte del string (.php por nada para que )
    $pagina = str_replace(".php","",$archivo);
    return $pagina;
}


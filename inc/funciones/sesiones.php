<?php

//Autenticar al usuario despues de ejecutar la funcion de revisar usuario
function usuario_autenticado(){
    //Si no esta agregada la sesion se va a redireccionar al login 
    if(!revisar_usuario() ){
        header('Location:login.php');
        exit();
    }

}

//Revisar que el usuario se haya loggeado
function revisar_usuario(){
    //Retorna si la sesion existe
    return isset($_SESSION['nombre']);
}

//Se arranca una sesion y permitira ir de una pagina a otra sin logearse todo el tiempo
session_start();
//Llamar la funcion 
usuario_autenticado();

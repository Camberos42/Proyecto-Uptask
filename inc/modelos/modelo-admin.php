<?php
    //Json encode nos ayudara a mandar datos de js a php y viseverza (como transporte)
    //die(json_encode($_POST));

    $usuario = $_POST['usuario'];
    $password = $_POST['password'];
    $accion = $_POST['accion'];

    if($accion === 'crear'){
        //Codigo para crear a los administradores

        //Almacenar los passwords de forma hasheada
        $opciones = array(
            //puede ser 12 o 10 (10 por si se almacenaran millones de usuarios y consumir menons en el servidor)
            'cost' => 12
        );
        //Se usara la funcion que hashea la contraseña
        $hash_password = password_hash($password, PASSWORD_BCRYPT, $opciones);
       
        //Importar la conexion
        include '../funciones/conexion.php';
        try{
            //Realizar la consulta a la base de datos
            $stmt = $conn->prepare("INSERT INTO usuarios (usuario, password) VALUES (?, ?) ");
            $stmt->bind_param('ss', $usuario, $hash_password);
            $stmt->execute();
            //Construir una respuesta personalizada
            //Se pone affected-rows mayor a 0 porque si es es el caso significa que si se inserto algo, de lo contrario marcaria -1
            if($stmt->affected_rows > 0){
                $respuesta = array(
                    'respuesta' => 'correcto',
                    'id_insertado' => $stmt->insert_id,
                    'tipo' => $accion
                );
            }else{
                $respuesta = array(
                    'respuesta' => 'error'
                );
            }
            
            $stmt->close();
            $conn->close();

        }catch(Exception $e){
            //En caso de un error, tomar la excepcion
             //Se crea un arreglo asosiativo porque se retornara como json
            $respuesta = array(
                'pass' => $e->getMessage()
            );

        }

        echo json_encode($respuesta);

    }

    
    if($accion === 'login'){
         //Codigo para loggear a los administradores

         //Importar la conexion
        include '../funciones/conexion.php';

        try{
            //Seleccionar el administrador de la base de datos
            $stmt = $conn->prepare("SELECT usuario, id, password FROM usuarios WHERE usuario = ?");
            $stmt->bind_param('s', $usuario);
            $stmt->execute();
            //Loguear el usuario (se crean variables de usuario, id y password)
            $stmt->bind_result($nombre_usuario, $id_usuario, $pass_usuario);
            $stmt->fetch();
            //Si existe el usuario regresar una respuesta en caso de que no que lo avise
            if($nombre_usuario){
                //Si el usuario existe verificar el password (primer parametro es el password ingresado y el segundo el hasheado(el que esta en la bd))
                if(password_verify($password,$pass_usuario)){
                    //Iniciar la sesion (para poder ejecutar las funciones dentro del archivo sesiones.php)
                    session_start();
                    $_SESSION['nombre'] = $usuario;
                    $_SESSION['id'] = $id_usuario;
                    $_SESSION['login'] = true;
                    //Login correcto
                    $respuesta = array(
                        'respuesta' => 'correcto',
                        'nombre' => $nombre_usuario,
                        'tipo' => $accion
                    );

                }else{
                    //Login incorrecto, enviar error
                    $respuesta = array(
                        'respuesta' => 'Password Incorrecto',
                    );
                }

            }else{
                $respuesta = array(
                    'respuesta' => 'Usuario no existe'
                );
            }
           
            $stmt->close();
            $conn->close();

        }catch(Exception $e){
            //En caso de un error, tomar la excepcion
             //Se crea un arreglo asosiativo porque se retornara como json
            $respuesta = array(
                'pass' => $e->getMessage()
            );
        }

        echo json_encode($respuesta);
        
    }



?>
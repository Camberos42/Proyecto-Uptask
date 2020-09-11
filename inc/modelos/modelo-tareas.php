<?php

    //echo json_encode($_POST);
    $accion = $_POST['accion'];
    $id_proyecto = (int) $_POST['id_proyecto'];
    $tarea = $_POST['tarea'];
    $estado = $_POST['estado'];
    $id_tarea = (int) $_POST['id']; //Razon por la que se le puso ud_proyecto y id solo (para no mezclarse)

    if($accion === 'crear'){
        //Importar la conexion
        include '../funciones/conexion.php';
        try{
            //Realizar la consulta a la base de datos
            $stmt = $conn->prepare("INSERT INTO tareas (nombre, id_proyecto) VALUES (?,?) ");
            $stmt->bind_param('si', $tarea,$id_proyecto);
            $stmt->execute();
            //Construir una respuesta personalizada
            //Se pone affected-rows mayor a 0 porque si es es el caso significa que si se inserto algo, de lo contrario marcaria -1
            if($stmt->affected_rows > 0){
                $respuesta = array(
                    'respuesta' => 'correcto',
                    'id_insertado' => $stmt->insert_id,
                    'tipo' => $accion,
                    'tarea' => $tarea
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
                'error' => $e->getMessage()
            );
    
        }
    
        echo json_encode($respuesta);
    
    }
    if($accion === 'actualizar'){
        //echo json_encode($_POST);
        //Importar la conexion
        include '../funciones/conexion.php';
        try{
            //Realizar la consulta a la base de datos
            $stmt = $conn->prepare("UPDATE tareas set estado = ? WHERE id = ? ");
            $stmt->bind_param('ii', $estado,$id_tarea);
            $stmt->execute();
            //Construir una respuesta personalizada
            //Se pone affected-rows mayor a 0 porque si es es el caso significa que si se inserto algo, de lo contrario marcaria -1
            if($stmt->affected_rows > 0){
                $respuesta = array(
                    'respuesta' => 'correcto',
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
                'error' => $e->getMessage()
            );
    
        }
    
        echo json_encode($respuesta);
    }

    if($accion === 'eliminar'){
        //echo json_encode($_POST);
        //Importar la conexion
        include '../funciones/conexion.php';
        try{
            //Realizar la consulta a la base de datos
            $stmt = $conn->prepare("DELETE from tareas WHERE id = ? ");
            $stmt->bind_param('i',$id_tarea);
            $stmt->execute();
            //Construir una respuesta personalizada
            //Se pone affected-rows mayor a 0 porque si es es el caso significa que si se inserto algo, de lo contrario marcaria -1
            if($stmt->affected_rows > 0){
                $respuesta = array(
                    'respuesta' => 'correcto',
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
                'error' => $e->getMessage()
            );
    
        }
    
        echo json_encode($respuesta);
    }

?>
eventlisteners();
//lista de proyectos
var listaProyectos = document.querySelector('ul#proyectos');

function eventlisteners() {
    //Document ready
    document.addEventListener('DOMContentLoaded', function() {
        actualizarProgreso();
    });

    //boton para crear el proyecto
    document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);

    //boton para una nueva tarea
    document.querySelector('.nueva-tarea').addEventListener('click', agregarTarea);

    //Botones para las acciones de tareas
    document.querySelector('.listado-pendientes').addEventListener('click', accionesTareas);
}

function nuevoProyecto(e) {
    e.preventDefault();
    console.log('Presionaste en nuevo evento');

    //Crear un input para el nombre del nuevo proyecto
    var nuevoProyecto = document.createElement('li');
    nuevoProyecto.innerHTML = '<input type="text" id="nuevo-proyecto">';
    listaProyectos.appendChild(nuevoProyecto);

    // seleccionar el ID con el nuevoProyecto
    var inputNuevoProyecto = document.querySelector('#nuevo-proyecto');

    //Al presionar enter crear el proyecto
    inputNuevoProyecto.addEventListener('keypress', function(e) {
        var tecla = e.which || e.keyCode;

        if (tecla === 13) {
            //console.log('Presionaste Enter');
            guardarProyectoDB(inputNuevoProyecto.value);
            //Eliminar el input del nuevo proyecto ya que se haya guardado el nuevo nombre (no es necesario que siga)
            listaProyectos.removeChild(nuevoProyecto);

        }

    });
}

function guardarProyectoDB(NombreProyecto) {
    //console.log(NombreProyecto);


    //Crear llamado Ajax
    var xhr = new XMLHttpRequest();

    //Enviar datos por FormData
    var datos = new FormData();
    datos.append('proyecto', NombreProyecto);
    datos.append('accion', 'crear');

    //Abrir la conexiono
    xhr.open('POST', 'inc/modelos/modelo-proyecto.php', true);

    //En la carga
    xhr.onload = function() {
        if (this.status === 200) {
            //console.log(JSON.parse(xhr.responseText));

            //Obtener datos de la respuesta (del objeto que se crea (variables de nombre_proyecto, id, respuesta y tipo))
            var respuesta = JSON.parse(xhr.responseText),
                proyecto = respuesta.nombre_proyecto,
                id_proyecto = respuesta.id_insertado,
                tipo = respuesta.tipo,
                resultado = respuesta.respuesta;

            //Comprobar insercion
            if (resultado === 'correcto') {
                //Fue exitoso , mostrar alerta
                if (tipo === 'crear') {
                    //Si se creo un nuevo proyecto

                    //Inyectar en el HTML
                    var nuevoProyecto = document.createElement('li');
                    nuevoProyecto.innerHTML = `
                        <a href="index.php?id_proyecto=${id_proyecto}" id="proyecto:${id_proyecto}"> 
                            ${proyecto}
                        </a>
                    `;
                    //Agregar al html
                    listaProyectos.appendChild(nuevoProyecto);

                    //Enviar alerta
                    swal({
                            title: 'Proyecto Creado',
                            text: 'El proyecto ' + proyecto + ' se creo correctamente.',
                            type: 'success',
                            allowOutsideClick: false //<-- Bloquea la interacción fuera de la alerta
                        })
                        .then(resultado => {
                            //Redireccionar a la nueva URL (ahorrarle un clik al usuario)
                            if (resultado.value) {
                                window.location.href = 'index.php?id_proyecto=' + id_proyecto;
                            }
                        })
                }

            } else {
                //Puede ser que se actualizo o borro el proyecto
            }
        } else {
            //Hubi un error, mostrar alerta
            swal("Error", "Hubo un error", "error");
        }
    }

    //Enviar el Request
    xhr.send(datos);

}

//Agregar una tarea nueva al proyecto actual
function agregarTarea(e) {
    e.preventDefault();
    console.log('Presionaste en boton de agregar tarea');
    var nombreTarea = document.querySelector('.nombre-tarea').value;

    //Validar que el campo tenga algo escrito
    if (nombreTarea === '') {
        //Hubi un error, mostrar alerta
        swal("Error", "Una tarea no puede ir vacia", "error");
    } else {
        //La tarea tiene algo, insertar en PHP

        //Crear llamado Ajax
        var xhr = new XMLHttpRequest();

        //Enviar datos por FormData
        var datos = new FormData();
        datos.append('tarea', nombreTarea);
        datos.append('accion', 'crear');
        datos.append('id_proyecto', document.querySelector('#id_proyecto').value);

        //Abrir la conexiono
        xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

        //Ejecutarlo y respuesta
        xhr.onload = function() {
            if (this.status === 200) {
                var respuesta = JSON.parse(xhr.responseText);
                //console.log(respuesta);
                var resulturado = respuesta.respuesta,
                    id_insertado = respuesta.id_insertado,
                    tarea = respuesta.tarea,
                    tipo = respuesta.tipo;

                if (resulturado === "correcto") {
                    //Se agrego correctamente
                    if (tipo === "crear") {
                        //Mandar una alerta de que se creo correctamente la tarea
                        swal({
                            title: 'Tarea Creada',
                            text: 'La tarea:  "' + tarea + '" se creo correctamente.',
                            type: 'success',
                            allowOutsideClick: false //<-- Bloquea la interacción fuera de la alerta
                        })

                        //Seleccionar el parrafo con la lista vacia (se agrega All para verificar que haya algun elemento)
                        var parrafoListaVacia = document.querySelectorAll('.lista-vacia');
                        if (parrafoListaVacia.length > 0) {
                            document.querySelector('.lista-vacia').remove(); // Para remover texto de "No hay tareas para este proyecto"
                        }

                        //Construir en el template
                        var nuevaTarea = document.createElement('li');

                        //Agregamos el id
                        nuevaTarea.id = 'tarea:' + id_insertado;

                        //Agregar la clase tarea (ya que contiene varios estilos)
                        nuevaTarea.classList.add("tarea");

                        //Construir el html
                        nuevaTarea.innerHTML = `
                            <p>Tarea: ${tarea}</p>
                            <div class="acciones">
                                <i class="far fa-check-circle"></i>
                                <i class="fas  fa-trash"></i>
                            </div>
                        `;

                        //Insertarlo en el html (div de la clase lista-de pendienes (en el ul))
                        var listado = document.querySelector('.listado-pendientes ul');
                        listado.appendChild(nuevaTarea);

                        //Limpiar el formulario
                        document.querySelector('.agregar-tarea').reset();

                        //Actualizar el progreso
                        actualizarProgreso();

                    }
                } else {
                    //Hubo un error
                    swal("Error", "Hubo un error", "error");
                }
            }
        }

        //Enviar el Request
        xhr.send(datos);


    }

}

//Cambia el estado de las tareas o las elimina
function accionesTareas(e) {
    e.preventDefault();
    //console.log("Click en listado");
    //console.log(e.target); //Muestra a que elemento le estoy dando click

    if (e.target.classList.contains("fa-check-circle")) {
        //console.log("hiciste click en el circulo");
        if (e.target.classList.contains("completo")) {
            //remover la clase al presionar el icono
            e.target.classList.remove("completo");
            cambiarEstadoTarea(e.target, 0);
        } else {
            //agregar la clase al presionar el icono (se pondra en verde)
            e.target.classList.add("completo");
            cambiarEstadoTarea(e.target, 1);
        }
    }
    if (e.target.classList.contains("fa-trash")) {
        //console.log("hiciste click en el icono de borrar");
        swal({
            title: "¿Estas seguro(a)?",
            text: "Esta accion no se puede deshacer",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Borrar!!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.value) {

                var tareaEliminar = e.target.parentElement.parentElement;
                //Borrar de la BD
                eliminarTareaBD(tareaEliminar);

                //Borrar del html
                //console.log(tareaEliminar);
                tareaEliminar.remove();

                swal(
                    'Eliminado',
                    'La tarea ha sido eliminada!',
                    'success'
                );
            }
        })
    }
}
//Completa o descompleta una tarea
function cambiarEstadoTarea(tarea, estado) {
    //Parent dos veces para subir al elemento padres hasta llegar al li
    //console.log(tarea.parentElement.parentElement.id.split(":")); //id para acceder a su valor y split para mostrar solo el 1 (en vez de tarea:1)
    var idTarea = tarea.parentElement.parentElement.id.split(":");
    //console.log(idTarea[1]) //Para acceder a la pura tarea

    //Crear llamado Ajax
    var xhr = new XMLHttpRequest();

    //Enviar datos por FormData
    var datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion', 'actualizar');
    datos.append('estado', estado);
    //console.log(estado);

    //Abrir la conexion
    xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

    //Ejecutarlo y respuesta
    xhr.onload = function() {
        if (this.status === 200) {
            var respuesta = JSON.parse(xhr.responseText);
            //console.log(respuesta);

            //Actualizar el progreso
            actualizarProgreso();
        }
    }

    //Enviar el Request
    xhr.send(datos);

}

//Eliminar las tareas de las bases de datos
function eliminarTareaBD(tarea) {
    //console.log(tarea);
    var idTarea = tarea.id.split(":");
    //console.log(idTarea[1]) //Para acceder a la pura tarea

    //Crear llamado Ajax
    var xhr = new XMLHttpRequest();

    //Enviar datos por FormData
    var datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion', 'eliminar');
    //console.log(estado);

    //Abrir la conexion
    xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

    //Ejecutarlo y respuesta
    xhr.onload = function() {
        if (this.status === 200) {
            var respuesta = JSON.parse(xhr.responseText);
            console.log(respuesta);

            //Comprobar que haya tareas restantes
            var listaTareasRestantes = document.querySelectorAll("li.tarea");
            if (listaTareasRestantes.length == 0) {
                document.querySelector(".listado-pendientes ul").innerHTML = "<p class='lista-vacia'>No hay tareas para este proyecto</p>";
            }

            //Actualizar el progreso
            actualizarProgreso();


        }
    }

    //Enviar el Request
    xhr.send(datos);
}

//Actualiza el avance de progreso
function actualizarProgreso() {
    //Obtener todas las tareas
    const tareas = document.querySelectorAll("li.tarea");
    console.log(tareas);

    //Obtener todas las tareas completadas
    const tareasCompletadas = document.querySelectorAll("i.completo");

    //Calcular el avance
    const avance = Math.round((tareasCompletadas.length / tareas.length) * 100);
    //console.log(avance);

    //Asignar el avance a la barra
    const porcentaje = document.querySelector("#porcentaje");
    porcentaje.style.width = avance + "%";

    if (avance === 100) {
        swal({
            title: 'Proyecto Terminado',
            text: 'Ya no hay tareas pendientes.',
            type: 'success',
            allowOutsideClick: false //<-- Bloquea la interacción fuera de la alerta
        });
    }

    //Agregarle texto del avance a la barra
    document.getElementById('porcentaje-texto').innerHTML = avance + "%";


}
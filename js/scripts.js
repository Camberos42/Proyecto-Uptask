eventlisteners();
//lista de proyectos
var listaProyectos = document.querySelector('ul#proyectos');

function eventlisteners() {
    //boton para crear el proyecto
    document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);

    //boton para una nueva tarea
    document.querySelector('.nueva-tarea').addEventListener('click', agregarTarea);
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

    //aAbrir la conexiono
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
                        <a href="index.php?id_proyecto=${id_proyecto}" id="${id_proyecto}"> 
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
    }

}
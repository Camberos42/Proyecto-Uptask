eventlisteners();

function eventlisteners() {
    document.querySelector('#formulario').addEventListener('submit', validarRegistro);
}

function validarRegistro(e) {
    e.preventDefault();

    //Leer lo que hay en los inputs de usuario y password
    var usuario = document.querySelector('#usuario').value,
        password = document.querySelector('#password').value;
    //El formulario login y crear-cuenta tendran un tipo diferente
    tipo = document.querySelector('#tipo').value;

    //validar que haya algo escrito
    if (usuario === "" || password === "") {
        //Uso de sweetalert para un mejor diseño de alerta
        swal("Error de inicio de sesion!", "Ambos campos son obligatorios", "error");
    } else {
        //En ambos campos hay algo Se ejecutara Ajax
        //swal("Correcto!", "Escribiste ambos campos", "success");

        //FormData: Para Estructurar datos con una llave y un valor.. Seran los datos que se envian al servidor
        datos = new FormData();
        //LLave y el valor que se almacenara en la variable. 
        datos.append("usuario", usuario);
        datos.append("password", password);
        datos.append("accion", tipo);

        //Acceder a un elemento en especifico
        //console.log(datos.get("usuario"));

        //Crear el llamado Ajax (el objeto)
        var xhr = new XMLHttpRequest();

        //Abrir la conexion 
        xhr.open('POST', 'inc/modelos/modelo-admin.php', true);

        //Retorno de datos
        xhr.onload = function() {
            if (this.status === 200) {
                //Convertir de json a un objeto en javascript y acceder a los datos (ya que no es un string)
                var respuesta = JSON.parse(xhr.responseText);
                console.log(respuesta);

                //Si la respuesta es correcta (1ra respuesta es la variable en js y la 2da respuesta el valor que se optiene del arreglo asocia del php)
                if (respuesta.respuesta === 'correcto') {
                    //Si es un nuevo usuario
                    if (respuesta.tipo === 'crear') {
                        swal("Usuario Creado", "El usuario se creo correctamente", "success");
                    } else if (respuesta.tipo === 'login') {
                        swal({
                                title: 'Login Correcto',
                                text: 'Presiona OK para continuar',
                                type: 'success',
                                allowOutsideClick: false //<-- Bloquea la interacción fuera de la alerta
                            })
                            .then(resultado => {
                                if (resultado.value) {
                                    window.location.href = 'index.php';
                                }
                            })
                    }
                } else {
                    //Si hubo un error
                    swal("Error", "Hubo un error", "error");
                }
            }
        }

        //enviar la peticion
        xhr.send(datos);

    }


}
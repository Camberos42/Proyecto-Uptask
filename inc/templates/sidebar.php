<aside class="contenedor-proyectos">
            <div class="panel crear-proyecto">
                <a href="#" class="boton">Nuevo Proyecto <i class="fas fa-plus"></i> </a>
            </div>

            <div class="panel lista-proyectos">
                <h2>Proyectos</h2>
                <ul id="proyectos">
                    <?php
                        //Nos retornara un arreglo con los proyectos (id y nombre)
                        $proyectos = obtenerProyectos();
                        //Imprimir cada proyecto 
                        if($proyectos){
                            foreach($proyectos as $proyecto){
                                /*echo "<pre>";
                                    var_dump($proyecto);
                                echo "</pre>";  */ ?>
                                <li>
                                    <a href="index.php?id_proyecto=<?php echo $proyecto['id']?>" id="proyecto:<?php echo $proyecto['id']?>"> 
                                        <?php echo $proyecto['nombre']?>
                                    </a>
                                </li>

                        <? }
                        }

                   ?>
                </ul>
            </div>
        </aside>
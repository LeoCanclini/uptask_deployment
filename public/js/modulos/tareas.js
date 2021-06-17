import axios from "axios";
import Swal from 'sweetalert2';

import { actualizarAvance } from '../funciones/avance';

const tareas = document.querySelector('.listado-pendientes');

if (tareas) {
    tareas.addEventListener('click', e => {
        if (e.target.classList.contains('fa-check-circle')) {
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;

            console.log(idTarea);

            // request hacia /tareas/:id
            const url = `${location.origin}/tareas/${idTarea}`;

            axios.patch(url, { idTarea })
                .then(function(respuesta) {
                    if (respuesta.status === 200) {
                        icono.classList.toggle('completo');

                        actualizarAvance();
                    }
                })
        }

        if (e.target.classList.contains('fa-trash')) {

            const tareaHTML = e.target.parentElement.parentElement,
                idTarea = tareaHTML.dataset.tarea;

            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger'
                },
                buttonsStyling: false
            })

            swalWithBootstrapButtons.fire({
                title: 'Deseas borrar esta tarea?',
                text: "Una ves borrado no podra recuperar la tarea!!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, Borrar',
                cancelButtonText: 'Cancelar',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    const url = `${location.origin}/tareas/${idTarea}`;

                    //enviar el delete por medio de axios
                    axios.delete(url, { params: { idTarea } })
                        .then(function(respuesta) {
                            if (respuesta.status === 200) {
                                //console.log(respuesta);

                                //eliminar el nodo
                                tareaHTML.parentElement.removeChild(tareaHTML);

                                //opcional una alerta
                                Swal.fire(
                                    'Tarea Eliminada',
                                    respuesta.data,
                                    'success'
                                )

                                actualizarAvance();

                            }
                        });
                }
            })

        }
    });
}

export default tareas;
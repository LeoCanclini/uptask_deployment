import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');

if (btnEliminar) {
    btnEliminar.addEventListener('click', e => {
        const urlProyecto = e.target.dataset.proyectoUrl;

        // console.log(urlProyecto);
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
        })

        swalWithBootstrapButtons.fire({
            title: 'Deseas borrar este proyecto?',
            text: "Una ves borrado no podra recuperar el proyecto!!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, Borrar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                //enviar peticion a axios
                const url = `${location.origin}/proyectos/${urlProyecto}`;

                axios.delete(url, { params: { urlProyecto } })
                    .then(function(respuesta) {
                        console.log(respuesta);

                        swalWithBootstrapButtons.fire(
                            'Proyecto Eliminado',
                            respuesta.data,
                            'success'
                        );
                        // redireccionar al inicio
                        setTimeout(() => {
                            window.location.href = '/'
                        }, 3000);
                    })
                    .catch(() => {
                        Swal.fire({
                            type: 'error',
                            title: 'Hubo un error',
                            text: 'No se pudo eliminar el proyecto'
                        });
                    })

            } else if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
            ) {
                swalWithBootstrapButtons.fire(
                    'Cancelled',
                    'Your imaginary file is safe :)',
                    'error'
                )
            }
        })
    })
}
export default btnEliminar;
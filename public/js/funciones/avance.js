import Swal from 'sweetalert2';

export const actualizarAvance = () => {
    // seleccionar las tareas existentes
    const tareas = document.querySelectorAll('li.tarea');

    if (tareas.length) {
        //seleccionar las tareas completadas
        const tareasCompletas = document.querySelectorAll('i.completo');

        //calcular el avance //se utiliza queryselectorall entonces se usa length para saber cuantas tareas completas son
        const avance = Math.round((tareasCompletas.length / tareas.length) * 100);

        //mostrar el avance     
        const porcentaje = document.querySelector('#porcentaje');
        porcentaje.style.width = avance + '%';

        if (avance === 100) {
            Swal.fire(
                'Completaste el Proyecto',
                'Felicidades, has terminados tus tareas',
                'success'
            )
        }
    }


}
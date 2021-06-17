const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.proyectosHome = async(req, res) => {

    //console.log(res.locals.usuario);

    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: { usuarioId } }); //muestra todos los proyectos

    res.render('index', {
        nombrePagina: 'Proyectos',
        proyectos
    });
}

//send = envia lo que se encuentra dentro de las ''. 
//como se van a mostrar los datos.
//render = imprime html y toma como parametro la vista.

exports.formularioProyecto = async(req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: { usuarioId } });

    res.render('nuevoProyecto', {
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    });
}

exports.nuevoProyecto = async(req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: { usuarioId } });
    //Enviar a la consola lo que el usuario escriba.
    //console.log(req.body);

    //validar que tengamos algo en el input
    const nombre = req.body.nombre;

    let errores = [];

    if (!nombre) {
        errores.push({ 'texto': 'Agrega un Nombre al Proyecto' });
    }

    //si hay errores
    if (errores.length > 0) {
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    } else {
        //no hay errores
        //Insertar en la BD
        const usuarioId = res.locals.usuario.id;
        await Proyectos.create({ nombre, usuarioId });
        res.redirect('/');
    }

}

exports.proyectoPorUrl = async(req, res, next) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({ where: { usuarioId } });


    const proyectoPromise = Proyectos.findOne({
        where: {
            url: req.params.url,
            usuarioId
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]); //Se ejecute todo a la ves

    //consultar tarea del proyecto actualizarProyecto
    const tareas = await Tareas.findAll({
        where: {
            proyectoId: proyecto.id
        },
        /*include: [
            { model: Proyectos }
        ]*/
    });

    if (!proyecto) return next();

    //render a la vista
    res.render('tareas', {
        nombrePagina: 'Tareas del Proyecto',
        proyecto,
        proyectos,
        tareas
    });

    //res.send(req.params.url);  //asi se muestra la url
}

exports.formularioEditar = async(req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({ where: { usuarioId } });

    const proyectoPromise = Proyectos.findOne({
        where: {
            id: req.params.id,
            usuarioId
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    //render a la vista
    res.render('nuevoProyecto', {
        nombrePagina: 'Editar Proyecto',
        proyectos,
        proyecto
    })
}

exports.actualizarProyecto = async(req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: { usuarioId } });
    //Enviar a la consola lo que el usuario escriba.
    //console.log(req.body);

    //validar que tengamos algo en el input
    const nombre = req.body.nombre;

    let errores = [];

    if (!nombre) {
        errores.push({ 'texto': 'Agrega un Nombre al Proyecto' });
    }

    //si hay errores
    if (errores.length > 0) {
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    } else {
        //no hay errores
        //Insertar en la BD
        await Proyectos.update({ nombre: nombre }, { where: { id: req.params.id } });
        res.redirect('/');
    }
}

exports.eliminarProyecto = async(req, res, next) => {
    //req, query o params
    //console.log(req.query);
    const { urlProyecto } = req.query;

    const resultado = await Proyectos.destroy({
        where: { url: urlProyecto }
    });

    if (!resultado) {
        return next();
    }

    res.status(200).send('Proyecto Eliminado Correctamente');
}
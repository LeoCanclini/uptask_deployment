const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const Sequelize = require('sequelize');
const Op = Sequelize.Op
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/', //cuando el usuario sea autenticado donde ira
    failureRedirect: '/iniciar-sesion', //cuando de un error vuelve a iniciar sesión
    failureFlash: true,
    badRequestMessage: 'Ambos Campos son Obligatorios'
});

//funcion para revisar si el usuario esta logueado o no
exports.usuarioAutenticado = (req, res, next) => {
    //si el usuario esta autenticado, adelante
    if (req.isAuthenticated()) {
        return next();
    }
    //sino esta autenticado, redirigir al formulario
    return res.redirect('/iniciar-sesion');
}

//funcion para cerrar sesion
exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion'); //al cerrar sesion nos lleva al login
    })
}

//Genera un token si el usuario es valido
exports.enviarToken = async(req, res) => {
    //verificaqr que un usuario exista
    const usuario = await Usuarios.findOne({ where: { email: req.body.email } });

    //si no existe el usuario
    if (!usuario) {
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/reestablecer');
    }


    // usuario existe
    usuario.token = crypto.randomBytes(20).toString('hex'); //genera un token
    usuario.expiracion = Date.now() + 3600000; //genera una fecha actual por una hora

    // guardarlos en la base de datos
    await usuario.save();

    //url de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

    //envia el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'reestablecer-password'
    });

    //terminar la accion
    req.flash('correcto', 'Se envio un mensaje a tu correo');
    res.redirect('/iniciar-sesion');
}

exports.validarToken = async(req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    });

    //si no hay usuario
    if (!usuario) {
        req.flash('error', 'No Valido');
        res.redirect('/reestablecer');
    }

    //formulario para generar el password
    res.render('resetPassword', {
        nombrepagina: 'Reestablecer Contraseña'
    });
}

//cambia el password por uno nuevo
exports.actualizarPassword = async(req, res) => {

    //verifica el token valido pero tambien la fecha de expiracion
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte]: Date.now()
            }
        }
    });

    //verificamos si el usuario existe
    if (!usuario) {
        req.flash('erorr', 'No valido');
        res.redirect('/reestablecer');
    }

    // hashear el nuevo password

    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;

    //guardamos el nuevo password
    await usuario.save();

    req.flash('correcto', 'Tu password se ha modificado correctamente');
    res.redirect('/iniciar-sesion');

}
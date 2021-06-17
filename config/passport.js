const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//referencia al modelo donde vamos a autenticar
const Usuarios = require('../models/Usuarios');

//local strategy - Login con credenciales propios (usuario y password)
passport.use(
    new LocalStrategy(
        // por default passport espera un usuario y password
        {
            usernameField: 'email',
            passwordField: 'password'

        },
        async(email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: {
                        email,
                        activo: 1
                    }
                });
                //el usuario existe, password incorrecto
                if (!usuario.verificarPassword(password)) {
                    return done(null, null, {
                        message: 'Password incorrecto'
                    })
                }
                //el email existe, y el pasword es correcto
                return done(null, usuario);
            } catch (error) {
                // ese usuario no existe
                return done(null, null, {
                    message: 'Esa cuenta no existe'
                })
            }
        }
    )
);

//serializar el usuario //ponerlo junto como objeto
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);

});

//deserializar el usuario //accede a los valores internos del objeto
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
});

//exportar
module.exports = passport;
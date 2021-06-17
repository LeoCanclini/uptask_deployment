//import express from 'express';   //no lo soporta express
const express = require('express'); //servidor de express
const routes = require('./routes'); //importamos el routes
const path = require('path'); //path lo que hace es acceder y leer los archivos
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

//importar las variables
require('dotenv').config({ path: 'variables.env' });


//helpers con algunas funciones
const helpers = require('./helpers');

//crear la conexion a la bd
const db = require('./config/db');

//importar el modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
    .then(() => console.log('Conectado al Servidor'))
    .catch(error => console.log(error));

//crear una app de expres
const app = express();

//Donde cargar los archivos estaticos
app.use(express.static('public'));


//Habilitar Pug //set: agregar un valor
app.set('view engine', 'pug');

//habilitar bodyParser para leer datos del formulario 
app.use(bodyParser.urlencoded({ extended: true }));

//agregamos express validator a toda la aplicacion
app.use(expressValidator());

//añadir la carpeta de las vistas //dirname: retorna el directorio principal
app.set('views', path.join(__dirname, './views'));

//agregar flash messages
app.use(flash());

app.use(cookieParser());

//agregar sesiones que nos permite navegar entre distintas paginas sin volvernos a autenticar
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//pasar vardump a la aplicacion
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump; //locals crea variables que pueden ser consumidos por todos los archivos
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user } || null;
    next();
});



app.use('/', routes());


////////////////////////////////////////////////////////////////////////////////////

//estas son funciones que tiene la biblioteca express
//que se vera cuando entres a la pagina
//con use accedes a ciertas partes del express
//request= cuando das enter le das un request al servidor es la peticion que yo estoy enviando
//respont= es la respuesta del servidor lo que te esta mostrando
// '/' = aqui se ingresa la ruta


///////////////////////////////////////////////////////////////////////
/* recomendable utilizarla en una carpeta nueva en este caso routes
//ruta para el home

app.use('/', (req, res) => {
    res.send('hola'); //send = enviar //como se van a mostrar los datos
});
*/

///////////////////////////////////////////////////////////////////////


//servidor y puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 7000;

//utilizamos listen para saber que puerto va a utilizar
app.listen(port, host, () => {
    console.log('El servidor esta LISTO');
});

//require('./handlers/email');
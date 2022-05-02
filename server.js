//declaraciones de variables
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const logger = require('morgan');
const cors = require('cors');
const multer = require('multer');
const admin = require('firebase-admin');
const serviceAccount = require('./servicesAccountKey.json');


/*
  inicializar Firebase admin
*/
admin.initializeApp({credential: admin.credential.cert(serviceAccount)})

//esto nos sirver para recibir en la ruta una archivo que vamos a subir a firebase
const upload = multer({
    storage: multer.memoryStorage()
})


/*
    RUTAS
*/
const users = require('./routes/usersRoutes');
const { credential } = require('firebase-admin');
//debemos ejecutar, nos dirigimos antes del server.listen

const port = process.env.PORT || 3000;

//esta linea nos sirve para debbugear los posibles errores que luego nos van a surgir 
app.use(logger('dev'));
//esto es para parcear las respuestas que recibamos en formato json
app.use(express.json());
//
app.use(express.urlencoded({
    extended: true 
}));
app.use(cors());

app.disable('x-powered-by');

app.set('port', port);

/* 

    LLAMAMOS LAS RUTAS 

*/
users(app,upload);
//LLamamos la variable server con listen y le decimos desde que puerto va a empezar a escuchar nuestro servidor.
//le definimos la ip para crear el servidor para probar el servidor y probar el backen desde la aplicacion desde flutter.
server.listen(3000,'192.168.0.105' || 'localhost', function(){
    console.log('Aplicacion de NodeJS '+ ' Puerto: '+port + ' iniciada...')
});



//manejo de error
app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).send(err.stack); 
});

//vamos a exportar un objeto donde pasamos la aplicacion y pasamos el servidor
module.exports = {
    app: app,
    server: server
}

//200 - es una respuesta exitosa
//404 - significa que la URL no existe
//500 es una error interno del servidor. Puede ser tambien que el codigo se escribió mal.
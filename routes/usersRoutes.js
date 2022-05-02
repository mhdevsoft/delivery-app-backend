//primero necesitamos el controlador 
const usersController = require('../controllers/usersController');
const UsersController = require('../controllers/usersController');
const { create } = require('../models/user');

//tenemos la app que inicializa express (server)
module.exports = (app, upload) => {
    //creamos una nueva ruta, cuando el usuario haga una peticion a esta ruta ejecute el metodo getAll que es el que devuelve todos los usuarios
    //get es para traer datos, obtener datos.
    app.get('/api/users/getAll', UsersController.getAll);

    //cada vez que veamos post, se refiere a una insercion de datos, una creacion de datos. 
    app.post('/api/users/create', upload.array('image', 1), UsersController.registerWithImage);
    app.post('/api/users/login', UsersController.login);

} ;
//para utilizar estar rutas debemos de ir a server.js
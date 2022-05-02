const User = require('../models/user');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const Rol = require('../models/rol');
const storage = require('../utils/cloud_storage');


//metodos req, res y next
/*
    res: sirve para retornar resultado o una respuesta al cliente, por ahora el cliente es Postman o bien nuestra aplicacion en flutter
*/

/**
 * req: Captura valores que nos llegan a traves de la peticion
 */
module.exports = {
    async getAll(req, res, next)
    {
        try {
            const data = await User.getAll();
            //imprimimos en consola los datos que nos retorna la consulta
            console.log(`Usuarios: ${data}`);
            //retornamos el estado de la consulta
            return res.status(201).json(data);
        } catch (error) {
            console.log(`error: ${error}`);
            return res.status(501).json({
                success: false,
                message: `error al obtener los usuarios`
                //al termino de esto necesitamos crear la ruta  que va a ejecutar este codigo, la consulta. routes
            });
        }
    },
    async register (req, res, next){
        try {

            //capturamos un usario o sus datos 
            const user = req.body; //capturamos lo que el cliente nos envie atraves de parametros
            //usamos await para que el programa espere hasta que la sentencia se ejecute
            const data = await User.create(user);

            await Rol.create(data.id, 1); //ROL por defecto, rol de cliente
            //cuando termina de ejecutarse necesitamos retornar una respuesta al usuario
            return res.status(201).json({
                success: true,
                message: 'el registro se realizo correctamente, ahora inicia sesión',
                data: data.id
            });
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'hubo un error con el registro del usuario',
                error: error
                //al termino de esto necesitamos crear la ruta  que va a ejecutar este codigo, la consulta. routes
            }); 
        }
    },  
    async registerWithImage(req, res, next){
        try {

            //capturamos un usario o sus datos 
            const user = JSON.parse(req.body.user);
            console.log(`Datos enviados del usuario: ${user}`); //capturamos lo que el cliente nos envie atraves de parametros

            //recibimos los o el archivo que vamos a almacenar 
            const files = req.files;

            if (files.length > 0){
                const pathimage = `image_${Date.now()}`; //Nombre del archivo 
                const url = await storage(files[0], pathimage);

                if(url != undefined && url != null){
                    user.image = url;
                }
            }
            //usamos await para que el programa espere hasta que la sentencia se ejecute
            const data = await User.create(user);

            await Rol.create(data.id, 1); //ROL por defecto, rol de cliente
            //cuando termina de ejecutarse necesitamos retornar una respuesta al usuario
            return res.status(201).json({
                success: true,
                message: 'el registro se realizo correctamente, ahora inicia sesión',
                data: data.id
            });
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'hubo un error con el registro del usuario',
                error: error
                //al termino de esto necesitamos crear la ruta  que va a ejecutar este codigo, la consulta. routes
            }); 
        }
    },


    async login(req, res, next){
        try {
            const email = req.body.email;
            const password = req.body.password;
            //aqui obtenemos el usuario por email
            const myUser = await User.findByEmail(email);
            //cuando termine el proceso de consulta el siguiente codigo comenzará a ejecutarse

            if(!myUser){
                return res.status(401).json({
                    success: false,
                    message: 'El email no fue encontrado'
                });
            }
            //comparamos si el password que usa el usuario 
            if(User.IsPasswordMatched(password, myUser.password)){
                const token = jwt.sign({id: myUser.id, email: myUser.email}, keys.secretOrKey,{
                    // expiresIn: (60*60*24) //una hora para tiempo de expiracion
                });
                const data = {
                    id: myUser.id,
                    name: myUser.name,
                    lastname: myUser.lastname,
                    email: myUser.email,
                    phone: myUser.phone,
                    image: myUser.image,
                    session_token: `JWT ${token}`,
                    roles: myUser.roles
                }
                console.log(`USUARIO ENVIADO ${data}`);
                return res.status(201).json({
                    success: true,
                    data: data,
                    message: 'El usuario ha sido autenticado'
                });
            }
            else{
                return res.status(401).json({
                    success: false,
                    message: 'La contraseña es incorrecta'
                });
            }
        } 
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message:'Error al momento de iniciar sesión',
                error: error
            });
        }
    }


};

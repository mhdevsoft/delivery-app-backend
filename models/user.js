const db = require('../config/config'); //esta variable nos va a servir para realizar las sentencias SQL
const crypto = require('crypto');

const User = {};

User.getAll = () => {
    const sql = `
    SELECT
        *
    FROM
        users
    `;

    return db.manyOrNone(sql);
};
//llamamos el modelo User y llamamos al metodo finById para encontrar por id, recibirá un id de usuario para encontrar, 
User.findById =(id, callback) => {
    const sql = `
     
        id,
        email,
        name,
        lastname,
        image,
        phone,
        password,
        session_token
    FROM
	    users
    WHERE 
	    id=$1`;
    return db.oneOrNone(sql, id).then(user => {callback(null, user);})
}

User.create = (user) => {

    const myPasswordHashed = crypto.createHash('md5').update(user.password).digest('hex');
    user.password = myPasswordHashed;

    const sql = `
    INSERT INTO
        users(
            email,
            name,
            lastname,
            phone,
            image,
            password,
            created_at,
            updated_at
        )
    VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id
    `;
    return db.oneOrNone(sql, [
        user.email,
        user.name,
        user.lastname,
        user.phone,
        user.image,
        user.password,
        new Date(),
        new Date()
    ]);
}

User.findByEmail = (email) => {
    const sql = `
    SELECT 
        U.id,
        U.email,
        U.name,
        U.lastname,
        U.image,
        U.phone,
        U.password,
        U.session_token,
		json_agg(
			json_build_object(
				'id', R.id,
				'name', R.name,
				'image', R.image,
				'route', R.route
			)
		) AS roles
    FROM
	    users as U
	INNER JOIN 
		user_has_roles as UHR
	ON
		UHR.id_user= U.id
	Inner JOIN
		roles AS R
	ON
		R.id=UHR.id_rol
    WHERE 
    	U.email = $1
	GROUP BY 
		U.id`;
        return db.oneOrNone(sql, email);
}


/*si se empareja con el password que vamos a comparar, este metodo nos permite comparar un password enviado desde el formulado, con un
pasword encryptado*/
User.IsPasswordMatched = (userPassword, hash) => {
    const myPasswordHashed = crypto.createHash('md5').update(userPassword).digest('hex');
    if(myPasswordHashed===hash){
        return true;
    }
    return false;
}

//necesitamos llamar este, para pasar el usuario que pasamos como objeto porque lo vamos a necesitar en nuestro controlador
//este User lo usamos en controllers (usersController)
module.exports = User;


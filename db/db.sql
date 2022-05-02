DROP table if exists roles CASCADE;
CREATE TABLE roles(
	id BIGSERIAL PRIMARY KEY,
	name varchar(180) NOT NULL UNIQUE,
	image varchar (250) NULL,
	route varchar (250) null,
	created_at timestamp (0) not null,
	updated_at timestamp (0) not null
);

INSERT INTO roles (
	name,
	route,
	created_at,
	updated_at
)	
VALUES (
	'CLIENTE',
	'client/products/list',
	'2022-04-20',
	'2022-04-20'	
);
INSERT INTO roles (
	name,
	route,
	created_at,
	updated_at
)	
VALUES (
	'RESTAURANTE',
	'restaurant/orders/list',
	'2022-04-20',
	'2022-04-20'
);
INSERT INTO roles (
	name,
	route,
	created_at,
	updated_at
)	
VALUES (
	'REPARTIDOR',
	'delivery/orders/list',
	'2022-04-20',
	'2022-04-20'
);

/*esta linea va a eliminar la tabla usuarios en caso de que ya exista en la BD y la volverá a crear */
DROP table if exists users CASCADE;

create table users
(
	id BIGSERIAL PRIMARY KEY,
	email varchar(255) not null UNIQUE,
	name varchar (255) not null,
	lastname varchar (255) not null,
	phone varchar (80) not null UNIQUE,
	image varchar (255) null,
	password varchar (255) not null,
	is_available boolean null,
	session_token varchar (255) null,
	created_at timestamp (0) not null,
	updated_at timestamp (0) not null
	
);
DROP table if exists user_has_roles CASCADE;

CREATE TABLE user_has_roles(
	id_user BIGSERIAL NOT NULL,
	id_rol BIGSERIAL NOT NULL,
	created_at timestamp (0) not null,
	updated_at timestamp (0) not null,
	/*Al momento de hacer algun cambio en la tabla de usuarios se verá afectado tambien en esta tabla, puede ser una eliminacion*/
	FOREIGN KEY(id_user)References users (id) ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY(id_rol)References roles (id) ON UPDATE CASCADE ON DELETE CASCADE,
	PRIMARY KEY (id_user, id_rol)
);
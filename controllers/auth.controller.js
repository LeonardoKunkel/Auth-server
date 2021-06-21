const { response } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (req, res = response) => {

    const { email, name, password } = req.body;

    try {

        // Verificar el email
        const usuario = await Usuario.findOne({ email });

        if ( usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'The user already exists with that email'
            })
        }

        // Crear usuario con el modelo
        const dbUser = new Usuario( req.body );

        // Hashear la contraseña
        const salt = bcrypt.genSaltSync(10);
        dbUser.password = bcrypt.hashSync( password, salt );

        // Generar el JWT
        const token = await generarJWT( dbUser.id, name );

        // Crear usuario de DB
        await dbUser.save();

        // Generar respuesta exitosa
        return res.status(201).json({
            ok: true,
            uid: dbUser.id,
            name,
            email,
            token
        });
        
    } catch (error) {

        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Please talk to your admin'
        });

    }

};

const loginUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        const dbUser = await Usuario.findOne({ email });

        if( !dbUser ) {
            return res.status(400).json({
                ok: false,
                msg: 'The email does not exist'
            });
        }

        // Confirmar si contraseña hace match
        const validPassword = bcrypt.compareSync( password, dbUser.password );

        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'The password is not valid'
            });
        }

        // Generar el JWT
        const token = await generarJWT( dbUser.id, dbUser.name );

        // Respuesta del servicio
        return res.json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            token
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Talk to your admin'
        })
    }

};

const revalidarToken = async (req, res = response) => {

    const { uid } = req;

    // Leer la base de datos
    const dbUser = await Usuario.findById(uid);



    // Generar un nuevo JWT
    const token = await generarJWT( uid, dbUser.name );

    return res.json({
        ok: true,
        uid,
        name: dbUser.name,
        email: dbUser.email,
        token
    });
};

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
};


const { Router } = require('express');
const { check } = require('express-validator');
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth.controller');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// Crear usuario
router.post( '/new', [
    check('name', 'El nombre es obligatorio, no sea imbecil').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').isLength({min: 6}),
    validarCampos
], crearUsuario);


// Login de usuario
router.post( '/', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').isLength({min: 6}),
    validarCampos
], loginUsuario);

// Validar y revalidar al token
router.get( '/renew', validarJWT, revalidarToken);

module.exports = router;

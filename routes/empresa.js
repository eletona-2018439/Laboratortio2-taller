const { Router } = require('express');
const { check } = require('express-validator');
const { getEmpresa,PostEmpresa, PutEmpresa, DeleteEmpresa,  getSucursales, postRegistroEmpresa } = require('../controller/empresa');
const { existIdOfEmpresa, exiteTipo, emailExiste } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/mostrar', getEmpresa);

router.post('/registro', postRegistroEmpresa);

router.post('/agregar', [
    check('nombre', 'El nombre es obligatorio para agregar').not().isEmpty(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    check('password', 'La contrase;a minimo tienen que ser 6 caracteres').isLength({ min: 6 }),
    check('correo', 'El correo no es correcto').isEmail(),
    check('correo').custom(emailExiste),
    check('tipo').custom(exiteTipo),
    validarCampos
], PostEmpresa);

router.put('/editar/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio para agregar').not().isEmpty(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    check('password', 'La contrase;a minimo tienen que ser 6 caracteres').isLength({ min: 6 }),
    check('correo', 'El correo no es correcto').isEmail(),
    check('id', "No es un id valido").isMongoId(),
    check('id').custom(existIdOfEmpresa),
    validarCampos
], PutEmpresa);

router.delete('/eliminar/:id', [
 
    check('id', "Id de mongo no existe").isMongoId(),
    check('id').custom(existIdOfEmpresa),
    validarCampos
], DeleteEmpresa)


router.get('/mostrarSucursal/:id', [
], getSucursales);



module.exports = router;
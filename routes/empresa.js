const { Router } = require('express');
const { check } = require('express-validator');
const { getEmpresa,PostEmpresa, PutEmpresa, DeleteEmpresa, putSucursal, putSucursalBorrar, VaciarSucursales, getSucursales } = require('../controller/empresaController');
const { existIdOfEmpresa, exiteTipo, emailExiste } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/mostrar', getEmpresa);

router.post('/agregar', [
    check('nombre', 'el nombre es obligatorio para agregar').not().isEmpty(),
    check('password', 'el password es obligatorio').not().isEmpty(),
    check('password', 'la contrase;a minimo tienen que ser 6 caracteres').isLength({ min: 6 }),
    check('correo', 'El correo no es correcto').isEmail(),
    check('correo').custom(emailExiste),
    check('tipo').custom(exiteTipo),
    validarCampos
], PostEmpresa);

router.put('/sucursal', [
    validarJWT,
    
    validarCampos
], putSucursal);

router.get('/mostrarSucursal/:id', [
   
], getSucursales);

router.put('/sucursaldelete/:id', [
    validarJWT,
    validarCampos
], putSucursalBorrar);

router.put('/vaciarsucursal', [
    validarJWT,
    validarCampos
], VaciarSucursales);

router.put('/editar/:id', [
   
    check('nombre', 'el nombre es obligatorio para agregar').not().isEmpty(),
    check('password', 'el password es obligatorio').not().isEmpty(),
    check('password', 'la contrase;a minimo tienen que ser 6 caracteres').isLength({ min: 6 }),
    check('correo', 'El correo no es correcto').isEmail(),
    check('id', "no es un id valido").isMongoId(),
    check('id').custom(existIdOfEmpresa),
    validarCampos
], PutEmpresa);
router.put('/editar/:id', [

    validarCampos
], PutEmpresa);

router.delete('/delete/:id', [
    validarJWT,
    check('id', "id de mongo no existe").isMongoId(),
    check('id').custom(existIdOfEmpresa),
    validarCampos
], DeleteEmpresa)


module.exports = router;
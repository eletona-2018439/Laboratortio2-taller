const { Router } = require('express');
const { check } = require('express-validator');
const {   postSucursal, putSucursal, deleteSucursal, }= require('../controller/sucursal');
const { idSucursal, exiteMunicipio } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post('/agregar',[
    validarJWT,
    check('nombre','El nombre es obligatorio para agregar').not().isEmpty(),
    validarCampos
], postSucursal);

router.put('/editar/:id',[
    validarJWT,
    check('id', "no es un id valido").isMongoId(),
    check('id').custom( idSucursal),
    check('nombre','El nombre es obligatorio para agregar').not().isEmpty(),
    validarCampos
] , putSucursal);

router.delete('/eliminar/:id',[
    validarJWT,
    check('id', "No es un id valido").isMongoId(),
    check('id').custom(idSucursal),
    validarCampos
] ,deleteSucursal)

module.exports = router;

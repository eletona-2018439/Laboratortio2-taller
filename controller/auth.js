const { request, response } = require('express')
const bcryptjs = require('bcryptjs');

const Empresa = require('../models/empresa');
const { generarJWT } = require('../helpers/generar-jwt');

const login = async(req = request, res = response) => {
    const { correo, password } = req.body;

    try {
         
        const empresa = await Empresa.findOne({correo})
        if (!empresa) {
            return res.status(400).json({
                msg: "El correo usuario no existe en la base de datos 404"
            })
        }
        const validarPassword = bcryptjs.compareSync(password, empresa.password);
        if (!validarPassword) {
            return res.status(400).json({
                msg: "La password no es correcta"
            })
        }
        
        const token = await generarJWT(empresa.id)

        res.json({
            msg: "BIENVENIDO!!",
            correo, 
            password,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Hable con el admin"
        })
    }

}


module.exports = {
    login
}
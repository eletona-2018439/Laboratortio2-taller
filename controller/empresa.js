const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Empresa = require('../models/empresa');

const { Promise } = require('mongoose');


const getEmpresa = async (req = request, res = response) => {

    const listaDeEmpresas = await Promise.all([
        Empresa.countDocuments(),
        Empresa.find()
    ])

    res.json({
        msg: 'GET API Empresas ',
        listaDeEmpresas
    })

}
const PostEmpresa = async (req = request, res = response) => {

    const { nombre, correo, password, tipo } = req.body;
    const empresaDB = new Empresa({ nombre, correo, password, tipo });
    const salt = bcryptjs.genSaltSync();
    empresaDB.password = bcryptjs.hashSync(password, salt);
    await empresaDB.save();

    res.status(201).json({
        msg: 'La empresa ha sido agregada correctamente',
        empresaDB
    })

}

const postRegistroEmpresa = async (req = request, res = response) => {

    const {nombre, correo, password, tipo} = req.body;
    const empresaDB = new Empresa({nombre, correo, password, tipo});

    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    empresaDB.password = bcryptjs.hashSync(password, salt);

    //Guardar el nuevo usuario en la DB
    await empresaDB.save();

    res.status(200).json({
        msg: 'Registro Exitoso',
        empresaDB
    });
}


const PutEmpresa = async (req = request, res = response) => {

    const { id } = req.params;
    const { id_, sucursal, ...resto } = req.body;

    if (resto.password) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(resto.password, salt);
    }

    const empresaEditar = await Empresa.findByIdAndUpdate(id, resto, { new: true });

    res.json({
        msg: 'La empresa ha sido editada correctamente',
        empresaEditar
    });

}

const DeleteEmpresa = async (req = request, res = response) => {

    const { id } = req.params;
    const empresaEditar = await Empresa.findByIdAndDelete(id);

    res.json({
        msg: 'La empresa ha sido eliminada correctamente',
        empresaEditar
    })

}

const getSucursales = async (req = request, res = response) => {

    const { id } = req.params
    const empresa = await Empresa.findById(id).populate({
        path: 'sucursal',
        select: 'nombre direccion municipio',
      });
    const sucursalEmpresa = empresa.sucursal


    res.json({
        msg: 'Listado de Sucursales',
        sucursalEmpresa

    })
}

module.exports = {

    getEmpresa,
    postRegistroEmpresa,
    PostEmpresa,
    PutEmpresa,
    DeleteEmpresa,
    getSucursales

}
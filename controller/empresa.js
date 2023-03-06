const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Empresa = require('../models/empresaModel');

const { Promise } = require('mongoose');


const getEmpresa = async (req = request, res = response) => {

   

    const listaEmpresa = await Promise.all([
        Empresa.countDocuments(),
        Empresa.find()
    ])

    res.json({
        msg: 'Get Api de ',
        listaEmpresa
    })

}
const PostEmpresa = async (req = request, res = response) => {

    const { nombre, correo, password, tipo } = req.body;
    const empresaDB = new Empresa({ nombre, correo, password, tipo });


    const salt = bcryptjs.genSaltSync();
    empresaDB.password = bcryptjs.hashSync(password, salt);
    await empresaDB.save();



    res.status(201).json({
        msg: 'Post api',
        empresaDB
    })

}




const PutEmpresa = async (req = request, res = response) => {

    const { id } = req.params;

    const {  id_, sucursal, ...resto } = req.body;
    

    


    if ( resto.password ) {
        //Encriptar password
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(resto.password, salt);
    }

    const empresaEditar = await Empresa.findByIdAndUpdate(id, resto,{new:true});


    res.json({
        msg: 'PUT editar empresa',
        empresaEditar
    });

}

const DeleteEmpresa = async (req = request, res = response) => {

    const { id } = req.params;

    const empresaEditar = await Empresa.findByIdAndDelete(id);

    res.json({
        msg: 'Delete api',
        empresaEditar
    })

}

const putSucursal = async (req = request, res = response) => {
    const data = {
        empresa: req.empresa._id
    }

    const agregarSucursal = await Empresa.updateOne(
        { _id: data.empresa },
        { $push: { sucursal: req.body.sucursal } },
        { new: true }
    )


    res.status(201).json({
        msg: 'Post api',
        agregarSucursal
    
    })

}
const putSucursalBorrar = async (req = request, res = response) => {
    // obtener el id 
    const SucursalId = req.params.id;
    // obtener el id del 
    const data = {
        empresa: req.empresa._id
    }
    // obtener el arreglo del 
    const empresa = await Empresa.findOne({ _id: data.empresa });
    const sucuarsales = empresa.sucursal

    // eliminar el producto
    let actualizarSucursal
   
    for (let sucursal of sucuarsales) {
        actualizarSucursal = await Empresa.updateOne(
            { _id: data.empresa },
            { $pull: { sucursal: SucursalId } },

        )
    }

   

    res.json({
        msg: 'Delete api',
        actualizarSucursal
    })
}


const VaciarSucursales = async (req = request, res = response) => {
    const { id } = req.params;

    const data = {
        empresa: req.empresa._id
    }
    // obtener el arreglo del
    const empresa = await Empresa.findOne({ _id: data.empresa });

    let vaciarSucursal = await Empresa.findOneAndUpdate(
        { _id: data.empresa },
        { sucursal: [] },
        { new: true }
    )
    res.json({
        msg: 'Put api',
        vaciarSucursal,

    })


}
const getSucursales = async (req = request, res = response) => {

    const { id } = req.params

    const empresa = await Empresa.findOne({ _id: id }).populate('sucursal', 'nombre')
    const sucursalEmpresa = empresa.sucursal
    

    res.json({
        sucursalEmpresa

    })
}

module.exports = {

    getEmpresa,
    PostEmpresa,
    PutEmpresa,
    DeleteEmpresa,
    putSucursal,
    putSucursalBorrar,
    VaciarSucursales,
    getSucursales

}
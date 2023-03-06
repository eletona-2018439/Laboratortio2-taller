const { response, request } = require('express');

const Sucursal = require('../models/sucursalModel');
const { Promise } = require('mongoose');

const getSucursal = async (req = request, res = response) => {

   

    const listaSucursal = await Promise.all([
        Sucursal.countDocuments(),
        Sucursal.find().populate('empresa','nombre')
    ]);

    res.json({
        msg: 'Get Api de categoria',
        listaSucursal
    })
}

const getSucursalId = async (req = request, res = response) => {

    const { id } = req.params;
    const sucursal = await Sucursal.findById(id).populate('empresa','nombre')

    res.json({
        msg: 'Get Api de categoria',
        sucursal
    })
}

const postSucursal= async (req = request, res = response) => {
    const  nombre  = req.body.nombre.toUpperCase()
    const sucursalDb = await Sucursal.findOne({nombre});
    const direcciones = req.body.direcciones.toUpperCase()
    const municipio = req.body.municipio.toUpperCase()
    if (sucursalDb) {
        return res.status(400).json({
            msg: `la sucursal ${sucursalDb.nombre}, ya existe en la db`
        })
    }
    
    const data ={
        nombre,
        empresa: req.empresa._id,
        sucursalDb,
        direcciones,
        municipio
    }

    const sucursalAgregada = new Sucursal(data);

    await sucursalAgregada.save()

    res.status(201).json({
        msg: 'Post api',
        sucursalAgregada,
        
    })

}

const putSucursal= async (req = request, res = response) => {
    const { id } = req.params;

    const { _id, empresa , ...resto } = req.body;

    resto.nombre = resto.nombre.toUpperCase()
    
    resto.empresa = req.empresa._id

    //edicion de categoria 
    const editarSucursal = await Sucursal.findByIdAndUpdate(id, resto,{new:true});

    res.json({
        msg: "api para editar",
        editarSucursal
    })
}

const deleteSucursal = async (req = request, res = response) => {
    const { id } = req.params;
    const sucursalBorrada = await Sucursal.findByIdAndDelete(id);


    res.json({
        msg: "api para borrar",
        sucursalBorrada
    })
}


module.exports = {
    getSucursal,
    postSucursal,
    putSucursal,
    deleteSucursal,
    getSucursalId,
    
}
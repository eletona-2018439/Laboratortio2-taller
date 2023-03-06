const { response, request } = require('express');

const Sucursal = require('../models/sucursal');
const { Promise } = require('mongoose');
const Empresa = require('../models/empresa');


const postSucursal = async (req = request, res = response) => {
    const nombre = req.body.nombre
    const sucursalDb = await Sucursal.findOne({ nombre });
    const direccion = req.body.direccion
    const municipio = req.body.municipio
    if (sucursalDb) {
        return res.status(400).json({
            msg: `La sucursal ${sucursalDb.nombre}, ya existe en la db`
        })
    }

    const data = {
        nombre,
        empresa: req.empresa._id,
        direccion,
        municipio
    }

    const sucursalAgregada = new Sucursal(data);

    await sucursalAgregada.save();
    await Empresa.findByIdAndUpdate(
        req.empresa._id,
        { $addToSet: { sucursal: sucursalAgregada._id } },
        { new: true }
    );

    res.status(201).json({
        msg: 'La sucursal ha sido agregada correctamente',
        sucursalAgregada,

    })

}

const putSucursal = async (req = request, res = response) => {
    const { id } = req.params;
    const { _id, empresa, ...resto } = req.body;

    resto.nombre = resto.nombre.toUpperCase()
    resto.empresa = req.empresa._id
    const editarSucursal = await Sucursal.findByIdAndUpdate(id, resto, { new: true });

    res.json({
        msg: "La sucursal ha sido editada correctamente",
        editarSucursal
    })
}

const deleteSucursal = async (req = request, res = response) => {
    const { id } = req.params;
    const sucursalBorrada = await Sucursal.findByIdAndDelete(id);

    res.json({
        msg: "La sucursal ha sido eliminada correctamente",
        sucursalBorrada
    })
}


module.exports = {
    postSucursal,
    putSucursal,
    deleteSucursal,

}
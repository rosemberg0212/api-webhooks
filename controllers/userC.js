const {response} = require('express');
const Usuario = require('../models/user');

const usuariosPost = async (req, res = response)=>{

    const {nombre, hotel} = req.body;
    const usuario = new Usuario({nombre, hotel});


    //Guardar usuario
    await usuario.save();

    res.json({
        usuario
    });
}

module.exports = {
    usuariosPost,
}
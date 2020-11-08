const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');

const getUsuarios = async (req, res = response) => {

    const desde  = Number(req.query.desde);
    console.log(desde);

    const [ usuarios, total ] = await Promise.all([
        Usuario
            .find({}, 'nombre email role')
            .skip(desde)
            .limit(5),
            Usuario.countDocuments()
    ]);

    res.json({
        ok: true,
        usuarios,
        total
    });
}
const crearUsuario = async (req, res = response) => {
    const { email, password } = req.body;

    try{
        const existeEmail = await Usuario.findOne({email});
        if(existeEmail){
            return res.status(400).json({
                ok:false,
                msg: 'El correo ya esta registrado'
            })
        }
        const usuario = new Usuario(req.body);

        // Encriptar constraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        // guardar usuario

        await usuario.save();

        res.json({
            ok: true,
            usuario
        });

    
    }catch(error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Error inesperado... revisar logs'
        })
    }
}
const actualizarUsuario = async (req, res = response) => {

    const uid = req.params.id;
    try{
        const usuarioDB = await Usuario.findById(uid);

        if(!usuarioDB)
        {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese id'
            });
        }
        const { password, email, ...campos } = req.body;
        if(usuarioDB.email !== email)
        {
            const existeEmail = await Usuario.findOne({ email });
            if(existeEmail){
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }
        campos.email = email;
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {new: true});

        res.json({
            ok:true,
            usuario: usuarioActualizado
        })
    }catch(error){
        console.log(error);
        res.status(500).json(
            {
                ok:false,
                msg: 'Error inesperado'
            }
        );
    }
}
const eliminarUsuario = async (req, res = response) => {
    const uid = req.params.id;
    try {
        const usuarioDB = await Usuario.findById(uid);
        if(!usuarioDB)
        {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }
        await Usuario.findByIdAndDelete(uid);
        res.status(200).json(
            {
                ok: true,
                msg: 'Usuario eliminado',
                uid
            }
        );
    } catch (error) {
        res.status(500).json(
            {
                ok: false,
                msg: 'No existe usuario'
            }
        );
    }
}
module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
}
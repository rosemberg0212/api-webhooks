const {Schema, model} = require('mongoose')

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    hotel: {
        type: String,
        required: [true, 'El Hotel es obligatorio']
    },
    estado: {
        type: Boolean,
        default: true
    },
});

//sacar la version y la contraseña
UsuarioSchema.methods.toJSON = function() {
    const {__v, password, _id, ...usuario} = this.toObject();
    usuario.uid = _id;
    return usuario;
}

module.exports = model('Usuario', UsuarioSchema);
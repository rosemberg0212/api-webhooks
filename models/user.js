const { Schema, model } = require("mongoose");

const UsuarioSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  hotel: {
    type: String,
    required: [true, "El Hotel es obligatorio"],
  },
  ciudad: {
    type: String,
    required: [true, "La ciudad es obligatorio"],
  },
  id: {
    type: String,
    required: [true, "La ID del usuario es obligatoria"],
  },
  telefono: {
    type: String,
    required: [true, "El telefono es obligatorio"],
  },
  codeReserva: {
    type: Number,
    required: [true, "El codigo de reserva es requerido"],
  },
  checkin: {
    type: String,
    required: [true, "La fecha de checkin es requerida"],
  },
  checkout: {
    type: String,
    required: [true, "La fecha de checkout es requerida"],
  },
  estado: {
    type: Boolean,
    default: true,
  },
});

//sacar la version y la contraseña
UsuarioSchema.methods.toJSON = function () {
  const { __v, password, _id, ...usuario } = this.toObject();
  usuario.uid = _id;
  return usuario;
};

module.exports = model("Usuario", UsuarioSchema);

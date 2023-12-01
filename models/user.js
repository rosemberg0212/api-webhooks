const { Schema, model } = require("mongoose");

const UsuarioSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  primerApellido: {
    type: String,
    required: [true, "El apellido es obligatorio"],
  },
  hotel: {
    type: String,
    required: [true, "El Hotel es obligatorio"],
  },
  habitacion: {
    type: String,
    required: [true, "La habitacion es obligatoria"],
  },
  id: {
    type: String,
    required: [true, "La ID del usuario es obligatoria"],
  },
  cell: {
    type: String,
    required: [true, "El telefono es obligatorio"],
  },
  code_reserva: {
    type: Number,
    required: [true, "Codigo de reserva es obligatorio"],
  },
  checkIn_date: {
    type: String,
    required: [true, "La fecha de checkin es requerida"],
  },
  checkOut_date: {
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

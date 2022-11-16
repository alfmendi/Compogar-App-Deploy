import mongoose from "mongoose";

const anuncioSchema = mongoose.Schema(
  {
    operacion: {
      type: String,
      enum: ["alquiler", "venta"],
      required: true,
    },
    precio: {
      type: Number,
      required: true,
      min: 0,
    },
    direccion: { type: String, trim: true, required: true, minlength: 3 },
    localidad: {
      type: String,
      trim: true,
      required: true,
      minlength: 3,
    },
    provincia: {
      type: String,
      trim: true,
      required: true,
      minlength: 3,
    },
    tipoInmueble: {
      type: String,
      enum: ["piso", "casa"],
      required: true,
    },
    planta: {
      type: String,
      enum: [
        "bajo",
        "entreplanta",
        "planta1",
        "planta2",
        "planta3",
        "planta4",
        "planta5",
        "planta6",
        "planta7",
        "planta8",
        "planta9",
        "planta10",
        "planta11",
        "planta12",
        "planta13",
        "planta14",
        "planta15",
      ],
    },
    superficie: {
      type: Number,
      required: true,
      min: 0,
    },
    exterior: {
      type: String,
      enum: ["si", "no"],
      required: true,
    },
    garaje: {
      type: String,
      enum: ["si", "no"],
      required: true,
    },
    ascensor: {
      type: String,
      enum: ["si", "no"],
      required: true,
    },
    habitaciones: {
      type: Number,
      required: true,
      min: 0,
    },
    aseos: {
      type: Number,
      required: true,
      min: 0,
    },
    descripcion: { type: String, trim: true, required: true, minlength: 3 },
    imagenes: [String],
    usuario: {
      type: mongoose.Types.ObjectId,
      ref: "Usuario",
    },
  },

  // Se puede utilizar el objeto timestamps que añade
  // fecha tanto en la creación como en la modificación
  { timestamps: true }
);

anuncioSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // El password no se debe enviar
    delete returnedObject.password;
  },
});

export default mongoose.model("Anuncio", anuncioSchema);

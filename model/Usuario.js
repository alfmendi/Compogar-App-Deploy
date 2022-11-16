import mongoose from "mongoose";

const usuarioSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      trim: true,
      required: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    },
    telefono: {
      type: String,
      required: true,
      validate: /^[0-9]{9}$/,
    },
    password: {
      type: String,
      trim: true,
      required: true,
      minlength: 6,
    },
    refreshToken: {
      type: String,
    },
  },
  // Se puede utilizar el objeto timestamps que añade
  // fecha tanto en la creación como en la modificación
  { timestamps: true }
);

usuarioSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // El password no se debe enviar
    delete returnedObject.password;
  },
});

export default mongoose.model("Usuario", usuarioSchema);

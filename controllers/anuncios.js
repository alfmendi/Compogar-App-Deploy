import Anuncio from "../model/Anuncio.js";

import cloudinary from "../utils/cloudinary.js";

import ErrorAPIPropio from "../error/ErrorAPIPropio.js";

// ---------------------------------------------
// GET /api/anuncios                           -
// Público                                     -
// Controlador para obtener todos los anuncios -
// ---------------------------------------------
export const conseguirTodosAnuncios = async (req, res, next) => {
  const localidad = req.query.localidad;
  const operacion = req.query.alquilar === "true" ? "alquiler" : "venta";

  try {
    const anuncios = await Anuncio.find({ localidad, operacion }).populate(
      "usuario",
      { email: 1, telefono: 1 }
    );
    return res.status(200).json(anuncios);
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------------
// GET /api/anuncios/grupo                                             -
// Público                                                             -
// Controlador para obtener todos los anuncios agrupados por provincia -
// ---------------------------------------------------------------------
export const conseguirTodosAnunciosAgrupados = async (req, res, next) => {
  try {
    // const anuncios = await Anuncio.aggregate([
    //   {
    //     $match: { operacion: "alquiler" },
    //   },
    //   {
    //     $group: {
    //       _id: { provincia: "$provincia" },
    //       totalAnuncios: { $sum: 1 },
    //     },
    //   },
    // ]);

    const anuncios = await Anuncio.aggregate([
      {
        $group: {
          _id: { provincia: "$provincia", operacion: "$operacion" },
          total: { $sum: 1 },
        },
      },
    ]);

    return res.status(200).json(anuncios);
  } catch (error) {
    next(error);
  }
};

// -----------------------------------------------
// GET /api/anuncios/anuncio/anuncioId           -
// Público                                       -
// Controlador para obtener un anuncio por su Id -
// -----------------------------------------------
export const conseguirAnuncioId = async (req, res, next) => {
  const { anuncioId } = req.params;
  try {
    const anuncio = await Anuncio.findById(anuncioId).populate("usuario", {
      email: 1,
      telefono: 1,
    });
    if (!anuncio) {
      throw new ErrorAPIPropio(404, "Ese anuncio no existe");
    }
    return res.status(200).json(anuncio);
  } catch (error) {
    next(error);
  }
};

// -----------------------------------------------------
// GET /api/anuncios/usuarioId                         -
// Privado                                             -
// Controlador para obtener los anuncios de un usuario -
// -----------------------------------------------------
export const conseguirAnunciosUsuario = async (req, res, next) => {
  try {
    const { usuarioId } = req.params;
    const anunciosUsuario = await Anuncio.find({ usuario: usuarioId }).populate(
      "usuario"
    );
    return res.status(200).json(anunciosUsuario);
  } catch (error) {
    next(error);
  }
};

// ----------------------------------------------
// POST /api/anuncios                           -
// Privado                                      -
// Controlador para añadir un anuncio a la BBDD -
// ----------------------------------------------
export const crearAnuncio = async (req, res, next) => {
  const {
    operacion,
    precio,
    direccion,
    localidad,
    provincia,
    tipoInmueble,
    planta,
    superficie,
    exterior,
    habitaciones,
    aseos,
    garaje,
    ascensor,
    descripcion,
    imagenes,
  } = req.body;

  try {
    // No compruebo si existe el usuario porque se supone
    // que si está mandando un token, debe estar en la BBDD

    // Subo la/s imagen/es a cloudinary (en caso de que el usuario haya subido imagen/es)
    const arrayImagenes = [];
    for (let imagen of imagenes) {
      if (imagen) {
        const imagenCloudinary = await cloudinary.uploader.upload(imagen, {
          upload_preset: "compogar",
        });
        arrayImagenes.push(imagenCloudinary.secure_url);
      }
    }

    // // Creo el nuevo anuncio
    const nuevoAnuncio = await Anuncio.create({
      operacion,
      precio,
      direccion,
      localidad,
      provincia,
      tipoInmueble,
      planta,
      superficie,
      exterior,
      habitaciones,
      aseos,
      garaje,
      ascensor,
      descripcion,
      imagenes: arrayImagenes,
      usuario: req.usuarioId,
    });
    return res.status(201).json(nuevoAnuncio);
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------
// PATCH /api/anuncios/anuncioId                    -
// Privado                                          -
// Controlador para modificar un anuncio de la BBDD -
// --------------------------------------------------
export const modificarAnuncio = async (req, res, next) => {
  const {
    operacion,
    precio,
    direccion,
    localidad,
    provincia,
    tipoInmueble,
    planta,
    superficie,
    exterior,
    habitaciones,
    aseos,
    garaje,
    ascensor,
    descripcion,
    imagenes,
  } = req.body;
  const { anuncioId } = req.params;
  try {
    const anuncioModificar = await Anuncio.findById(anuncioId);
    if (!anuncioModificar) {
      throw new ErrorAPIPropio(404, "Ese anuncio no existe");
    }

    // 1º compruebo que las imágenes subidas coinciden con las almacenadas
    // Si alguna de las imagenes guardadas ya no figura entre las nuevas
    // imagenes, se borra (la guardada, la que ya no vale...)
    for (let imagenGuardada of anuncioModificar.imagenes) {
      if (!imagenes.includes(imagenGuardada)) {
        // Obtener public_id de secure_url
        const arrayElementos = imagenGuardada.split("/");
        const imagenId =
          arrayElementos[arrayElementos.length - 1].split(".")[0];
        const miPublicId = `${
          arrayElementos[arrayElementos.length - 2]
        }/${imagenId}`;
        await cloudinary.uploader.destroy(miPublicId);
      }
    }

    // 2º añado las nuevas imagenes que no estaban ya almacenadas
    // (básicamente las que empiezan por data:image/)
    // Subo la/s imagen/es a cloudinary (en caso de que el usuario haya subido imagen/es)
    const arrayImagenes = [];
    for (let imagen of imagenes) {
      if (imagen) {
        if (imagen.startsWith("data:image/")) {
          const imagenCloudinary = await cloudinary.uploader.upload(imagen, {
            upload_preset: "compogar",
          });
          arrayImagenes.push(imagenCloudinary.secure_url);
        } else {
          // Ya es una imagen https://res.cloudinary.com/alfmendi/image
          arrayImagenes.push(imagen);
        }
      }
    }

    const anuncioModificado = await Anuncio.findByIdAndUpdate(
      anuncioId,
      {
        $set: {
          operacion,
          precio,
          direccion,
          localidad,
          provincia,
          tipoInmueble,
          planta,
          superficie,
          exterior,
          habitaciones,
          aseos,
          garaje,
          ascensor,
          descripcion,
          imagenes: arrayImagenes,
        },
      },
      { new: true, runValidators: true }
    );
    if (!anuncioModificado) {
      throw new ErrorAPIPropio(404, "Ese anuncio no existe");
    }
    return res.status(200).json(anuncioModificado);
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------------
// DELETE /api/anuncios/anuncioId                  -
// Privado                                         -
// Controlador para eliminar un anuncio de la BBDD -
// -------------------------------------------------
export const eliminarAnuncio = async (req, res, next) => {
  const { anuncioId } = req.params;
  try {
    const anuncioEliminar = await Anuncio.findByIdAndRemove(anuncioId);
    if (!anuncioEliminar) {
      throw new ErrorAPIPropio(404, "Ese anuncio no existe");
    }

    // Elimino las imagenes de ese anuncio
    for (let imagenGuardada of anuncioEliminar.imagenes) {
      // Obtener public_id de secure_url
      const arrayElementos = imagenGuardada.split("/");
      const imagenId = arrayElementos[arrayElementos.length - 1].split(".")[0];
      const miPublicId = `${
        arrayElementos[arrayElementos.length - 2]
      }/${imagenId}`;
      await cloudinary.uploader.destroy(miPublicId);
    }

    return res.status(200).send();
  } catch (error) {
    next(error);
  }
};

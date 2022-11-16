import { body } from "express-validator";

import { comprobadorErrores } from "./comprobadorErrores.js";

// Permite establecer los requisitos necesarios para que la operación
// sea considerada como válida
const operacion = body("operacion", "Operacion:Elija una opción")
  .exists()
  .trim()
  .not()
  .isEmpty()
  .escape()
  .isIn(["alquiler", "venta"]);

// Permite establecer los requisitos necesarios para que el precio
// sea considerado como válido
const precio = body("precio", "Precio:Valor no válido")
  .exists()
  .trim()
  .not()
  .isEmpty()
  .isInt({ min: 0 })
  .escape();

// Permite establecer los requisitos necesarios para que la dirección
// sea considerada como válida
const direccion = body("direccion", "Direccion:Mínimo 3 caracteres")
  .exists()
  .trim()
  .not()
  .isEmpty()
  .escape()
  .isLength({ min: 3 });

// Permite establecer los requisitos necesarios para que la localidad
// sea considerada como válida
const localidad = body("localidad", "Localidad:Mínimo 3 caracteres")
  .exists()
  .trim()
  .not()
  .isEmpty()
  .escape()
  .isLength({ min: 3 });

// Permite establecer los requisitos necesarios para que la provincia
// sea considerada como válida
const provincia = body("provincia", "Provincia:Mínimo 3 caracteres")
  .exists()
  .trim()
  .not()
  .isEmpty()
  .escape()
  .isLength({ min: 3 });

// Permite establecer los requisitos necesarios para que la operación
// sea considerada como válida
const tipoInmueble = body("tipoInmueble", "TipoInmueble:Elija una opción")
  .exists()
  .trim()
  .not()
  .isEmpty()
  .escape()
  .isIn(["piso", "casa"]);

// Permite establecer los requisitos necesarios para que la planta
// sea considerada como válida
const planta = body("planta", "Planta:Elija una opción")
  .exists()
  .trim()
  .not()
  .isEmpty()
  .escape()
  .isIn([
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
  ]);

// Permite establecer los requisitos necesarios para que la superficie
// sea considerada como válida
const superficie = body("superficie", "Superficie:Valor no válido")
  .exists()
  .trim()
  .not()
  .isEmpty()
  .isInt({ min: 0 })
  .escape();

// Permite establecer los requisitos necesarios para que el campo exterior
// sea considerado como válido
const exterior = body("exterior", "Exterior:Elija una opción")
  .exists()
  .trim()
  .not()
  .isEmpty()
  .escape()
  .isIn(["si", "no"]);

// Permite establecer los requisitos necesarios para que el número de habitaciones
// sea considerado como válido
const habitaciones = body("habitaciones", "Habitaciones:Valor no válido")
  .exists()
  .trim()
  .not()
  .isEmpty()
  .isInt({ min: 0 })
  .escape();

// Permite establecer los requisitos necesarios para que el número de baños
// sea considerado como válido
const aseos = body("aseos", "Aseos:Valor no válido")
  .exists()
  .trim()
  .not()
  .isEmpty()
  .isInt({ min: 0 })
  .escape();

// Permite establecer los requisitos necesarios para que el campo garaje
// sea considerado como válido
const garaje = body("garaje", "Garaje:Elija una opción")
  .exists()
  .trim()
  .not()
  .isEmpty()
  .escape()
  .isIn(["si", "no"]);

// Permite establecer los requisitos necesarios para que el campo ascensor
// sea considerado como válido
const ascensor = body("ascensor", "Ascensor:Elija una opción")
  .exists()
  .trim()
  .not()
  .isEmpty()
  .escape()
  .isIn(["si", "no"]);

// Permite establecer los requisitos necesarios para que la descripción
// sea considerada como válida
const descripcion = body("descripcion", "Descripcion:Mínimo 3 caracteres")
  .exists()
  .trim()
  .not()
  .isEmpty()
  .escape()
  .isLength({ min: 3 });

// Permite establecer los requisitos necesarios para que la/s imagen/es
// sea/n considerada/s como válida/s
const imagenes = body("imagenes", "Imagenes:Elija una imagen")
  .isArray({ min: 0, max: 6 })
  .custom((value, { req }) => {
    for (let imagen of value) {
      if (!imagen) {
        continue;
      }
      if (
        !imagen.startsWith("data:image/") &&
        !imagen.startsWith("https://res.cloudinary.com/alfmendi/image")
      ) {
        console.log("Salgo por el false en anuncios.js validator...");
        return false;
      }
    }
    // Indicates the success of this synchronous custom validator
    return true;
  });

// Validador para comprobar que los campos enviados en el proceso de creación y modificación
// son válidos. Esta expresión (validadorClientes) se pasa como un array de middlewares a la ruta
// (Se puede pasar más de un middleware a un elemento en forma de array)
export const validadorAnuncios = [
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
  comprobadorErrores,
];

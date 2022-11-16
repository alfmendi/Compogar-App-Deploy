import { body } from "express-validator";

import { comprobadorErrores } from "./comprobadorErrores.js";

// Permite establecer los requisitos necesarios para que el nombre
// sea considerado como válido
const nombre = body("nombre", "Nombre:Mínimo 3 caracteres")
  .exists()
  .trim()
  .not()
  .isEmpty()
  .escape()
  .isLength({ min: 3 });

// Permite establecer los requisitos necesarios para que el email
// sea considerado como válido
const email = body("email", "Email:Email no válido")
  .exists()
  .trim()
  .not()
  .isEmpty()
  .escape()
  .isEmail()
  .normalizeEmail();

// Permite establecer los requisitos necesarios para que el teléfono
// sea considerado como válido
const telefono = body("telefono", "Telefono:Teléfono no válido")
  .not()
  .isEmpty()
  .trim()
  .escape()
  .matches(/^[0-9]{9}$/);

// Permite establecer los requisitos necesarios para que el password
// sea considerado como válido
const password = body("password", "Password:Mínimo 6 caracteres")
  .exists()
  .trim()
  .not()
  .isEmpty()
  .escape()
  .isLength({
    min: 6,
  });

// Permite establecer los requisitos necesarios para que el confirmarPassword
// sea considerado como válido
const confirmarPassword = body("confirmarPassword")
  .exists()
  .trim()
  .not()
  .isEmpty()
  .escape()
  .custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("ConfirmarPassword:Passwords no coinciden");
    }
    // Indicates the success of this synchronous custom validator
    return true;
  });

// Validador para comprobar que los campos enviados en el login de los empleados son válidos
// Esta expresión (validadorLogin) se pasa como un array de middlewares a la ruta
// (Se puede pasar más de un middleware a un elemento en forma de array)
export const validadorLogin = [email, password, comprobadorErrores];

// Validador para comprobar que los campos enviados en el registro son válidos
// Esta expresión (validadorRegistro) se pasa como un array de middlewares a la ruta
// (Se puede pasar más de un middleware a un elemento en forma de array)
export const validadorRegistro = [
  nombre,
  email,
  telefono,
  password,
  confirmarPassword,
  comprobadorErrores,
];

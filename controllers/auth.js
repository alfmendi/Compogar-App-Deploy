import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

import Usuario from "../model/Usuario.js";

import ErrorAPIPropio from "../error/ErrorAPIPropio.js";

// -----------------------------------------------------
// POST /api/auth/login                                -
// Público                                             -
// Controlador para gestionar el login de los usuarios -
// -----------------------------------------------------
export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // Compruebo si el usuario no existe
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      throw new ErrorAPIPropio(401, "Credenciales no válidas");
    }

    // Compruebo que el password es válido
    const passwordValido = await bcryptjs.compare(password, usuario.password);
    if (!passwordValido) {
      throw new ErrorAPIPropio(401, "Credenciales no válidas");
    }

    // Genero el accessToken
    const accessToken = jwt.sign(
      { usuarioId: usuario.id },
      process.env.JWT_ACCESS_TOKEN_SECRETO,
      { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRACION }
    );

    // Genero el refreshToken
    const refreshToken = jwt.sign(
      { usuarioId: usuario.id },
      process.env.JWT_REFRESH_TOKEN_SECRETO,
      { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRACION }
    );

    // Guardo el refreshToken en el documento del usuario dentro de la base de datos
    usuario.refreshToken = refreshToken;
    await usuario.save();

    // Envio el Refresh Token como una httpOnly cookie. Una cookie
    // definida como httpOnly no es accesible por JavaScript,
    // por lo tanto no es accesible a los ataques. Access Token se envía normal.
    // Para hacer pruebas con Postman o Thunder Client se debe deshabilitar secure:true.
    // ES MUY IMPORTANTE HABILITAR SECURE:TRUE YA QUE SI NO SE HACE, EL REFRESH TOKEN NO SE ACTUALIZA
    return res
      .status(200)
      .cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: process.env.JWT_REFRESH_TOKEN_MAXAGE * 60 * 60 * 1000,
      })
      .json({
        usuarioId: usuario.id,
        nombre: usuario.nombre,
        accessToken,
      });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------------
// POST /api/auth/registro                                -
// Público                                                -
// Controlador para gestionar el registro de los usuarios -
// --------------------------------------------------------
export const registro = async (req, res, next) => {
  const { nombre, email, telefono, password } = req.body;
  try {
    // Compruebo si el usuario ya existe.
    const usuario = await Usuario.findOne({ email });
    if (usuario) {
      throw new ErrorAPIPropio(400, "Ya existe ese usuario");
    }

    // Genero el hash para el password
    const salt = await bcryptjs.genSalt(10);
    const passwordHash = await bcryptjs.hash(password, salt);

    // Creo el nuevo usuario
    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      telefono,
      password: passwordHash,
    });

    // Genero el accessToken. Realmente este token no sería necesario
    // crearlo en el registro ya que en mi caso, despues de hacer el registro voy
    // a la página de login. Si tras el registro fuese directamente a la zona privada
    // de la aplicación sí que sería necesario.
    const accessToken = jwt.sign(
      { usuarioId: nuevoUsuario.id },
      process.env.JWT_ACCESS_TOKEN_SECRETO,
      { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRACION }
    );

    // Genero el refreshToken. Realmente este token no sería necesario
    // crearlo en el registro ya que en mi caso, despues de hacer el registro voy
    // a la página de login. Si tras el registro fuese directamente a la zona privada
    // de la aplicación sí que sería necesario.
    const refreshToken = jwt.sign(
      { usuarioId: nuevoUsuario.id },
      process.env.JWT_REFRESH_TOKEN_SECRETO,
      { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRACION }
    );

    // Guardo el refreshToken en el documento del usuario dentro de la base de datos
    nuevoUsuario.refreshToken = refreshToken;
    await nuevoUsuario.save();

    // Envio el refreshToken como una httpOnly cookie. Una cookie
    // definida como httpOnly no es accesible por JavaScript,
    // por lo tanto no es accesible a los ataques. Access Token se envía normal
    // En producción se debe activar secure: true.
    // Para hacer pruebas con Postman o Thunder Client se debe deshabilitar secure:true.
    // ES MUY IMPORTANTE HABILITAR SECURE:TRUE YA QUE SI NO SE HACE, EL REFRESH TOKEN NO SE ACTUALIZA
    return res
      .status(201)
      .cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: process.env.JWT_REFRESH_TOKEN_MAXAGE * 60 * 60 * 1000,
      })
      .json({
        usuarioId: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        token: accessToken,
      });
  } catch (error) {
    next(error);
  }
};

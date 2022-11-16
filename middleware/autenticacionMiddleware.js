import jwt from "jsonwebtoken";

import ErrorAPIPropio from "../error/ErrorAPIPropio.js";

// -------------------------------------------------------------------
// Método que comprueba si existe la cabecera authorization.         -
// En caso afirmativo, se comprueba si existe un token(access token) -
// y se almacena en el objeto req el identificador del usuario       -
// que figura en la payload del access token                         -
// -------------------------------------------------------------------
const autenticacionMiddleware = (req, res, next) => {
  try {
    const autorizacion = req.headers.authorization;
    if (!autorizacion || !autorizacion.startsWith("Bearer ")) {
      throw new ErrorAPIPropio(401, "Credenciales no válidas");
    }
    const token = autorizacion.split(" ")[1];
    // El método verify devuelve el payload del token, en este caso { empleadoId: empleado.id }
    const tokenDecodificado = jwt.verify(
      token,
      process.env.JWT_ACCESS_TOKEN_SECRETO
    );
    if (!tokenDecodificado) {
      throw new ErrorAPIPropio(401, "Credenciales no válidas");
    }
    // if (!tokenDecodificado) {
    //   throw new ErrorAPIPropio(403, "Credenciales no válidas.403");
    // }
    // En el payload al hacer el jwt sign solamente puse
    // el valor  { empleadoId: empleado.id } por lo tanto
    // esa será la única información a almacenar en req.
    // Creo un nuevo campo en req llamado usuarioId en el
    // que almaceno el tokenDecodificado.usuarioId
    req.usuarioId = tokenDecodificado.usuarioId;
    next();
  } catch (error) {
    next(error);
  }
};

export default autenticacionMiddleware;

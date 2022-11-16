import origenesPermitidos from "../config/origenesPermitidos.js";

// ------------------------------------------------------------------------------------------------------------------
// Método que comprueba si el origen de la petición se encuentra dentro de los origenes permitidos                  -
// En caso afirmativo, se añade una nueva cabecera al objeto res con la clave Access-Control-Allow-Credentials:true -
// Esto soluciona el problema de "has been blcoked by CORS policy:                                                  -
// The value of the 'Access-Control-Allow-Credentilas' header in the response is '' which must be 'true' when       -
// the request's credentials mode is 'include'"                                                                     -
// ------------------------------------------------------------------------------------------------------------------
const credencialesMiddleware = (req, res, next) => {
  const origin = req.headers.origin;
  if (origenesPermitidos.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", true);
  }
  next();
};

export default credencialesMiddleware;

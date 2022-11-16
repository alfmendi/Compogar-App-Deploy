import origenesPermitidos from "./origenesPermitidos.js";

const opcionesCORS = {
  origin: (origin, callback) => {
    // En desarrollo se debe mantener !origin pero en producción se debería quitar
    if (origenesPermitidos.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

export default opcionesCORS;

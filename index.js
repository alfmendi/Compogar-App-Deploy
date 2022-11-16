import dotenv from "dotenv";
dotenv.config();

import chalk from "chalk";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Realizar la conexión con la base de datos
import("./db/conectarDB.js");

const app = express();

import opcionesCORS from "./config/opcionesCORS.js";
import credencialesMiddleware from "./middleware/credencialesMiddleware.js";
import loggerMiddleware from "./middleware/loggerMiddleware.js";
import manejarErroresMiddleware from "./middleware/manejarErroresMiddleware.js";

import authRouter from "./routes/auth.js";
import tokensRouter from "./routes/tokens.js";
import anunciosRouter from "./routes/anuncios.js";

// Middleware

// Tras hacer una petición con axios y habilitar withCredentials:true, aparece el siguiente error:
// Access to XMLHttpRequest at 'http://localhost:5000/api/auth/registro' from origin 'http://localhost:3000'
// has been blocked by CORS policy: Response to preflight request doesn't pass
// access control check: The value of the 'Access-Control-Allow-Origin' header in the response
// must not be the wildcard '*' when the request's credentials mode is 'include'.
// The credentials mode of requests initiated by the XMLHttpRequest is controlled by the withCredentials attribute.
// Para solventarlo, es necesario establecer una lista de origenes con acceso.

// Comprobamos las credenciales antes de CORS
app.use(credencialesMiddleware);
app.use(cors(opcionesCORS));

// app.use(express.json());
app.use(express.json({ limit: "25mb" }));
// app.use(express.urlencoded({ limit: "25mb" }));
// Este middleware es muy importante. Sin él, no hay acceso a las cookies en el servidor
app.use(cookieParser());
app.use(express.static("build"));

// Middleware
app.use(loggerMiddleware);

// Rutas
app.use("/api/auth", authRouter);
app.use("/api/tokens", tokensRouter);
app.use("/api/anuncios", anunciosRouter);

// POR FIN: ESTA SOLUCIÓN ES CORRECTA!!!!!!!!!!!!!
// La aplicación cada vez que se hacía un refresh (F5) llamaba al servidor
// con la dirección que figuraba en el navegador. Esto hacía que cualquier
// dirección que no fuese el raiz definido en app.use(express.static("build"))
// generase un error.
// Para solventarlo, se añade el siguiente código...
// app.get("*", function (request, response) {
//   response.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
// });

// ***** ACTIVAR CUANDO SE VAYA A SUBIR A HEROKU... *****
app.get("*", function (req, res) {
  res.sendFile(path.resolve(__dirname, "./build", "index.html"));
});

// Middleware
app.use(manejarErroresMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("");
  console.log(chalk.green("-------------------------------------------------"));
  console.log(chalk.green("------------COMIENZO DE LA APLICACIÓN------------"));
  console.log(chalk.green(`     Servidor ejecutandose en el puerto ${PORT}`));
  console.log(chalk.green("-------------------------------------------------"));
  console.log("");
});

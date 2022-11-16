import express from "express";
const router = express.Router();

import autenticacionMiddleware from "../middleware/autenticacionMiddleware.js";

import { validadorAnuncios } from "../validator/anuncios.js";

import {
  conseguirTodosAnuncios,
  conseguirAnuncioId,
  conseguirAnunciosUsuario,
  crearAnuncio,
  modificarAnuncio,
  eliminarAnuncio,
  conseguirTodosAnunciosAgrupados,
} from "../controllers/anuncios.js";

// Llevo a cabo la validación con express-validator
router.get("/", conseguirTodosAnuncios);
router.get("/grupo", conseguirTodosAnunciosAgrupados);
router.get("/anuncio/:anuncioId", conseguirAnuncioId);
router.get("/:usuarioId", autenticacionMiddleware, conseguirAnunciosUsuario);
router.post("/", autenticacionMiddleware, validadorAnuncios, crearAnuncio);
router.patch(
  "/:anuncioId",
  autenticacionMiddleware,
  validadorAnuncios,
  modificarAnuncio
);
router.delete("/:anuncioId", autenticacionMiddleware, eliminarAnuncio);

export default router;

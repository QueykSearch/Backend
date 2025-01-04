import { Router } from "express";
import { ttController } from "../modules/tt/infrastructure/index";

/**
 * Creamos un Router principal
 */
export const router = Router();

// Rutas específicas para el módulo TT
router.post("/tts", ttController.createTT, ttController.createTTHandler);

// Ruta de prueba para verificar que las rutas están funcionando
router.get("/test", (req, res) => {
  res.send("Ruta de test funcionando correctamente");
});

// ... otras rutas en el futuro (listar, actualizar, etc.)

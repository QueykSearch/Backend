import { Router } from "express";
import { ttController } from "../modules/tt/infrastructure/index";

/**
 * Creamos un Router principal
 */
export const router = Router();

// Rutas específicas para el módulo TT
router.post("/tts", ttController.createTT, ttController.createTTHandler);
router.get("/tts", ttController.listTT);
router.get("/tts/:ttId", ttController.getTTById);
router.put("/tts/:ttId", ttController.updateTT);
router.delete("/tts/:ttId", ttController.deleteTT);

// Ruta de prueba para verificar que las rutas están funcionando
router.get("/test", (req, res) => {
  res.send("Ruta de test funcionando correctamente");
});

import { Router } from "express";
import { ttController } from "../modules/tt/infrastructure/index";
import { userController } from "../modules/user/infrastructure/index";
// import { checkJwt, checkRoles } from '../middlewares/auth'; // Middlewares para Auth0

/**
 * Creamos un Router principal
 */
export const router = Router();

// // Rutas específicas para el módulo TT
// router.post("/tts", checkJwt, checkRoles('academico'), ttController.createTT, ttController.createTTHandler);
// router.get("/tts", checkJwt, checkRoles(['academico', 'gestor']), ttController.listTT);
// router.get("/tts/:ttId", checkJwt, checkRoles(['academico', 'gestor']), ttController.getTTById);
// router.put("/tts/:ttId", checkJwt, checkRoles('gestor'), ttController.updateTT);
// router.delete("/tts/:ttId", checkJwt, checkRoles('gestor'), ttController.deleteTT);

// // Rutas específicas para el módulo Usuario
// router.post("/users", userController.createUser); // Registro de usuarios, podría estar protegido si solo admins pueden crear usuarios
// router.get("/users", checkJwt, checkRoles(['admin']), userController.listUsers);
// router.get("/users/:userId", checkJwt, checkRoles(['admin', 'self']), userController.getUserById);
// router.put("/users/:userId", checkJwt, checkRoles(['admin', 'self']), userController.updateUser);
// router.delete("/users/:userId", checkJwt, checkRoles('admin'), userController.deleteUser);
// router.post("/login", userController.loginUser); // Opcional: Ruta de login si es necesario

router.get("/tts/semantic", ttController.searchSemanticTT);
router.post(
  "/tts/metadata",
  ttController.createTT,
  ttController.extractMetadata
);
router.post("/tts/multiple", ttController.getMultipleTTs);
router.post("/tts", ttController.createTT, ttController.createTTHandler);
router.get("/tts", ttController.listTT);
router.get("/tts/:ttId", ttController.getTTById);
router.put("/tts/:ttId", ttController.updateTT);
router.delete("/tts/:ttId", ttController.deleteTT);
router.get("/tts/:ttId/download", ttController.downloadTT);
router.patch("/tts/:ttId/approve", ttController.approveTT);
router.patch("/tts/:ttId/reject", ttController.rejectTT);

// Rutas específicas para el módulo Usuario
router.post("/users", userController.createUser); // Registro de usuarios, podría estar protegido si solo admins pueden crear usuarios
router.get("/users", userController.listUsers);
router.get("/users/:userId", userController.getUserById);
router.put("/users/:userId", userController.updateUser);
router.delete("/users/:userId", userController.deleteUser);
router.post("/refresh-token", userController.refreshToken); // Opcional: Ruta de refresco de token
router.post("/login", userController.loginUser); // Opcional: Ruta de login si es necesario
router.post("/login-with-token", userController.loginUserWithToken); // Opcional: Ruta de login con token
router.post("/users/:userId/history", userController.addTTToHistory);
router.get("/users/:userId/history", userController.getUserHistory);

// Ruta de prueba para verificar que las rutas están funcionando
router.get("/test", (req, res) => {
  res.send("Ruta de test funcionando correctamente");
});

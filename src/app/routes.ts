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

router.post("/tts", ttController.createTT, ttController.createTTHandler);
router.get("/tts", ttController.listTT);
router.get("/tts/:ttId", ttController.getTTById);
router.put("/tts/:ttId", ttController.updateTT);
router.delete("/tts/:ttId", ttController.deleteTT);
router.get("/tts/:ttId/download", ttController.downloadTT);

// Rutas específicas para el módulo Usuario
router.post("/users", userController.createUser); // Registro de usuarios, podría estar protegido si solo admins pueden crear usuarios
router.get("/users", userController.listUsers);
router.get("/users/:userId", userController.getUserById);
router.put("/users/:userId", userController.updateUser);
router.delete("/users/:userId", userController.deleteUser);
router.post("/login", userController.loginUser); // Opcional: Ruta de login si es necesario

// Ruta de prueba para verificar que las rutas están funcionando
router.get("/test", (req, res) => {
  res.send("Ruta de test funcionando correctamente");
});

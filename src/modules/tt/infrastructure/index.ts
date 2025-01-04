import multer from "multer";
import { MongoTTRepository } from "./repositories/MongoTTRepository";
import { CreateTTUseCase } from "../application/useCases/CreateTTUseCase";
import { TTController } from "./controllers/TTController";
import { GoogleCloudStorageService } from "./services/GoogleCloudStorageService";

// 1. Instancia del repositorio (Mongo)
const ttRepository = new MongoTTRepository();

// 2. Instancia del caso de uso
const createTTUseCase = new CreateTTUseCase(ttRepository);

// 3. Instancia del servicio de GCS
const googleCloudService = new GoogleCloudStorageService();

// 4. Instancia del controlador
const controller = new TTController(createTTUseCase, googleCloudService);

// 5. Configurar Multer
const upload = multer({ storage: multer.memoryStorage() });

// 6. Exportar el controlador con el middleware de multer
export const ttController = {
  createTT: upload.single("file"),
  createTTHandler: controller.createTT,
};

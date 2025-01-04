import multer from "multer";
import { MongoTTRepository } from "./repositories/MongoTTRepository";
import { CreateTTUseCase } from "../application/useCases/CreateTTUseCase";
import { ListTTUseCase } from "../application/useCases/ListTTUseCase";
import { GetTTByIdUseCase } from "../application/useCases/GetTTByIdUseCase";
import { UpdateTTUseCase } from "../application/useCases/UpdateTTUseCase";
import { DeleteTTUseCase } from "../application/useCases/DeleteTTUseCase";
import { TTController } from "./controllers/TTController";
import { GoogleCloudStorageService } from "./services/GoogleCloudStorageService";
// import { DeepPartial } from '../../../shared/types/DeepPartial';

// 1. Instancia del repositorio (Mongo)
const ttRepository = new MongoTTRepository();

// 2. Instancia de los casos de uso
const createTTUseCase = new CreateTTUseCase(ttRepository);
const listTTUseCase = new ListTTUseCase(ttRepository);
const getTTByIdUseCase = new GetTTByIdUseCase(ttRepository);
const updateTTUseCase = new UpdateTTUseCase(ttRepository);
const deleteTTUseCase = new DeleteTTUseCase(ttRepository);

// 3. Instancia del servicio de GCS
const googleCloudService = new GoogleCloudStorageService();

// 4. Instancia del controlador
const controller = new TTController(
  createTTUseCase,
  listTTUseCase,
  getTTByIdUseCase,
  updateTTUseCase,
  deleteTTUseCase,
  googleCloudService
);

// 5. Configurar Multer
const upload = multer({ storage: multer.memoryStorage() });

// 6. Exportar el controlador con los middlewares
export const ttController = {
  createTT: upload.single("file"),
  createTTHandler: controller.createTT,
  listTT: controller.listTT,
  getTTById: controller.getTTById,
  updateTT: controller.updateTT,
  deleteTT: controller.deleteTT,
};

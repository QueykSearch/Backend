import multer from "multer";
import { MongoTTRepository } from "./repositories/MongoTTRepository";
import { CreateTTUseCase } from "../application/useCases/CreateTTUseCase";
import { ListTTUseCase } from "../application/useCases/ListTTUseCase";
import { GetTTByIdUseCase } from "../application/useCases/GetTTByIdUseCase";
import { UpdateTTUseCase } from "../application/useCases/UpdateTTUseCase";
import { DeleteTTUseCase } from "../application/useCases/DeleteTTUseCase";
import { SemanticSearchUseCase } from "../application/useCases/SemanticSearchUseCase";
import { TTController } from "./controllers/TTController";
import { GoogleCloudStorageService } from "./services/GoogleCloudStorageService";
import { EmbeddingService } from "./services/EmbeddingService";
import { ExtractMetadataUseCase } from "../application/useCases/ExtractMetadataUseCase";
import { MetadataExtractorService } from "./services/MetadataExtractorService";
import { ApproveTTUseCase } from "../application/useCases/ApproveTTUseCase";
import { RejectTTUseCase } from "../application/useCases/RejectTTUseCase";
import { GetMultipleTTsUseCase } from "../application/useCases/GetMultipleTTsUseCase";
// import { DeepPartial } from '../../../shared/types/DeepPartial';

// 1. Instancia del repositorio (Mongo)
const embeddingService = new EmbeddingService();
const ttRepository = new MongoTTRepository();

// 2. Instancia de los casos de uso
const createTTUseCase = new CreateTTUseCase(ttRepository, embeddingService);
const listTTUseCase = new ListTTUseCase(ttRepository);
const getTTByIdUseCase = new GetTTByIdUseCase(ttRepository);
const updateTTUseCase = new UpdateTTUseCase(ttRepository, embeddingService);
const deleteTTUseCase = new DeleteTTUseCase(ttRepository);
const approveTTUseCase = new ApproveTTUseCase(ttRepository);
const rejectTTUseCase = new RejectTTUseCase(ttRepository);
const getMultipleTTsUseCase = new GetMultipleTTsUseCase(ttRepository);

const semanticSearchUseCase = new SemanticSearchUseCase(
  ttRepository,
  embeddingService
);
const metadataExtractorService = new MetadataExtractorService();
const extractMetadataUseCase = new ExtractMetadataUseCase(
  metadataExtractorService
);
// 3. Instancia del servicio de GCS
const googleCloudService = new GoogleCloudStorageService();

// 4. Instancia del controlador
const controller = new TTController(
  createTTUseCase,
  listTTUseCase,
  getTTByIdUseCase,
  updateTTUseCase,
  deleteTTUseCase,
  approveTTUseCase,
  rejectTTUseCase,
  getMultipleTTsUseCase,
  googleCloudService,
  semanticSearchUseCase,
  extractMetadataUseCase
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
  downloadTT: controller.downloadTT,
  searchSemanticTT: controller.searchSemanticTT,
  extractMetadata: controller.extractMetadata,
  approveTT: controller.approveTT,
  rejectTT: controller.rejectTT,
  getMultipleTTs: controller.getMultipleTTs,
};

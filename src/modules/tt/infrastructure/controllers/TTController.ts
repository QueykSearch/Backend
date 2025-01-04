import { Request, Response, NextFunction } from "express";
import { CreateTTUseCase } from "../../application/useCases/CreateTTUseCase";
import { GoogleCloudStorageService } from "../services/GoogleCloudStorageService";
import { CreateTTDTO } from "../dtos/CreateTTDTO";

/**
 * Controlador para manejar peticiones HTTP relacionadas con TT.
 */
export class TTController {
  constructor(
    private readonly createTTUseCase: CreateTTUseCase,
    private readonly googleCloudService: GoogleCloudStorageService
  ) {}

  public createTT = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Extraer los datos del body (DTO)
      const body: CreateTTDTO = req.body;
      const file = req.file; // vía multer

      // Si hay archivo, subimos primero a GCS
      let fileUrl = "";
      if (file) {
        fileUrl = await this.googleCloudService.uploadFile(file);
      }

      // Creamos el TT
      const newTT = await this.createTTUseCase.execute({
        titulo: body.titulo,
        autores: body.autores,
        palabrasClave: body.palabrasClave,
        unidadAcademica: body.unidadAcademica,
        directores: body.directores,
        grado: body.grado,
        resumen: body.resumen,
        documentoUrl: fileUrl || "", // Guardamos la URL
        fechaPublicacion: new Date(body.fechaPublicacion || Date.now()),
      });

      // Enviar la respuesta sin retornar
      res.status(201).json({
        message: "TT creado con éxito",
        data: newTT,
      });
    } catch (error: any) {
      // Pasar el error al manejador de errores de Express
      next(error);
    }
  };
}

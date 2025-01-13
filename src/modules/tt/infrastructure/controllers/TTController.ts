import { Request, Response, NextFunction } from "express";
import { CreateTTUseCase } from "../../application/useCases/CreateTTUseCase";
import { ListTTUseCase } from "../../application/useCases/ListTTUseCase";
import { GetTTByIdUseCase } from "../../application/useCases/GetTTByIdUseCase";
import { UpdateTTUseCase } from "../../application/useCases/UpdateTTUseCase";
import { DeleteTTUseCase } from "../../application/useCases/DeleteTTUseCase";
import { GoogleCloudStorageService } from "../services/GoogleCloudStorageService";
import { CreateTTDTO } from "../dtos/CreateTTDTO";
import { UpdateTTDTO } from "../dtos/UpdateTTDTO";
import { DeepPartial } from "../../../../shared/types/DeepPartial";
import { TTEntity } from "../../domain/entities/TTEntity";
import { SemanticSearchUseCase } from "../../application/useCases/SemanticSearchUseCase";
import { ExtractMetadataUseCase } from "../../application/useCases/ExtractMetadataUseCase";
import { ApproveTTUseCase } from "../../application/useCases/ApproveTTUseCase";
import { RejectTTUseCase } from "../../application/useCases/RejectTTUseCase";
import { GetMultipleTTsUseCase } from "../../application/useCases/GetMultipleTTsUseCase";

/**
 * Controlador para manejar peticiones HTTP relacionadas con TT.
 */
export class TTController {
  constructor(
    private readonly createTTUseCase: CreateTTUseCase,
    private readonly listTTUseCase: ListTTUseCase,
    private readonly getTTByIdUseCase: GetTTByIdUseCase,
    private readonly updateTTUseCase: UpdateTTUseCase,
    private readonly deleteTTUseCase: DeleteTTUseCase,
    private readonly approveTTUseCase: ApproveTTUseCase,
    private readonly rejectTTUseCase: RejectTTUseCase,
    private readonly getMultipleTTsUseCase: GetMultipleTTsUseCase,
    private readonly googleCloudService: GoogleCloudStorageService,
    private readonly semanticSearchUseCase: SemanticSearchUseCase,
    private readonly extractMetadataUseCase: ExtractMetadataUseCase
  ) {}

  public downloadTT = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { ttId } = req.params;
      if (!ttId) {
        res.status(400).json({ message: "ttId es requerido" });
        return;
      }

      // Buscar TT
      const tt = await this.getTTByIdUseCase.execute(ttId);
      if (!tt) {
        res.status(404).json({ message: "TT no encontrado" });
        return;
      }

      // Verificar si hay un archivo asociado
      if (!tt.filename) {
        res.status(404).json({ message: "No hay archivo asociado" });
        return;
      }

      // Generar la URL firmada
      const signedUrl = await this.googleCloudService.getSignedUrl(tt.filename);

      // Responder con la URL firmada
      res.json({
        message: "URL generada con éxito",
        downloadUrl: signedUrl,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Maneja la creación de un nuevo TT.
   */
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

      // Campos que vienen como JSON
      // const autores = JSON.parse(req.body.autores || "[]");
      // const directores = JSON.parse(req.body.directores || "[]");
      // const palabrasClave = JSON.parse(req.body.palabrasClave || "[]");

      const newTT = await this.createTTUseCase.execute({
        titulo: body.titulo,
        autores:
          typeof body.autores === "string"
            ? JSON.parse(body.autores)
            : body.autores,
        directores:
          typeof body.directores === "string"
            ? JSON.parse(body.directores)
            : body.directores,
        palabrasClave:
          typeof body.palabrasClave === "string"
            ? JSON.parse(body.palabrasClave)
            : body.palabrasClave,
        unidadAcademica: body.unidadAcademica,
        grado: body.grado,
        resumen: body.resumen,
        documentoUrl: fileUrl || "", // Guardamos la URL
        filename: file ? file.originalname : "",
        fechaPublicacion: body.fechaPublicacion
          ? new Date(body.fechaPublicacion)
          : new Date(),

        createdBy: body.createdBy, // <-- Recibido del frontend
        status: body.status || "pendiente",
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

  /**
   * Maneja la lista de TTs con filtros y paginación.
   */
  public listTT = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = {
        titulo: req.query.titulo as string,
        autor: req.query.autor as string,
        unidadAcademica: req.query.unidadAcademica as string,
        grado: req.query.grado as string,
        palabrasClave: req.query.palabrasClave
          ? Array.isArray(req.query.palabrasClave)
            ? (req.query.palabrasClave as string[])
            : [req.query.palabrasClave as string]
          : [],
        anoPublicacion: req.query.anoPublicacion
          ? Number(req.query.anoPublicacion)
          : undefined,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        page: req.query.page ? Number(req.query.page) : 1,

        // nuevo:
        createdBy: (req.query.createdBy as string) || undefined,
        status: (req.query.status as string) || undefined,
      };

      const result = await this.listTTUseCase.execute(filters);

      res.status(200).json({
        message: "Lista de TTs obtenida con éxito",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Maneja obtener un TT por su ID.
   */
  public getTTById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { ttId } = req.params;

      if (!ttId) {
        res.status(400).json({ message: "ttId es requerido" });
        return;
      }

      const tt = await this.getTTByIdUseCase.execute(ttId);

      if (!tt) {
        res.status(404).json({ message: "TT no encontrado" });
        return;
      }

      res.status(200).json({
        message: "TT obtenido con éxito",
        data: tt,
      });
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * Maneja actualizar un TT existente.
   */
  public updateTT = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { ttId } = req.params;
      const updateData: UpdateTTDTO = req.body;

      if (!ttId) {
        res.status(400).json({ message: "ttId es requerido" });
        return;
      }

      const updatedTT = await this.updateTTUseCase.execute(
        ttId,
        updateData as DeepPartial<TTEntity>
      );

      if (!updatedTT) {
        res.status(404).json({ message: "TT no encontrado" });
        return;
      }

      res.status(200).json({
        message: "TT actualizado con éxito",
        data: updatedTT,
      });
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * Maneja eliminar un TT.
   */
  public deleteTT = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { ttId } = req.params;

      if (!ttId) {
        res.status(400).json({ message: "ttId es requerido" });
        return;
      }

      const deleted = await this.deleteTTUseCase.execute(ttId);

      if (!deleted) {
        res.status(404).json({ message: "TT no encontrado" });
        return;
      }

      res.status(200).json({
        message: "TT eliminado con éxito",
      });
    } catch (error: any) {
      next(error);
    }
  };

  public searchSemanticTT = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const queryString = req.query.query as string;
      if (!queryString) {
        res.status(400).json({ message: "Falta 'query' en los query params" });
        return;
      }
      const limit = req.query.limit ? Number(req.query.limit) : 6;
      const results = await this.semanticSearchUseCase.execute(
        queryString,
        limit
      );
      res.json({
        message: "Resultados semánticos",
        data: results,
      });
      return;
    } catch (error) {
      next(error);
    }
  };
  public extractMetadata = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const file = req.file;
      if (!file) {
        res.status(400).json({ message: "Falta el pdf en el req" });
        return;
      }
      const metadata = await this.extractMetadataUseCase.execute(file.buffer);
      res.json({
        message: "Metadata Extraida Correctamente",
        data: metadata,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Maneja la aprobación de un TT.
   */
  public approveTT = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { ttId } = req.params;
      if (!ttId) {
        res.status(400).json({ message: "Falta el TT ID" });
        return;
      }
      const updated = await this.approveTTUseCase.execute(ttId);
      if (!updated) {
        res.status(404).json({ message: "TT no encontrado" });
        return;
      }
      res.status(200).json({
        message: "TT aprobado con éxito",
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  };

  public rejectTT = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { ttId } = req.params;
      if (!ttId) {
        res.status(400).json({ message: "Falta el TT ID" });
        return;
      }
      const updated = await this.rejectTTUseCase.execute(ttId);
      if (!updated) {
        res.status(404).json({ message: "TT no encontrado" });
        return;
      }
      res.status(200).json({
        message: "TT rechazado con éxito",
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /tts/multiple
   * Obtiene detalles de múltiples TT's dado un arreglo de IDs.
   */
  public getMultipleTTs = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { ttIds } = req.body;

      if (!ttIds || !Array.isArray(ttIds)) {
        res.status(400).json({
          message:
            "Se requiere un arreglo de TT IDs en el cuerpo de la solicitud",
        });
        return;
      }

      const tts = await this.getMultipleTTsUseCase.execute(ttIds);

      res.status(200).json({
        message: "TT's obtenidos con éxito",
        data: tts,
      });
    } catch (error: any) {
      next(error);
    }
  };
}

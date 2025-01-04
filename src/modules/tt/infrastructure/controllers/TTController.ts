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
    private readonly googleCloudService: GoogleCloudStorageService
  ) {}

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
      const newTT = await this.createTTUseCase.execute({
        titulo: body.titulo,
        autores: body.autores,
        palabrasClave: body.palabrasClave,
        unidadAcademica: body.unidadAcademica,
        directores: body.directores,
        grado: body.grado,
        resumen: body.resumen,
        documentoUrl: fileUrl || "", // Guardamos la URL
        fechaPublicacion: new Date(),
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
  public listTT = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Extraer los parámetros de la query
      const filters = {
        titulo: req.query.titulo as string,
        autor: req.query.autor as string,
        unidadAcademica: req.query.unidadAcademica as string,
        grado: req.query.grado as string,
        palabrasClave: Array.isArray(req.query.palabrasClave)
          ? (req.query.palabrasClave as string[])
          : req.query.palabrasClave
          ? [req.query.palabrasClave as string]
          : [],
        anoPublicacion: req.query.anoPublicacion
          ? Number(req.query.anoPublicacion)
          : undefined,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        page: req.query.page ? Number(req.query.page) : 1,
      };

      // Ejecutar el caso de uso
      const result = await this.listTTUseCase.execute(filters);

      // Enviar la respuesta
      res.status(200).json({
        message: "Lista de TTs obtenida con éxito",
        data: result,
      });
    } catch (error: any) {
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
}
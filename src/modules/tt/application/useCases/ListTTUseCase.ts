import { TTRepositoryPort } from "../../domain/TTRepositoryPort";
import { TTEntity } from "../../domain/entities/TTEntity";

/**
 * Caso de uso para listar TTs con filtros y paginación.
 */
export class ListTTUseCase {
  constructor(private readonly ttRepository: TTRepositoryPort) {}

  /**
   * Ejecuta el caso de uso para listar TTs.
   * @param filters - Filtros de búsqueda y paginación
   * @returns Lista de TTs con total, página, límite y datos
   */
  public async execute(filters: {
    titulo?: string;
    autor?: string;
    unidadAcademica?: string;
    grado?: string;
    palabrasClave?: string[];
    anoPublicacion?: number;
    createdBy?: string; // <--
    status?: string; // <--
    limit?: number;
    page?: number;
  }): Promise<{
    total: number;
    page: number;
    limit: number;
    data: TTEntity[];
  }> {
    return this.ttRepository.listTT(filters);
  }
}

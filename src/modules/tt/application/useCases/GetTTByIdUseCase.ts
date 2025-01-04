import { TTRepositoryPort } from "../../domain/TTRepositoryPort";
import { TTEntity } from "../../domain/entities/TTEntity";

/**
 * Caso de uso para obtener un TT por su ID.
 */
export class GetTTByIdUseCase {
  constructor(private readonly ttRepository: TTRepositoryPort) {}

  /**
   * Ejecuta el caso de uso para obtener un TT por ID.
   * @param id - ID del TT
   * @returns TTEntity o null si no se encuentra
   */
  public async execute(id: string): Promise<TTEntity | null> {
    return await this.ttRepository.findTTById(id);
  }
}

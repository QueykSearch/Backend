import { TTRepositoryPort } from "../../domain/TTRepositoryPort";

/**
 * Caso de uso para eliminar un TT.
 */
export class DeleteTTUseCase {
  constructor(private readonly ttRepository: TTRepositoryPort) {}

  /**
   * Ejecuta el caso de uso para eliminar un TT.
   * @param id - ID del TT a eliminar
   * @returns true si se eliminó, false si no se encontró
   */
  public async execute(id: string): Promise<boolean> {
    const result = await this.ttRepository.deleteTTById(id);
    return result.deletedCount > 0;
  }
}

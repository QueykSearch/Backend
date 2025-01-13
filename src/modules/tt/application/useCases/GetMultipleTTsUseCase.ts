import { TTRepositoryPort } from "../../domain/TTRepositoryPort";
import { TTEntity } from "../../domain/entities/TTEntity";

export class GetMultipleTTsUseCase {
  constructor(private readonly ttRepository: TTRepositoryPort) {}

  /**
   * Ejecuta el caso de uso para obtener múltiples TT's.
   * @param ttIds - Array de IDs de TT's
   * @returns Array de TTEntity
   */
  public async execute(ttIds: string[]): Promise<TTEntity[]> {
    if (!ttIds || !Array.isArray(ttIds)) {
      throw new Error("Se requiere un arreglo de TT IDs");
    }

    return await this.ttRepository.getMultipleTTs(ttIds);
  }
}

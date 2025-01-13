import { TTRepositoryPort } from "../../domain/TTRepositoryPort";
import { TTEntity } from "../../domain/entities/TTEntity";

/**
 * Caso de uso para aprobar un TT (cambiar su status a "aprobado").
 */
export class ApproveTTUseCase {
  constructor(private readonly ttRepository: TTRepositoryPort) {}

  /**
   * Ejecuta el caso de uso para aprobar un TT.
   * @param ttId - ID del TT
   * @returns TTEntity actualizada o null si no se encuentra
   */
  public async execute(ttId: string): Promise<TTEntity | null> {
    return this.ttRepository.updateTTById(ttId, { status: "aprobado" });
  }
}

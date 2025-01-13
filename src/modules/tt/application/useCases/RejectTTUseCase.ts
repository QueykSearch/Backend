import { TTRepositoryPort } from "../../domain/TTRepositoryPort";
import { TTEntity } from "../../domain/entities/TTEntity";

/**
 * Caso de uso para rechazar un TT (cambiar su status a "rechazado").
 */
export class RejectTTUseCase {
  constructor(private readonly ttRepository: TTRepositoryPort) {}

  /**
   * Ejecuta el caso de uso para rechazar un TT.
   * @param ttId - ID del TT
   * @returns TTEntity actualizada o null si no se encuentra
   */
  public async execute(ttId: string): Promise<TTEntity | null> {
    return this.ttRepository.updateTTById(ttId, { status: "rechazado" });
  }
}

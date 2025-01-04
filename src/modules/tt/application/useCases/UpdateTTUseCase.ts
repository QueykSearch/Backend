// src/modules/tt/application/useCases/UpdateTTUseCase.ts

import { TTRepositoryPort } from "../../domain/TTRepositoryPort";
import { TTEntity } from "../../domain/entities/TTEntity";
import { DeepPartial } from "../../../../shared/types/DeepPartial";

/**
 * Caso de uso para actualizar un TT existente.
 */
export class UpdateTTUseCase {
  constructor(private readonly ttRepository: TTRepositoryPort) {}

  /**
   * Ejecuta el caso de uso para actualizar un TT.
   * @param id - ID del TT a actualizar
   * @param updateData - Datos a actualizar
   * @returns TTEntity actualizada o null si no se encuentra
   */
  public async execute(
    id: string,
    updateData: DeepPartial<TTEntity>
  ): Promise<TTEntity | null> {
    return await this.ttRepository.updateTTById(id, updateData);
  }
}

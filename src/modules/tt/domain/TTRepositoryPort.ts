// src/modules/tt/domain/TTRepositoryPort.ts

import { TTEntity } from "./entities/TTEntity";
import { DeepPartial } from "../../../shared/types/DeepPartial";

/**
 * Puerto (interfaz) que define las operaciones del repositorio TT.
 */
export interface TTRepositoryPort {
  createTT(tt: TTEntity): Promise<TTEntity>;

  listTT(filters: {
    titulo?: string;
    autor?: string;
    unidadAcademica?: string;
    grado?: string;
    palabrasClave?: string[];
    anoPublicacion?: number;
    limit?: number;
    page?: number;
  }): Promise<{ total: number; page: number; limit: number; data: TTEntity[] }>;

  findTTById(id: string): Promise<TTEntity | null>;

  updateTTById(
    id: string,
    updateData: DeepPartial<TTEntity>
  ): Promise<TTEntity | null>;

  deleteTTById(id: string): Promise<{ deletedCount: number }>;

  findBySemanticQuery(embedding: number[], limit: number): Promise<TTEntity[]>;

  getMultipleTTs(ttIds: string[]): Promise<TTEntity[]>;
  // downloadTT(id: string): Promise<{ filename: string }>;
}

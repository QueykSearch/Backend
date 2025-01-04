import { TTEntity } from "./entities/TTEntity";

/**
 * Puerto (interfaz) que define las operaciones del repositorio TT.
 */
export interface TTRepositoryPort {
  createTT(tt: TTEntity): Promise<TTEntity>;
  // Podrías añadir: findById, updateTT, deleteTT, etc.
}

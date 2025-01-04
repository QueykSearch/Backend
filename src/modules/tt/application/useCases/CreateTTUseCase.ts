import { TTRepositoryPort } from "../../domain/TTRepositoryPort";
import { TTEntity } from "../../domain/entities/TTEntity";

/**
 * Caso de uso para crear un nuevo TT en la base de datos.
 */
export class CreateTTUseCase {
  constructor(private readonly ttRepository: TTRepositoryPort) {}

  public async execute(ttData: TTEntity): Promise<TTEntity> {
    // Aquí podríamos incluir validaciones, lógica de negocio, etc.
    // Por ejemplo, checar que el título no sea vacío:
    if (!ttData.titulo) {
      throw new Error("El título no puede estar vacío");
    }

    // Llamamos al repositorio para guardar
    const newTT = await this.ttRepository.createTT(ttData);
    return newTT;
  }
}

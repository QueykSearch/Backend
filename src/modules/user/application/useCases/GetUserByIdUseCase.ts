import { UserRepositoryPort } from "../../domain/UserRepositoryPort";
import { UserEntity } from "../../domain/entities/UserEntity";

/**
 * Caso de uso para obtener un Usuario por su ID.
 */
export class GetUserByIdUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  /**
   * Ejecuta el caso de uso para obtener un Usuario por ID.
   * @param id - ID del Usuario
   * @returns UsuarioEntity o null si no se encuentra
   */
  public async execute(id: string): Promise<UserEntity | null> {
    return await this.userRepository.findUserById(id);
  }
}

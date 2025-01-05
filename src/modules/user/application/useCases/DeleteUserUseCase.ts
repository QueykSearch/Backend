import { UserRepositoryPort } from "../../domain/UserRepositoryPort";

/**
 * Caso de uso para eliminar un Usuario.
 */
export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  /**
   * Ejecuta el caso de uso para eliminar un Usuario.
   * @param id - ID del Usuario a eliminar
   * @returns true si se eliminó, false si no se encontró
   */
  public async execute(id: string): Promise<boolean> {
    // Eliminar el Usuario en Auth0 también si es necesario
    // await this.auth0Service.deleteUser(id);

    const result = await this.userRepository.deleteUserById(id);
    return result.deletedCount > 0;
  }
}

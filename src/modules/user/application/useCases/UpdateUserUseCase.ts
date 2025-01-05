import { UserRepositoryPort } from "../../domain/UserRepositoryPort";
import { UserEntity } from "../../domain/entities/UserEntity";
import { DeepPartial } from "../../../../shared/types/DeepPartial";

/**
 * Caso de uso para actualizar un Usuario existente.
 */
export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  /**
   * Ejecuta el caso de uso para actualizar un Usuario.
   * @param id - ID del Usuario a actualizar
   * @param updateData - Datos a actualizar
   * @returns UsuarioEntity actualizada o null si no se encuentra
   */
  public async execute(
    id: string,
    updateData: DeepPartial<UserEntity>
  ): Promise<UserEntity | null> {
    // Si se actualiza el email, verificar si ya existe en Auth0
    if (updateData.email) {
      const existingUser = await this.userRepository.findUserByEmail(
        updateData.email
      );
      if (existingUser && existingUser._id !== id) {
        throw new Error("El email ya está en uso");
      }
      // Actualizar el email en Auth0 también si es necesario
      // await this.auth0Service.updateUserEmail(id, updateData.email);
    }

    // Actualizar el Usuario en la base de datos (solo datos adicionales si es necesario)
    return await this.userRepository.updateUserById(id, updateData);
  }
}

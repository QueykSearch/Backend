import { UserRepositoryPort } from "../../domain/UserRepositoryPort";
import { UserEntity } from "../../domain/entities/UserEntity";

/**
 * Caso de uso para listar Usuarios con filtros y paginación.
 */
export class ListUsersUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  /**
   * Ejecuta el caso de uso para listar Usuarios.
   * @param filters - Filtros de búsqueda y paginación
   * @returns Lista de Usuarios con total, página, límite y datos
   */
  public async execute(filters: {
    nombreCompleto?: string;
    email?: string;
    role?: string;
    limit?: number;
    page?: number;
  }): Promise<{
    total: number;
    page: number;
    limit: number;
    data: UserEntity[];
  }> {
    return await this.userRepository.listUsers(filters);
  }
}

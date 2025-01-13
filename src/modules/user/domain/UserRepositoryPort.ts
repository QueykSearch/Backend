import { UserEntity } from "./entities/UserEntity";
import { DeepPartial } from "../../../shared/types/DeepPartial";

/**
 * Puerto (interfaz) que define las operaciones del repositorio de Usuarios.
 */
export interface UserRepositoryPort {
  createUser(user: UserEntity): Promise<UserEntity>;

  listUsers(filters: {
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
  }>;

  findUserById(id: string): Promise<UserEntity | null>;

  findUserByEmail(email: string): Promise<UserEntity | null>;

  updateUserById(
    id: string,
    updateData: DeepPartial<UserEntity>
  ): Promise<UserEntity | null>;

  deleteUserById(id: string): Promise<{ deletedCount: number }>;

  /**
   * Agrega un TT al historial del usuario, manteniendo un máximo de `maxLength` TTs.
   * Si el TT ya está en el historial, lo mueve al inicio.
   * @param userId - ID del usuario
   * @param ttId - ID del TT visitado
   * @param maxLength - Máximo de TT's en el historial
   */
  addToHistory(userId: string, ttId: string, maxLength: number): Promise<void>;

  /**
   * Obtiene el historial de TT's de un usuario.
   * @param userId - ID del usuario
   * @returns Array de IDs de TT's
   */
  getHistory(userId: string): Promise<string[]>;
}

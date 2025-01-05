import { UserEntity } from './entities/UserEntity';
import { DeepPartial } from '../../../shared/types/DeepPartial';

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
  }): Promise<{ total: number; page: number; limit: number; data: UserEntity[] }>;
  
  findUserById(id: string): Promise<UserEntity | null>;
  
  findUserByEmail(email: string): Promise<UserEntity | null>;
  
  updateUserById(id: string, updateData: DeepPartial<UserEntity>): Promise<UserEntity | null>;
  
  deleteUserById(id: string): Promise<{ deletedCount: number }>;
}

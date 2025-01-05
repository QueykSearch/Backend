/**
 * DTO para listar Usuarios.
 */
export interface ListUsersDTO {
  nombreCompleto?: string;
  email?: string;
  role?: string;
  limit?: number;
  page?: number;
}

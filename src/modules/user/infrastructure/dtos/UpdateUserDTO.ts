export interface UpdateUserDTO {
  nombreCompleto?: string;
  email?: string;
  // password?: string; // Removido si Auth0 maneja la contraseña
  roles?: string[];
  // Otros campos opcionales según necesidad
}

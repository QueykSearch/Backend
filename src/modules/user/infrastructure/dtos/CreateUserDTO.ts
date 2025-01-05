export interface CreateUserDTO {
  nombreCompleto: string;
  email: string;
  // password: string; // Removido si Auth0 maneja la contraseña
  roles?: string[]; // Opcional, se asignarán roles predeterminados si no se proporcionan
}

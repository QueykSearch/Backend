export interface CreateUserDTO {
  nombreCompleto: string;
  email: string;
  password: string;
  roles?: string[]; // Opcional, se asignarán roles predeterminados si no se proporcionan
}

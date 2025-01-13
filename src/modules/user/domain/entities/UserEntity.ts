/**
 * Entidad que representa un Usuario.
 */
export interface UserEntity {
  _id?: string;
  nombreCompleto: string;
  email: string;
  roles: string[]; // Ejemplo: ['admin', 'user']
  fechaRegistro?: Date;
  // ultimoLogin?: Date;
  history?: string[];
  // Otras propiedades que consideres necesarias
}

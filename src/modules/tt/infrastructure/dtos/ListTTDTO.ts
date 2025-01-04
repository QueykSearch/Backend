/**
 * DTO para listar TTs.
 */
export interface ListTTDTO {
  titulo?: string;
  autor?: string;
  unidadAcademica?: string;
  grado?: string;
  palabrasClave?: string[];
  anoPublicacion?: number;
  limit?: number;
  page?: number;
}

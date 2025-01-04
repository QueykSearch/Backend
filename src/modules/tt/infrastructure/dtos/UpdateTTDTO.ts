/**
 * DTO para actualizar un TT.
 */
export interface UpdateTTDTO {
  titulo?: string;
  autores?: Array<{
    nombreCompleto?: string;
    orcid?: string;
  }>;
  palabrasClave?: string[];
  unidadAcademica?: string;
  directores?: Array<{
    nombreCompleto?: string;
    orcid?: string;
  }>;
  grado?: string;
  resumen?: string;
  // El documentoUrl y fechaPublicacion no deberían ser actualizados directamente
}

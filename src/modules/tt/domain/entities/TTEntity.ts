/**
 * Entidad que representa un Trabajo de Titulación (TT).
 * Ajusta o extiende según tus necesidades.
 */
export interface TTEntity {
  _id?: string;
  titulo: string;
  autores: Array<{
    nombreCompleto: string;
    orcid?: string;
  }>;
  palabrasClave: string[];
  unidadAcademica: string;
  directores: Array<{
    nombreCompleto: string;
    orcid?: string;
  }>;
  grado: string;
  resumen: string;
  documentoUrl: string;
  fechaPublicacion?: Date;
  // Otras propiedades que requieras...
}

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
  documentoUrl?: string;
  filename?: string;
  fechaPublicacion?: Date;
  plot_embedding?: number[];
  // Otras propiedades que requieras...
}

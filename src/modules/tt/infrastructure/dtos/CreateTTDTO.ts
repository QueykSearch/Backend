/**
 * DTO para la creación de un TT. Lo usaremos en el Controller
 * para mapear los datos que vienen del request a nuestra entidad.
 */
export interface CreateTTDTO {
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
  // El documento se sube a GCloud; luego guardamos la URL:
  file?: Express.Multer.File;
  fechaPublicacion?: Date;
}

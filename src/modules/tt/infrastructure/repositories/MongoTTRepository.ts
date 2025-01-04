import { TTRepositoryPort } from "../../domain/TTRepositoryPort";
import { TTEntity } from "../../domain/entities/TTEntity";
import { model, Schema, Document } from "mongoose";

// Definimos un Schema de Mongoose para TT
const TTSchema = new Schema({
  titulo: { type: String, required: true },
  autores: [
    {
      nombreCompleto: { type: String, required: true },
      orcid: { type: String, required: false },
    },
  ],
  palabrasClave: [String],
  unidadAcademica: { type: String, required: true },
  directores: [
    {
      nombreCompleto: { type: String, required: true },
      orcid: { type: String, required: false },
    },
  ],
  grado: { type: String, required: true },
  resumen: { type: String, required: true },
  documentoUrl: { type: String, required: false },
  fechaPublicacion: { type: Date, default: new Date() },
});

// export interface TTDocument extends TTEntity, Document {} original
export interface TTDocument extends TTEntity, Document {
  _id: string;
}

/**
 * Creamos el modelo
 */
const TTModel = model<TTDocument>("TT", TTSchema);

/**
 * Implementación de la interfaz TTRepositoryPort usando MongoDB (Mongoose).
 */
export class MongoTTRepository implements TTRepositoryPort {
  public async createTT(tt: TTEntity): Promise<TTEntity> {
    try {
      const created = await TTModel.create(tt);
      console.log(`TT creado con ID: ${created._id}`);
      return created.toObject(); // Convertimos el documento de Mongoose a objeto plano
    } catch (error) {
      console.error("Error al crear TT en MongoDB:", error);
      throw error;
    }
  }

  // Implementa otros métodos según sea necesario
}

// src/modules/tt/infrastructure/repositories/MongoTTRepository.ts

import { DeepPartial } from "../../../../shared/types/DeepPartial";
import { TTRepositoryPort } from "../../domain/TTRepositoryPort";
import { TTEntity } from "../../domain/entities/TTEntity";
import { model, Schema, Document } from "mongoose";

/**
 * Definimos un Schema de Mongoose para TT
 */
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
  filename: { type: String, required: false },
  fechaPublicacion: { type: Date, default: Date.now },
  plot_embedding: { type: [Number], default: [] },

  // Nuevo: campos para creador y status
  createdBy: { type: String, required: false },
  status: { type: String, default: "pendiente" },
});

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
    const created = await TTModel.create(tt);
    return created.toObject(); // Convertimos el documento de Mongoose a objeto plano
  }

  public async listTT(filters: {
    titulo?: string;
    autor?: string;
    unidadAcademica?: string;
    grado?: string;
    palabrasClave?: string[];
    anoPublicacion?: number;
    createdBy?: string;
    status?: string;
    limit?: number;
    page?: number;
  }): Promise<{
    total: number;
    page: number;
    limit: number;
    data: TTEntity[];
  }> {
    const {
      titulo,
      autor,
      unidadAcademica,
      grado,
      palabrasClave,
      anoPublicacion,
      createdBy,
      status,
      limit = 10,
      page = 1,
    } = filters;

    const query: any = {};

    if (titulo) query.titulo = { $regex: titulo, $options: "i" };
    if (autor)
      query["autores.nombreCompleto"] = { $regex: autor, $options: "i" };
    if (unidadAcademica)
      query.unidadAcademica = { $regex: unidadAcademica, $options: "i" };
    if (grado) query.grado = { $regex: grado, $options: "i" };
    if (palabrasClave && palabrasClave.length > 0) {
      query.palabrasClave = { $in: palabrasClave };
    }
    if (anoPublicacion) {
      const startDate = new Date(`${anoPublicacion}-01-01`);
      const endDate = new Date(`${anoPublicacion}-12-31`);
      query.fechaPublicacion = { $gte: startDate, $lte: endDate };
    }

    if (createdBy) {
      query.createdBy = createdBy;
    }

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const [total, data] = await Promise.all([
      TTModel.countDocuments(query),
      TTModel.find(query).skip(skip).limit(limit).exec(),
    ]);

    return {
      total,
      page,
      limit,
      data: data.map((doc) => doc.toObject()),
    };
  }

  public async findTTById(id: string): Promise<TTEntity | null> {
    try {
      const tt = await TTModel.findById(id).exec();
      return tt ? tt.toObject() : null;
    } catch (error) {
      console.error("Error al encontrar TT por ID:", error);
      throw error;
    }
  }

  public async updateTTById(
    id: string,
    updateData: DeepPartial<TTEntity>
  ): Promise<TTEntity | null> {
    try {
      const updated = await TTModel.findByIdAndUpdate(id, updateData, {
        new: true,
      }).exec();
      // console.log("updated", updated);
      return updated ? updated.toObject() : null;
    } catch (error) {
      console.error("Error al actualizar TT por ID:", error);
      throw error;
    }
  }

  public async deleteTTById(id: string): Promise<{ deletedCount: number }> {
    try {
      const result = await TTModel.deleteOne({ _id: id }).exec();
      return { deletedCount: result.deletedCount };
    } catch (error) {
      console.error("Error al eliminar TT por ID:", error);
      throw error;
    }
  }

  public async findBySemanticQuery(embedding: number[]): Promise<TTEntity[]> {
    // MongoDB Aggregation pipeline con $vectorSearch
    // Nombre del índice: "vector_index_resumen" (debes configurarlo en Atlas)
    const pipeline = [
      {
        $vectorSearch: {
          index: "vector_index_resumen",
          path: "plot_embedding",
          queryVector: embedding,
          numCandidates: 50, // Ajusta según quieras
          limit: 2,
        },
      },
    ];

    // Convertir cada documento en TTEntity
    // Ojo: Mongoose .aggregate() retorna objetos plain, no instancias.
    // console.log("Pipeline de búsqueda semántica:", pipeline);
    const results = await TTModel.aggregate(pipeline).exec();

    // console.log("Resultados de búsqueda semántica:", results);

    return results.map((doc: any) => ({
      _id: doc._id?.toString(),
      titulo: doc.titulo,
      autores: doc.autores,
      palabrasClave: doc.palabrasClave,
      unidadAcademica: doc.unidadAcademica,
      directores: doc.directores,
      grado: doc.grado,
      resumen: doc.resumen,
      documentoUrl: doc.documentoUrl,
      fechaPublicacion: doc.fechaPublicacion,
      plot_embedding: doc.plot_embedding,
    }));
  }

  // Otros métodos como findTTsByQuery, etc.
}

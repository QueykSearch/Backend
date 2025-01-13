import { TTRepositoryPort } from "../../domain/TTRepositoryPort";
import { TTEntity } from "../../domain/entities/TTEntity";
import { EmbeddingService } from "../..//infrastructure/services/EmbeddingService";

export class CreateTTUseCase {
  constructor(
    private readonly ttRepository: TTRepositoryPort,
    private readonly embeddingService: EmbeddingService
  ) {}

  public async execute(ttData: TTEntity): Promise<TTEntity> {
    // Asegurarnos de tener título (si te interesa validar más campos, hazlo aquí)
    if (!ttData.titulo) {
      throw new Error("El título no puede estar vacío");
    }

    // Asignar status por defecto si no viene
    if (!ttData.status) {
      ttData.status = "pendiente";
    }

    // Generar embedding para "resumen"
    let embedding: number[] | null = null;
    if (ttData.resumen) {
      embedding = await this.embeddingService.generateEmbedding(ttData.resumen);
    }

    (ttData as any).plot_embedding = embedding || [];

    // Guardar en el repositorio
    const newTT = await this.ttRepository.createTT(ttData);
    return newTT;
  }
}

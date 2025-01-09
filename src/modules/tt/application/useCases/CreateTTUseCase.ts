import { TTRepositoryPort } from "../../domain/TTRepositoryPort";
import { TTEntity } from "../../domain/entities/TTEntity";
import { EmbeddingService } from "../../../tt/infrastructure/services/EmbeddingService";

export class CreateTTUseCase {
  constructor(
    private readonly ttRepository: TTRepositoryPort,
    private readonly embeddingService: EmbeddingService
  ) {}

  public async execute(ttData: TTEntity): Promise<TTEntity> {
    // Validaciones iniciales
    if (!ttData.titulo) {
      throw new Error("El título no puede estar vacío");
    }

    // 1. Generar embedding para "resumen"
    let embedding: number[] | null = null;
    if (ttData.resumen) {
      embedding = await this.embeddingService.generateEmbedding(ttData.resumen);
    }

    // 2. Asignar el embedding en la entidad (ej: campo "plot_embedding")
    //    pero ojo, tu TTEntity no lo tiene. Puedes ampliar TTEntity para un optional:
    //    plot_embedding?: number[];
    (ttData as any).plot_embedding = embedding || [];

    // 3. Llamamos al repositorio para guardar
    const newTT = await this.ttRepository.createTT(ttData);
    return newTT;
  }
}

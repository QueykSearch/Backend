import { TTRepositoryPort } from "../../domain/TTRepositoryPort";
import { EmbeddingService } from "../../../tt/infrastructure/services/EmbeddingService";
import { TTEntity } from "../../domain/entities/TTEntity";

export class SemanticSearchUseCase {
  constructor(
    private readonly ttRepository: TTRepositoryPort,
    private readonly embeddingService: EmbeddingService
  ) {}

  public async execute(query: string, limit: number): Promise<TTEntity[]> {
    // 1. Generar embedding de la query
    const embedding = await this.embeddingService.generateEmbedding(query);
    if (!embedding) {
      // Podrías lanzar un error o simplemente retornar []
      return [];
    }

    // 2. Búsqueda en el repositorio
    return await this.ttRepository.findBySemanticQuery(embedding, limit);
  }
}

import { UserRepositoryPort } from "../../domain/UserRepositoryPort";

export class AddTTToHistoryUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  /**
   * Ejecuta el caso de uso para agregar un TT al historial del usuario.
   * @param userId - ID del usuario
   * @param ttId - ID del TT visitado
   * @param maxLength - Máximo de TT's en el historial (por defecto 45)
   */
  public async execute(
    userId: string,
    ttId: string,
    maxLength: number = 45
  ): Promise<void> {
    if (!userId || !ttId) {
      throw new Error("User ID and TT ID are required");
    }

    await this.userRepository.addToHistory(userId, ttId, maxLength);
  }
}

import { UserRepositoryPort } from "../../domain/UserRepositoryPort";

export class GetUserHistoryUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  /**
   * Ejecuta el caso de uso para obtener el historial de TT's de un usuario.
   * @param userId - ID del usuario
   * @returns Array de IDs de TT's
   */
  public async execute(userId: string): Promise<string[]> {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const history = await this.userRepository.getHistory(userId);
    return history;
  }
}

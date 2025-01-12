import {UserRepositoryPort} from "../../domain/UserRepositoryPort";
import {UserEntity} from "../../domain/entities/UserEntity";
import {supabaseClient} from "../../../../shared/db/SupabaseClient";

export class RefreshUserTokenUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {
  }

  public async execute(params: {
    refresh_token: string,
  }): Promise<{
    accessToken: string,
    refreshToken: string,
    expiresAt: number,
    user: UserEntity
  }> {
    const {data, error} = await supabaseClient.auth.refreshSession(params);

    if (error || !data?.session) {
      throw new Error("Refresh token inválido");
    }

    if (!data.user) {
      throw new Error("Usuario no encontrado");
    }

    if (!data.user.email) {
      throw new Error("Email no encontrado");
    }

    const userEntity: UserEntity | null = await this.userRepository.findUserByEmail(data.user.email);

    if (!userEntity) {
      throw new Error("Usuario no encontrado");
    }

    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: data.session.expires_at || 0,
      user: userEntity
    };
  }
}

import {UserRepositoryPort} from "../../domain/UserRepositoryPort";
import {UserEntity} from "../../domain/entities/UserEntity";
import {supabaseClient} from "../../../../shared/db/SupabaseClient";
import {AuthResponse} from "@supabase/supabase-js";

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
    const response: AuthResponse = await supabaseClient.auth.refreshSession(params);
    if (response.error) {
      switch (response.error.code) {
        case 'refresh_token_not_found':
          throw new Error("Token de refresco no encontrado");
        case 'refresh_token_already_used':
          throw new Error("Token de refresco ya utilizado");
        default:
          throw new Error("Error al refrescar sesión");
      }
    }

    const {session} = response.data;

    if (!session) {
      throw new Error("Sesión no encontrada");
    }

    if (!session.user.email) {
      throw new Error("Email del usuario no encontrado");
    }

    const {access_token, refresh_token, expires_at} = session;

    const userEntity: UserEntity | null = await this.userRepository.findUserByEmail(session.user.email);

    if (!userEntity) {
      throw new Error("Usuario no encontrado");
    }

    return {
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresAt: expires_at || 0,
      user: userEntity
    }
  }
}

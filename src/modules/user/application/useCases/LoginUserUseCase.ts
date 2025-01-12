import {UserRepositoryPort} from "../../domain/UserRepositoryPort";
import {UserEntity} from "../../domain/entities/UserEntity";
import {AuthTokenResponsePassword} from "@supabase/supabase-js";
import {supabaseClient} from "../../../../shared/db/SupabaseClient";

export class LoginUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {
  }

  public async execute(params: {
    email: string,
    password: string,
  }): Promise<{
    accessToken: string,
    refreshToken: string,
    expiresAt: number,
    user: UserEntity
  }> {
    const response: AuthTokenResponsePassword = await supabaseClient.auth.signInWithPassword(params);

    if (response.error) {
      switch (response.error.code) {
        case 'invalid_credentials':
          throw new Error("Credenciales inválidas");
        case 'user_not_found':
          throw new Error("Usuario no encontrado");
        case 'email_not_confirmed':
          throw new Error("Email no confirmado");
        default:
          throw new Error("Error al iniciar sesión");
      }
    }

    if (!response.data.user) {
      throw new Error("Usuario no encontrado");
    }

    const {session} = response.data;
    const {access_token, refresh_token, expires_at} = session;

    const userEntity: UserEntity | null = await this.userRepository.findUserByEmail(params.email);

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

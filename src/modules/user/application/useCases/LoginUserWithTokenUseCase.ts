import {UserRepositoryPort} from "../../domain/UserRepositoryPort";
import {UserEntity} from "../../domain/entities/UserEntity";
import {UserResponse} from "@supabase/supabase-js";
import {supabaseClient} from "../../../../shared/db/SupabaseClient";
import {RefreshUserTokenUseCase} from "./RefreshUserTokenUseCase";

export class LoginUserWithTokenUseCase {
  constructor(private readonly userRepository: UserRepositoryPort, private readonly refreshUserTokenUseCase: RefreshUserTokenUseCase) {
  }

  public async execute(params: {
    accessToken: string,
    refreshToken: string,
    expiresAt: number,
  }): Promise<{
    accessToken: string,
    refreshToken: string,
    expiresAt: number,
    user: UserEntity
  }> {
    const now = new Date().getTime();

    if (params.expiresAt < now) {
      return await this.refreshUserTokenUseCase.execute({refresh_token: params.refreshToken});
    }

    const response: UserResponse = await supabaseClient.auth.getUser(params.accessToken);

    if (response.error) {
      switch (response.error.code) {
        case 'session_expired': {
          return await this.refreshUserTokenUseCase.execute({refresh_token: params.refreshToken});
        }
        case 'user_not_found':
          throw new Error("Usuario no encontrado");
        case 'email_not_confirmed':
          throw new Error("Email no confirmado");
        case 'invalid_credentials':
          throw new Error("Credenciales inválidas");
        default:
          throw new Error("Error al iniciar sesión");
      }
    }

    if (!response.data.user) {
      throw new Error("Usuario no encontrado");
    }

    const {user} = response.data;

    if (!user.email) {
      throw new Error("Email del usuario no encontrado");
    }

    const userEntity: UserEntity | null = await this.userRepository.findUserByEmail(user.email);

    if (!userEntity) {
      throw new Error("Usuario no encontrado");
    }

    return {
      accessToken: params.accessToken,
      refreshToken: params.refreshToken,
      expiresAt: params.expiresAt,
      user: userEntity
    }
  }
}

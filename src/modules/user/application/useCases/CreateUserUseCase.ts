import {UserRepositoryPort} from "../../domain/UserRepositoryPort";
import {UserEntity} from "../../domain/entities/UserEntity";
import {AuthResponse} from "@supabase/supabase-js";
import {supabaseClient} from "../../../../shared/db/SupabaseClient";
import {CreateUserDTO} from "../../infrastructure/dtos/CreateUserDTO";

/**
 * Caso de uso para crear un nuevo Usuario.
 */
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  /**
   * Ejecuta el caso de uso para crear un Usuario.
   * @param createUserDTO - Datos del Usuario a crear
   * @returns Usuario creado
   */
  public async execute(createUserDTO: CreateUserDTO): Promise<UserEntity> {
    if (await this.userRepository.findUserByEmail(createUserDTO.email)) {
      throw new Error("El email ya está en uso");
    }

    const signUpResponse: AuthResponse = await supabaseClient.auth.signUp({
      email: createUserDTO.email,
      password: createUserDTO.password,
    });

    if (signUpResponse.error) {
      throw new Error(signUpResponse.error.message);
    }

    // Aquí, en lugar de crear el usuario en la base de datos, deberíamos crear el usuario en Auth0.
    // Luego, almacenar cualquier información adicional en nuestra base de datos si es necesario.

    // Por simplicidad, asumiremos que Auth0 maneja la creación y solo almacenaremos datos adicionales.
    // Puedes integrar con Auth0 usando su SDK o API.

    // Ejemplo de integración con Auth0:
    // const auth0User = await this.auth0Service.createUser(userData);
    // userData._id = auth0User.id;

    // Crear el Usuario en la base de datos (solo datos adicionales si es necesario)
    return await this.userRepository.createUser({
      nombreCompleto: createUserDTO.nombreCompleto,
      email: createUserDTO.email,
      roles: createUserDTO.roles || ["user"],
    });
  }
}

import { UserRepositoryPort } from "../../domain/UserRepositoryPort";
import { UserEntity } from "../../domain/entities/UserEntity";

/**
 * Caso de uso para crear un nuevo Usuario.
 */
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  /**
   * Ejecuta el caso de uso para crear un Usuario.
   * @param userData - Datos del Usuario a crear
   * @returns Usuario creado
   */
  public async execute(userData: UserEntity): Promise<UserEntity> {
    // Aquí, en lugar de crear el usuario en la base de datos, deberíamos crear el usuario en Auth0.
    // Luego, almacenar cualquier información adicional en nuestra base de datos si es necesario.

    // Por simplicidad, asumiremos que Auth0 maneja la creación y solo almacenaremos datos adicionales.
    // Puedes integrar con Auth0 usando su SDK o API.

    // Ejemplo de integración con Auth0:
    // const auth0User = await this.auth0Service.createUser(userData);
    // userData._id = auth0User.id;

    // Crear el Usuario en la base de datos (solo datos adicionales si es necesario)
    const newUser = await this.userRepository.createUser(userData);
    return newUser;
  }
}

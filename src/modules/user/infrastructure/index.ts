// src/modules/user/infrastructure/index.ts

import { MongoUserRepository } from "./repositories/MongoUserRepository";
import { CreateUserUseCase } from "../application/useCases/CreateUserUseCase";
import { ListUsersUseCase } from "../application/useCases/ListUsersUseCase";
import { GetUserByIdUseCase } from "../application/useCases/GetUserByIdUseCase";
import { UpdateUserUseCase } from "../application/useCases/UpdateUserUseCase";
import { DeleteUserUseCase } from "../application/useCases/DeleteUserUseCase";
import { UserController } from "./controllers/UserController";
// import { AuthService } from './services/AuthService'; // Opcional si Auth0 maneja todo

// 1. Instancia del repositorio (Mongo)
const userRepository = new MongoUserRepository();

// 2. Instancia de los casos de uso
const createUserUseCase = new CreateUserUseCase(userRepository);
const listUsersUseCase = new ListUsersUseCase(userRepository);
const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);

// 3. Instancia del servicio de autenticación
// const authService = new AuthService(userRepository); // Opcional

// 4. Instancia del controlador
const controller = new UserController(
  createUserUseCase,
  listUsersUseCase,
  getUserByIdUseCase,
  updateUserUseCase,
  deleteUserUseCase
  // authService // Opcional
);

// 5. Exportar el controlador con los métodos
export const userController = {
  createUser: controller.createUser,
  listUsers: controller.listUsers,
  getUserById: controller.getUserById,
  updateUser: controller.updateUser,
  deleteUser: controller.deleteUser,
  loginUser: controller.loginUser, // Opcional: Método de login
};

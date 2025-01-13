// src/modules/user/infrastructure/index.ts

import { MongoUserRepository } from "./repositories/MongoUserRepository";
import { CreateUserUseCase } from "../application/useCases/CreateUserUseCase";
import { ListUsersUseCase } from "../application/useCases/ListUsersUseCase";
import { GetUserByIdUseCase } from "../application/useCases/GetUserByIdUseCase";
import { UpdateUserUseCase } from "../application/useCases/UpdateUserUseCase";
import { DeleteUserUseCase } from "../application/useCases/DeleteUserUseCase";
import { UserController } from "./controllers/UserController";
import { LoginUserUseCase } from "../application/useCases/LoginUserUseCase";
import { LoginUserWithTokenUseCase } from "../application/useCases/LoginUserWithTokenUseCase";
import { RefreshUserTokenUseCase } from "../application/useCases/RefreshUserTokenUseCase";
import { AddTTToHistoryUseCase } from "../application/useCases/AddTTToHistoryUseCase";
import { GetUserHistoryUseCase } from "../application/useCases/GetUserHistoryUseCase";
// import { GetTTByIdUseCase } from "../../tt/application/useCases/GetTTByIdUseCase";
// import { GetUserByIdUseCase } from "../application/useCases/GetUserByIdUseCase"; // Opcional

// import { AuthService } from './services/AuthService'; // Opcional si Auth0 maneja todo

// 1. Instancia del repositorio (Mongo)
const userRepository = new MongoUserRepository();

// 2. Instancia de los casos de uso
const createUserUseCase = new CreateUserUseCase(userRepository);
const listUsersUseCase = new ListUsersUseCase(userRepository);
const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);
const loginUserUseCase = new LoginUserUseCase(userRepository); // Opcional: Método de login
const refreshUserTokenUseCase = new RefreshUserTokenUseCase(userRepository); // Opcional: Método de refresco de token
const loginUserWithTokenUseCase = new LoginUserWithTokenUseCase(
  userRepository,
  refreshUserTokenUseCase
); // Opcional: Método de login con token

const addTTToHistoryUseCase = new AddTTToHistoryUseCase(userRepository);
const getUserHistoryUseCase = new GetUserHistoryUseCase(userRepository);

// 3. Instancia del servicio de autenticación
// const authService = new AuthService(userRepository); // Opcional

// 4. Instancia del controlador
const controller = new UserController(
  createUserUseCase,
  listUsersUseCase,
  getUserByIdUseCase,
  updateUserUseCase,
  deleteUserUseCase,
  loginUserUseCase,
  refreshUserTokenUseCase,
  loginUserWithTokenUseCase,
  // GetUserByIdUseCase,
  getUserHistoryUseCase,
  addTTToHistoryUseCase
);

// 5. Exportar el controlador con los métodos
export const userController = {
  createUser: controller.createUser,
  listUsers: controller.listUsers,
  getUserById: controller.getUserById,
  updateUser: controller.updateUser,
  deleteUser: controller.deleteUser,
  refreshToken: controller.refreshToken, // Opcional: Método de refresco de token
  loginUserWithToken: controller.loginUserWithToken,
  loginUser: controller.loginUser, // Opcional: Método de login
  getUserHistory: controller.getHistory,
  addTTToHistory: controller.recordTTVisit,
};

// src/modules/user/infrastructure/controllers/UserController.ts

import {Request, Response, NextFunction} from "express";
import {CreateUserUseCase} from "../../application/useCases/CreateUserUseCase";
import {ListUsersUseCase} from "../../application/useCases/ListUsersUseCase";
import {GetUserByIdUseCase} from "../../application/useCases/GetUserByIdUseCase";
import {UpdateUserUseCase} from "../../application/useCases/UpdateUserUseCase";
import {DeleteUserUseCase} from "../../application/useCases/DeleteUserUseCase";
// import { AuthService } from '../services/AuthService';
import {CreateUserDTO} from "../dtos/CreateUserDTO";
import {UpdateUserDTO} from "../dtos/UpdateUserDTO";
import {DeepPartial} from "../../../../shared/types/DeepPartial";
import {UserEntity} from "../../domain/entities/UserEntity";
import {createUserSchema} from "../validators/CreateUserValidator";
import {updateUserSchema} from "../validators/UpdateUserValidator";
import {supabaseClient} from "../../../../shared/db/SupabaseClient";
import {AuthTokenResponsePassword} from "@supabase/supabase-js";

/**
 * Controlador para manejar peticiones HTTP relacionadas con Usuarios.
 */
export class UserController {
  constructor(
      private readonly createUserUseCase: CreateUserUseCase,
      private readonly listUsersUseCase: ListUsersUseCase,
      private readonly getUserByIdUseCase: GetUserByIdUseCase,
      private readonly updateUserUseCase: UpdateUserUseCase,
      private readonly deleteUserUseCase: DeleteUserUseCase
  ) // private readonly authService: AuthService
  {
  }

  /**
   * Maneja la creación de un nuevo Usuario.
   */
  public createUser = async (
      req: Request,
      res: Response,
      next: NextFunction
  ): Promise<void> => {
    try {
      // Validar los datos del body
      const {error, value} = createUserSchema.validate(req.body);
      if (error) {
        res
            .status(400)
            .json({message: "Datos inválidos", details: error.details});
        return;
      }

      const body: CreateUserDTO = value;

      // Asignar roles predeterminados si no se proporcionan
      const roles = body.roles && body.roles.length > 0 ? body.roles : ["user"];

      // Crear el Usuario en Auth0 y en la base de datos
      // Deberías integrar con Auth0 aquí para crear el usuario en Auth0
      // Luego, almacenar cualquier dato adicional en tu base de datos si es necesario

      // Ejemplo simplificado:
      const newUser = await this.createUserUseCase.execute({
        nombreCompleto: body.nombreCompleto,
        email: body.email,
        roles,
      });

      res.status(201).json({
        message: "Usuario creado con éxito",
        data: newUser,
      });
    } catch (error: any) {
      // Manejo de errores específicos
      if (error.message === "El email ya está en uso") {
        res.status(409).json({message: error.message});
        return;
      }
      next(error);
    }
  };

  /**
   * Maneja la lista de Usuarios con filtros y paginación.
   */
  public listUsers = async (
      req: Request,
      res: Response,
      next: NextFunction
  ): Promise<void> => {
    try {
      const filters = {
        nombreCompleto: req.query.nombreCompleto as string,
        email: req.query.email as string,
        role: req.query.role as string,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        page: req.query.page ? Number(req.query.page) : 1,
      };

      const result = await this.listUsersUseCase.execute(filters);

      res.status(200).json({
        message: "Lista de Usuarios obtenida con éxito",
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * Maneja obtener un Usuario por su ID.
   */
  public getUserById = async (
      req: Request,
      res: Response,
      next: NextFunction
  ): Promise<void> => {
    try {
      const {userId} = req.params;

      if (!userId) {
        res.status(400).json({message: "userId es requerido"});
        return;
      }

      const user = await this.getUserByIdUseCase.execute(userId);

      if (!user) {
        res.status(404).json({message: "Usuario no encontrado"});
        return;
      }

      res.status(200).json({
        message: "Usuario obtenido con éxito",
        data: user,
      });
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * Maneja actualizar un Usuario existente.
   */
  public updateUser = async (
      req: Request,
      res: Response,
      next: NextFunction
  ): Promise<void> => {
    try {
      const {userId} = req.params;
      const updateData: UpdateUserDTO = req.body;

      if (!userId) {
        res.status(400).json({message: "userId es requerido"});
        return;
      }

      // Validar los datos de actualización
      const {error, value} = updateUserSchema.validate(updateData);
      if (error) {
        res
            .status(400)
            .json({message: "Datos inválidos", details: error.details});
        return;
      }

      const updatedUser = await this.updateUserUseCase.execute(
          userId,
          value as DeepPartial<UserEntity>
      );

      if (!updatedUser) {
        res.status(404).json({message: "Usuario no encontrado"});
        return;
      }

      res.status(200).json({
        message: "Usuario actualizado con éxito",
        data: updatedUser,
      });
    } catch (error: any) {
      if (error.message === "El email ya está en uso") {
        res.status(409).json({message: error.message});
        return;
      }
      next(error);
    }
  };

  /**
   * Maneja eliminar un Usuario.
   */
  public deleteUser = async (
      req: Request,
      res: Response,
      next: NextFunction
  ): Promise<void> => {
    try {
      const {userId} = req.params;

      if (!userId) {
        res.status(400).json({message: "userId es requerido"});
        return;
      }

      const deleted = await this.deleteUserUseCase.execute(userId);

      if (!deleted) {
        res.status(404).json({message: "Usuario no encontrado"});
        return;
      }

      res.status(200).json({
        message: "Usuario eliminado con éxito",
      });
    } catch (error: any) {
      next(error);
    }
  };

  public refreshTokens = async (
      req: Request,
      res: Response,
      next: NextFunction
  ): Promise<void> => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({ message: "No se recibió refreshToken" });
        return;
      }

      const { data, error } = await supabaseClient.auth.refreshSession({
        refresh_token: refreshToken,
      });

      if (error || !data?.session) {
        res.status(401).json({ message: "Refresh token inválido" });
        return;
      }

      res.status(200).json({
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresIn: data.session.expires_in,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * (Opcional) Maneja el inicio de sesión de un Usuario.
   * Si Auth0 maneja el inicio de sesión desde el frontend, este método podría no ser necesario.
   */
  public loginUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const {email, password} = req.body;

      if (!email || !password) {
        res.status(400).json({message: "Email y contraseña son requeridos"});
        return;
      }

      const response: AuthTokenResponsePassword = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (response.error) {
        res.status(401).json({message: "Credenciales inválidas"});
        return;
      }

      if (!response.data.user) {
        res.status(404).json({message: "Usuario no encontrado"});
        return;
      }

      const { session } = response.data;
      const { access_token, refresh_token, expires_in } = session;

      res.status(200).json({
        message: "Inicio de sesión exitoso",
        data: {
          accessToken: access_token,
          refreshToken: refresh_token,
          expiresIn: expires_in
        },
      });
    } catch (error: any) {
      next(error);
    }
  };
}

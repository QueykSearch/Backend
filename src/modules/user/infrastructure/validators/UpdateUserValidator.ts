import Joi from "joi";
import { UpdateUserDTO } from "../dtos/UpdateUserDTO";

/**
 * Esquema de validación para actualizar un Usuario.
 */
export const updateUserSchema = Joi.object<UpdateUserDTO>({
  nombreCompleto: Joi.string().min(3).max(100).optional(),
  email: Joi.string().email().optional(),
  //   password: Joi.string().min(6).optional(),
  roles: Joi.array().items(Joi.string()).optional(),
});

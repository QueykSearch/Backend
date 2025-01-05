import Joi from "joi";
import { CreateUserDTO } from "../dtos/CreateUserDTO";

/**
 * Esquema de validación para crear un Usuario.
 */
export const createUserSchema = Joi.object<CreateUserDTO>({
  nombreCompleto: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  //   password: Joi.string().min(6).required(),
  roles: Joi.array().items(Joi.string()).optional(),
});

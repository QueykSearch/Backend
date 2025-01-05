// src/modules/user/infrastructure/repositories/MongoUserRepository.ts

import { UserRepositoryPort } from "../../domain/UserRepositoryPort";
import { UserEntity } from "../../domain/entities/UserEntity";
import { model, Schema, Document } from "mongoose";
import { DeepPartial } from "../../../../shared/types/DeepPartial";

/**
 * Definición del Schema de Mongoose para Usuario.
 */
const UserSchema = new Schema({
  nombreCompleto: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  roles: { type: [String], default: ["user"] },
  fechaRegistro: { type: Date, default: Date.now },
  ultimoLogin: { type: Date },
});

export interface UserDocument extends UserEntity, Document {
  _id: string;
}

/**
 * Creación del modelo de Mongoose para Usuario.
 */
const UserModel = model<UserDocument>("User", UserSchema);

/**
 * Implementación de la interfaz UserRepositoryPort usando MongoDB (Mongoose).
 */
export class MongoUserRepository implements UserRepositoryPort {
  public async createUser(user: UserEntity): Promise<UserEntity> {
    const createdUser = await UserModel.create(user);
    return createdUser.toObject();
  }

  public async listUsers(filters: {
    nombreCompleto?: string;
    email?: string;
    role?: string;
    limit?: number;
    page?: number;
  }): Promise<{
    total: number;
    page: number;
    limit: number;
    data: UserEntity[];
  }> {
    const { nombreCompleto, email, role, limit = 10, page = 1 } = filters;

    const query: any = {};

    if (nombreCompleto) {
      query.nombreCompleto = { $regex: nombreCompleto, $options: "i" };
    }

    if (email) {
      query.email = { $regex: email, $options: "i" };
    }

    if (role) {
      query.roles = role;
    }

    const skip = (page - 1) * limit;

    const [total, data] = await Promise.all([
      UserModel.countDocuments(query),
      UserModel.find(query).skip(skip).limit(limit).exec(),
    ]);

    return {
      total,
      page,
      limit,
      data: data.map((user) => user.toObject()),
    };
  }

  public async findUserById(id: string): Promise<UserEntity | null> {
    try {
      const user = await UserModel.findById(id).exec();
      return user ? user.toObject() : null;
    } catch (error) {
      console.error("Error al encontrar Usuario por ID:", error);
      throw error;
    }
  }

  public async findUserByEmail(email: string): Promise<UserEntity | null> {
    try {
      const user = await UserModel.findOne({ email }).exec();
      return user ? user.toObject() : null;
    } catch (error) {
      console.error("Error al encontrar Usuario por Email:", error);
      throw error;
    }
  }

  public async updateUserById(
    id: string,
    updateData: DeepPartial<UserEntity>
  ): Promise<UserEntity | null> {
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(id, updateData, {
        new: true,
      }).exec();
      return updatedUser ? updatedUser.toObject() : null;
    } catch (error) {
      console.error("Error al actualizar Usuario por ID:", error);
      throw error;
    }
  }

  public async deleteUserById(id: string): Promise<{ deletedCount: number }> {
    try {
      const result = await UserModel.deleteOne({ _id: id }).exec();
      return { deletedCount: result.deletedCount };
    } catch (error) {
      console.error("Error al eliminar Usuario por ID:", error);
      throw error;
    }
  }
}

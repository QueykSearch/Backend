import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

/**
 * Conexión global a Mongo usando Mongoose.
 */

let isConnected = false;

export async function connectMongo(): Promise<void> {
  if (isConnected) return;

  const mongoUri =
    process.env.MONGO_URL || "mongodb://localhost:27017/QueykSearch";
  try {
    await mongoose.connect(mongoUri);
    isConnected = true;
    console.log("Conexión exitosa a MongoDB en ", mongoUri);
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
    throw error;
  }
}

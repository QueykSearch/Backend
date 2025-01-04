// src/app/server.ts
import express, { Application } from "express";
import dotenv from "dotenv";
import { router } from "./routes";
import { connectMongo } from "../shared/db/MongoClient";

// Cargar variables de entorno
dotenv.config();

export async function startServer() {
  try {
    // Conectar a Mongo antes de levantar el servidor
    await connectMongo();

    // Inicializar la aplicación Express
    const app: Application = express();

    // Middlewares para parseo de JSON y URL-encoded
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    // Registrar rutas
    app.use("/api/v1", router);

    // Middleware de depuración para rutas no encontradas
    app.use((req, res) => {
      console.log(`Ruta no encontrada: ${req.method} ${req.url}`);
      res.status(404).send(`Cannot ${req.method} ${req.url}`);
    });

    // Iniciar el servidor
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });

    // Listar rutas registradas
    listRoutes(app);
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
  }
}

function listRoutes(app: Application) {
  console.log("Listado de rutas registradas:");
  app._router.stack.forEach(function (middleware: any) {
    if (middleware.route) {
      // rutas registradas
      console.log(
        `${middleware.route.stack[0].method.toUpperCase()} ${
          middleware.route.path
        }`
      );
    } else if (middleware.name === "router") {
      // rutas anidadas
      middleware.handle.stack.forEach(function (handler: any) {
        const route = handler.route;
        if (route) {
          console.log(
            `${handler.route.stack[0].method.toUpperCase()} ${route.path}`
          );
        }
      });
    }
  });
}

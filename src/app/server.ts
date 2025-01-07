// src/app/server.ts

import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { router } from "./routes";
import { connectMongo } from "../shared/db/MongoClient";
import cors from "cors"; // Importar cors

// Cargar variables de entorno
dotenv.config();

export async function startServer() {
  try {
    // Conectar a Mongo antes de levantar el servidor
    await connectMongo();

    // Inicializar la aplicación Express
    const app: Application = express();

    // Configurar CORS
    app.use(cors()); // Usar CORS con configuración por defecto

    // Middlewares para parseo de JSON y URL-encoded
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    // Registrar rutas
    app.use("/api/v1", router);

    // Middleware de depuración para rutas no encontradas
    app.use((req: Request, res: Response) => {
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

// // Configurar CORS con opciones personalizadas
// const corsOptions = {
//   origin: "http://localhost:3000", // Origen permitido
//   methods: ["GET", "POST", "PUT", "DELETE"], // Métodos HTTP permitidos
//   credentials: true, // Permitir el envío de cookies si es necesario
// };

// app.use(cors(corsOptions));

// const allowedOrigins = ["http://localhost:3000", "http://example.com"];

// const corsOptions = {
//   origin: function (origin: any, callback: any) {
//     // Permitir solicitudes sin origen (por ejemplo, mobile apps, curl, etc.)
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.indexOf(origin) === -1) {
//       const msg = "El origen CORS no está permitido por la política de este servidor.";
//       return callback(new Error(msg), false);
//     }
//     return callback(null, true);
//   },
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true,
// };

// app.use(cors(corsOptions));

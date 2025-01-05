import jwt from "express-jwt";
import jwksRsa from "jwks-rsa";
import { Request, Response, NextFunction } from "express";

/**
 * Middleware para verificar el JWT emitido por Auth0.
 */
export const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://<your-auth0-domain>/.well-known/jwks.json`, // Reemplaza con tu dominio de Auth0
  }),
  audience: "<YOUR_API_IDENTIFIER>", // Reemplaza con tu identificador de API en Auth0
  issuer: `https://<your-auth0-domain>/`, // Reemplaza con tu dominio de Auth0
  algorithms: ["RS256"],
});

/**
 * Middleware para verificar los roles del usuario.
 * @param requiredRoles - Rol o roles requeridos para acceder a la ruta
 */
export const checkRoles = (requiredRoles: string | string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as any;
    if (!user || !user.roles) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const roles: string[] = user.roles;

    if (typeof requiredRoles === "string") {
      if (!roles.includes(requiredRoles)) {
        return res.status(403).json({ message: "Forbidden" });
      }
    } else {
      const hasRole = requiredRoles.some((role) => roles.includes(role));
      if (!hasRole) {
        return res.status(403).json({ message: "Forbidden" });
      }
    }

    next();
  };
};

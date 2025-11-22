import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const isAuthenticated = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token manquant" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Ajoute les infos du user à req.user

      // Vérification des rôles si besoin
      if (roles.length) {
        if (roles.includes("admin") && !decoded.isAdmin) {
          return res.status(403).json({ message: "Accès refusé" });
        }
        // Tu peux ajouter d'autres vérifications de rôle ici
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Token invalide" });
    }
  };
};

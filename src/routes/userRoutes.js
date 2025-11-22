import { Router } from "express";
import { userController } from "../di.js";
import userValidator from "../validators/userValidator.js";
import validate from "../middleware/Validation.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import upload from "../config/multer-config.js";

const router = Router();

// Signup
router.post("/signup", userValidator.signup, validate, userController.signup);

// Login
router.post("/login", userValidator.login, validate, userController.login);

// Profil de l'utilisateur connecté
router.get("/profile", isAuthenticated(), userController.getProfile);

// Update profil
router.put(
  "/profile",
  isAuthenticated(),
  upload.single("avatar"),
  validate,
  userController.updateProfile
);

// Vérification du token
router.get("/verify", isAuthenticated(), userController.verifyToken);
export default router;

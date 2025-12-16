import User from "../domain/User.js";
import bcrypt from "bcrypt"; // Toujours nécessaire pour le login (compare)
import jwt from "jsonwebtoken";

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  // --- INSCRIPTION (CREATE) ---
  async create(data) {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error("Cet email est déjà utilisé.");
    }
    // On passe le password brut. Le Hook du modèle User va le hasher.
    const newUser = await this.userRepository.create({
      ...data,
      isAdmin: false,
      betsWon: 0,
      totalEarnings: 0,
    });

    return new User(newUser.toJSON());
  }

  // --- LOGIN ---
  async login(email, password) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Email ou mot de passe incorrect.");
    }

    // Comparaison du password avec bcrypt
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error("Email ou mot de passe incorrect.");
    }

    const token = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin, role: user.role },
      process.env.JWT_SECRET || "secret_temporaire",
      { expiresIn: "24h" }
    );

    return {
      user: new User(user.toJSON()),
      token: token,
    };
  }

  // --- GESTION PROFIL ---

  async getById(id) {
    const user = await this.userRepository.findById(id);
    return user ? new User(user.toJSON()) : null;
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll();
    return users.map((u) => new User(u.toJSON()));
  }

  async updateProfile(id, data) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new Error("Utilisateur introuvable");

    const updatedUser = await this.userRepository.update(user, data);

    return new User(updatedUser.toJSON());
  }

  async deleteUser(id) {
    return await this.userRepository.delete(id);
  }
}

export default UserService;

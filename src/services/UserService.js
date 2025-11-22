import dotenv from "dotenv";
dotenv.config();

import { User as UserModel } from "../models/index.js";
import User from "../domain/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UserService {
  async getById(id) {
    const row = await UserModel.findByPk(id);
    return row ? new User(row.toJSON()) : null;
  }
  async create(data) {
    const { username, email, password, birthdate, isConditionChecked } = data;

    const existingUser = await UserModel.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("Email déjà utilisé");
    }

    const row = await UserModel.create({
      username,
      email,
      password,
      birthdate,
      isConditionChecked,
    });

    return new User(row.toJSON());
  }

  async login(data) {
    const { email, password } = data;
    const user = await UserModel.findOne({ where: { email } });

    if (!user) {
      throw new Error("Email ou mot de passe incorrect");
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error("Email ou mot de passe incorrect");
    }

    // Générer un token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return { token, user: user.toJSON() };
  }

  async updateProfile(userId, data, file) {
    const row = await UserModel.findByPk(userId);
    if (!row) throw new Error("Utilisateur non trouvé");

    const updateData = { ...data };

    if (file) {
      updateData.avatar = file.filename;
    }

    if (data.password) {
      updateData.password = data.password;
    }

    await row.update(updateData);
    return new User(row.toJSON());
  }
}

export default UserService;

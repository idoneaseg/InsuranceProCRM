// server/controllers/users.js
import bcrypt from "bcrypt";
import User from "../model/User.js";

const Users = {
  // 📍 Registar novo utilizador
  register: async (req, res) => {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios." });
      }

      // Verificar se já existe
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Este e-mail já está registado." });
      }

      // Hash da password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Criar utilizador
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || "agente",
      });

      res.status(201).json({
        message: "Utilizador criado com sucesso!",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("❌ Erro ao registar utilizador:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

export default Users;
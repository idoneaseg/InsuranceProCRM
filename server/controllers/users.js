// server/controllers/users.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/User.js";

const Users = {
  // 📋 Listar todos os utilizadores
  index: async (req, res) => {
    try {
      const result = await User.find({ active: true });
      const totalRecords = await User.countDocuments({ active: true });
      res.status(200).json({ result, totalRecords });
    } catch (error) {
      console.error("Erro ao listar utilizadores:", error);
      res.status(500).json({ message: "Erro no servidor ao listar utilizadores." });
    }
  },

  // 👁️ Ver detalhes de um utilizador
  view: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "Utilizador não encontrado." });
      res.status(200).json(user);
    } catch (error) {
      console.error("Erro ao obter utilizador:", error);
      res.status(500).json({ message: "Erro no servidor." });
    }
  },

  // ✏️ Editar utilizador
  edit: async (req, res) => {
    try {
      const { name, email, phone, role, active } = req.body;
      const updated = await User.findByIdAndUpdate(
        req.params.id,
        { name, email, phone, role, active },
        { new: true }
      );
      if (!updated) return res.status(404).json({ message: "Utilizador não encontrado." });
      res.status(200).json({ message: "Utilizador atualizado com sucesso!", user: updated });
    } catch (error) {
      console.error("Erro ao atualizar utilizador:", error);
      res.status(500).json({ message: "Erro no servidor ao atualizar utilizador." });
    }
  },

  // 🗑️ Eliminar (ou desativar) utilizador
  deleteData: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ success: false, message: "Utilizador não encontrado." });
      }

      if (user.role === "super_admin") {
        return res.status(400).json({ message: "O super administrador não pode ser removido." });
      }

      await User.findByIdAndUpdate(userId, { active: false });
      res.status(200).json({ message: "Utilizador desativado com sucesso." });
    } catch (error) {
      console.error("Erro ao eliminar utilizador:", error);
      res.status(500).json({ message: "Erro no servidor ao eliminar utilizador." });
    }
  },

  // 🧩 Registar novo utilizador
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

  // 🔐 Login de utilizador
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "E-mail inválido." });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Password incorreta." });
      }

      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET || "secret_key",
        { expiresIn: "1d" }
      );

      res.status(200).json({
        message: "Login efetuado com sucesso!",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      res.status(500).json({ message: "Erro no servidor durante o login." });
    }
  },
};

export default Users;
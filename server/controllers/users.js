// server/controllers/users.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/User.js";

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET || "secret_key",
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_REFRESH_SECRET || "refresh_secret_key",
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

const Users = {
  // 🔑 Login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) return res.status(401).json({ message: "E-mail inválido." });
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid)
        return res.status(401).json({ message: "Password incorreta." });

      const { accessToken, refreshToken } = generateTokens(user);
      user.refreshToken = refreshToken;
      await user.save();

      res.status(200).json({
        message: "Login efetuado com sucesso!",
        accessToken,
        refreshToken,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
    } catch (error) {
      console.error("Erro no login:", error);
      res.status(500).json({ message: "Erro no servidor durante o login." });
    }
  },

  // 🔄 Refresh Token
  refreshToken: async (req, res) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken)
        return res.status(401).json({ message: "Refresh token é obrigatório." });

      const user = await User.findOne({ refreshToken });
      if (!user)
        return res.status(403).json({ message: "Refresh token inválido." });

      jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || "refresh_secret_key",
        async (err, decoded) => {
          if (err || decoded.userId !== user._id.toString()) {
            return res.status(403).json({ message: "Token inválido ou expirado." });
          }

          const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
          user.refreshToken = newRefreshToken;
          await user.save();

          res.status(200).json({
            message: "Token renovado com sucesso!",
            accessToken,
            refreshToken: newRefreshToken,
          });
        }
      );
    } catch (error) {
      console.error("Erro ao renovar token:", error);
      res.status(500).json({ message: "Erro interno ao renovar token." });
    }
  },

  // 🚪 Logout
  logout: async (req, res) => {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "Utilizador não encontrado." });

      user.refreshToken = null;
      await user.save();

      res.status(200).json({ message: "Logout efetuado com sucesso!" });
    } catch (error) {
      console.error("Erro no logout:", error);
      res.status(500).json({ message: "Erro interno no logout." });
    }
  },

  // 📋 Listar utilizadores
  index: async (req, res) => {
    try {
      const result = await User.find({ active: true });
      const totalRecords = await User.countDocuments({ active: true });
      res.status(200).json({ result, totalRecords });
    } catch (error) {
      res.status(500).json({ message: "Erro ao listar utilizadores." });
    }
  },

  // 👁️ Ver utilizador
  view: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "Utilizador não encontrado." });
      res.status(200).json(user);
    } catch {
      res.status(500).json({ message: "Erro ao obter utilizador." });
    }
  },

  // ✏️ Editar
  edit: async (req, res) => {
    try {
      const { name, email, phone, role, active } = req.body;
      const updated = await User.findByIdAndUpdate(
        req.params.id,
        { name, email, phone, role, active },
        { new: true }
      );
      if (!updated) return res.status(404).json({ message: "Utilizador não encontrado." });
      res.status(200).json({ message: "Atualizado com sucesso!", user: updated });
    } catch {
      res.status(500).json({ message: "Erro ao atualizar utilizador." });
    }
  },

  // 🗑️ Eliminar
  deleteData: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "Utilizador não encontrado." });
      if (user.role === "super_admin")
        return res.status(400).json({ message: "O super administrador não pode ser removido." });

      user.active = false;
      await user.save();
      res.status(200).json({ message: "Utilizador desativado." });
    } catch {
      res.status(500).json({ message: "Erro ao eliminar utilizador." });
    }
  },

  // 🧩 Registo
  register: async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      if (!name || !email || !password)
        return res.status(400).json({ message: "Todos os campos são obrigatórios." });

      const existingUser = await User.findOne({ email });
      if (existingUser)
        return res.status(400).json({ message: "E-mail já registado." });

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || "agente",
      });

      res.status(201).json({ message: "Utilizador criado com sucesso!", user });
    } catch (error) {
      console.error("Erro ao registar utilizador:", error);
      res.status(500).json({ message: "Erro interno no registo." });
    }
  },
};

export default Users;

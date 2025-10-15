// server/middlewares/auth.js
import jwt from "jsonwebtoken";
import User from "../model/User.js";

//
// ✅ Middleware principal de autenticação
//
const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Acesso negado. Token não fornecido." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "segredo_acesso_123");

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Utilizador não encontrado." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("❌ Erro de autenticação:", error);
    res.status(403).json({ message: "Token inválido ou expirado." });
  }
};

//
// ✅ Middleware adicional de autorização (por papéis/roles)
//
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Acesso negado. Permissão insuficiente." });
    }
    next();
  };
};

export default auth;
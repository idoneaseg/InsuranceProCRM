// server/routes/userRoutes.js
import express from "express";
import Users from "../controllers/users.js";
import auth, { authorizeRoles } from "../middlewares/auth.js"; // ✅ Corrigido
const router = express.Router();

// 🧩 Rotas públicas
router.post("/login", Users.login);
router.post("/register", auth, authorizeRoles("super_admin", "admin"), Users.register);

// 🧩 Rotas protegidas
router.get("/list", auth, authorizeRoles("super_admin", "admin", "diretor"), Users.index);
router.get("/view/:id", auth, Users.view);
router.put("/edit/:id", auth, authorizeRoles("super_admin", "admin"), Users.edit);
router.delete("/delete/:id", auth, authorizeRoles("super_admin"), Users.deleteData);

// 🧩 Sessão
router.post("/refresh-token", Users.refreshToken || ((req, res) => res.status(501).json({ message: "Não implementado" })));
router.post("/logout", auth, Users.logout || ((req, res) => res.status(501).json({ message: "Não implementado" })));

export default router;
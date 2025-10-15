import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectdb.js";
import cors from "cors";
import bodyParser from "body-parser";
import serverRoutes from "./routes/serverRoutes.js";
import commissionRoutes from "./routes/commissionRoutes.js"; // 🆕 Importar rotas de comissões
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

// 🧩 Middleware base
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 🗄️ Conexão à base de dados
const DATABASE_URL = process.env.DB_URL;
const DB_NAME = process.env.DB_NAME;
connectDB(DATABASE_URL, DB_NAME);

// 🧠 Rotas da API
app.use("/api", serverRoutes);
app.use("/api/commissions", commissionRoutes); // ✅ Rota de comissões

// 🗂️ Caminho absoluto para servir o build do frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendPath = path.join(__dirname, "../frontend/build");

// 🧱 Servir ficheiros estáticos do React
app.use(express.static(frontendPath));

// 🌐 Rota fallback (para React Router SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// 🚀 Exportar app
export default app;
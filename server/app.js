import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectdb.js";
import cors from "cors";
import bodyParser from "body-parser";
import serverRoutes from "./routes/serverRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Conexão à base de dados
const DATABASE_URL = process.env.DB_URL;
const DB_NAME = process.env.DB_NAME;
connectDB(DATABASE_URL, DB_NAME);

// Rotas da API (importante manter o prefixo /api)
app.use("/api", serverRoutes);

// 📁 Caminho absoluto até ao build do frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🟩 Usa "dist" — é onde o Vite/React cria o build final
const frontendPath = path.join(__dirname, "../frontend/dist");

// Servir ficheiros estáticos do React
app.use(express.static(frontendPath));

// Rota fallback — para o React Router (SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Exportar app para uso no index.js
export default app;
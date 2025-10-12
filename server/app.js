import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectdb.js";
import cors from "cors";
import bodyParser from "body-parser";
import serverRoutes from "./routes/serverRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Rotas
app.use("/", serverRoutes);

// Conexão à base de dados
const DATABASE_URL = process.env.DB_URL;
const DB_NAME = process.env.DB_NAME;
connectDB(DATABASE_URL, DB_NAME);

// Exporta o app para ser usado no index.js
export default app;

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📁 Caminho absoluto até ao build do frontend
const frontendPath = path.join(__dirname, "../frontend/dist");

// Servir ficheiros estáticos do React
app.use(express.static(frontendPath));

// Qualquer rota que não seja API devolve o index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

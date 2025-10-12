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
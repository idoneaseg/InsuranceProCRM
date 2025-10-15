// server/scripts/createSuperAdmin.js
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../model/User.js";
import connectDB from "../db/connectdb.js";

dotenv.config();

const DATABASE_URL = process.env.DB_URL;
const DB_NAME = process.env.DB_NAME;

// 🧩 Lê argumentos do terminal
// Exemplo: npm run create-admin -- --email="x@y.com" --password="abc" --role="admin" --name="João"
const args = process.argv.slice(2);
const params = {};
args.forEach((arg) => {
  const [key, value] = arg.replace("--", "").split("=");
  params[key] = value?.replace(/^"|"$/g, ""); // remove aspas se existirem
});

// 🧾 Valores padrão
const name = params.name || "Super Admin";
const email = params.email || "superadmin@insuranceprocrm.com";
const password = params.password || "123456";
const role = params.role || "super_admin";

// ✅ Lista de roles válidos
const VALID_ROLES = [
  "super_admin",
  "admin",
  "diretor",
  "coordenador",
  "gestor_equipa",
  "agente",
  "subagente",
  "parceiro",
];

// 🚨 Verifica se o role é válido
if (!VALID_ROLES.includes(role)) {
  console.error(`❌ Role inválido: "${role}"`);
  console.error(`ℹ️ Roles permitidos: ${VALID_ROLES.join(", ")}`);
  process.exit(1);
}

const createUser = async () => {
  try {
    await connectDB(DATABASE_URL, DB_NAME);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("⚠️ Já existe um utilizador com este email:", email);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      active: true,
    });

    await user.save();

    console.log("✅ Utilizador criado com sucesso!");
    console.log("👤 Nome:", name);
    console.log("📧 Email:", email);
    console.log("🔑 Password:", password);
    console.log("👑 Role:", role);

    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao criar utilizador:", error);
    process.exit(1);
  }
};

createUser();
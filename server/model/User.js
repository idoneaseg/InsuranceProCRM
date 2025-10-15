// server/models/User.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    // 🧑‍💼 Dados básicos
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    phone: { type: String, default: null },
    active: { type: Boolean, default: true },

    // 🔒 Nível de permissão
    role: {
      type: String,
      enum: [
        "super_admin",
        "admin",
        "diretor",
        "coordenador",
        "gestor_equipa",
        "agente",
        "sub_agente",
        "parceiro",
      ],
      default: "agente",
    },

    // 🧩 Hierarquia organizacional
    supervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // quem supervisiona este utilizador
    },

    team: {
      type: String,
      default: null, // identificador ou nome da equipa
    },

    // 💰 Nível de comissão
    commissionLevel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CommissionLevel",
      default: null,
    },

    // ⚙️ Configurações específicas
    canManageOwnLeads: { type: Boolean, default: true },

    // 🔄 Refresh Token (para autenticação JWT segura)
    refreshToken: { type: String, default: null },

    // 🕵️‍♂️ Auditoria
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

//
// 🔐 Encripta password antes de salvar
//
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//
// 🧠 Método para comparar password no login
//
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
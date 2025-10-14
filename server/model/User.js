// server/models/User.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
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
        "subagente",
        "parceiro",
      ],
      default: "agente",
    },

    // 🧩 Hierarquia
    supervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // quem supervisiona este utilizador
    },

    team: {
      type: String,
      default: null, // identificador de equipa (se aplicável)
    },

    // 💰 Nível de comissão
    commissionLevel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CommissionLevel",
    },

    // ⚙️ Configurações específicas de permissão
    canManageOwnLeads: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// 🔐 Encriptar password antes de salvar
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
// server/model/CommissionLevel.js
import mongoose from "mongoose";

const commissionLevelSchema = new mongoose.Schema(
  {
    // 🏷️ Nome do nível (ex: "Bronze", "Prata", "Ouro", "Diretor")
    name: {
      type: String,
      required: [true, "O nome do nível é obrigatório."],
      unique: true,
      trim: true,
    },

    // 💰 Percentagem base de comissão (0–100)
    baseRate: {
      type: Number,
      required: [true, "A taxa base é obrigatória."],
      min: [0, "A taxa base não pode ser negativa."],
      max: [100, "A taxa base não pode exceder 100%."],
    },

    // 🎯 Bónus adicional (opcional)
    bonusRate: {
      type: Number,
      default: 0,
      min: [0, "O bónus não pode ser negativo."],
      max: [100, "O bónus não pode exceder 100%."],
    },

    // 🥇 Ordem hierárquica (menor número = nível mais alto)
    rank: {
      type: Number,
      required: [true, "O campo rank é obrigatório."],
      min: [1, "O rank deve ser pelo menos 1."],
      unique: true,
    },

    // 📝 Descrição (opcional)
    description: {
      type: String,
      default: "",
      trim: true,
    },

    // ⚙️ Ativo / Inativo (para soft delete)
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// 🔎 Índice para busca rápida por rank e nome
commissionLevelSchema.index({ rank: 1 });
commissionLevelSchema.index({ name: 1 });

// 🧩 Modelo
const CommissionLevel = mongoose.model("CommissionLevel", commissionLevelSchema);
export default CommissionLevel;

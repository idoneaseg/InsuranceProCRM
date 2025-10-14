// server/models/CommissionLevel.js
import mongoose from "mongoose";

const commissionLevelSchema = new mongoose.Schema(
  {
    // 🔹 Nome do patamar (ex: Bronze, Prata, Ouro, Platina, etc.)
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // 💸 Percentagem de comissão principal
    baseRate: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    // 📈 Percentagem adicional (ex: bónus de desempenho, override, etc.)
    bonusRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // 🔗 Hierarquia do nível (quanto mais baixo, mais alto é o nível)
    rank: {
      type: Number,
      required: true,
      unique: true,
    },

    // 🧾 Descrição opcional
    description: {
      type: String,
      default: "",
      trim: true,
    },

    // ⚙️ Indica se o nível está ativo
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const CommissionLevel = mongoose.model("CommissionLevel", commissionLevelSchema);
export default CommissionLevel;
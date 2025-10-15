import CommissionLevel from "../model/CommissionLevel.js";

/**
 * 🎯 Criar novo nível de comissão
 */
export const createCommissionLevel = async (req, res) => {
  try {
    const { name, baseRate, bonusRate, rank, description } = req.body;

    // Verifica duplicados (insensível a maiúsculas)
    const exists = await CommissionLevel.findOne({ name: new RegExp(`^${name}$`, "i") });
    if (exists) {
      return res.status(400).json({ message: "Este nível de comissão já existe." });
    }

    const level = new CommissionLevel({
      name: name.trim(),
      baseRate,
      bonusRate,
      rank,
      description,
      active: true,
    });

    await level.save();

    res.status(201).json({
      message: "✅ Nível de comissão criado com sucesso!",
      level,
    });
  } catch (error) {
    console.error("❌ Erro ao criar nível de comissão:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

/**
 * 📋 Listar todos os níveis de comissão
 */
export const getCommissionLevels = async (req, res) => {
  try {
    const levels = await CommissionLevel.find().sort({ rank: 1 });
    res.status(200).json({ levels });
  } catch (error) {
    console.error("❌ Erro ao listar níveis:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

/**
 * ✏️ Atualizar nível de comissão
 */
export const updateCommissionLevel = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await CommissionLevel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Nível de comissão não encontrado." });
    }

    res.status(200).json({
      message: "✅ Nível de comissão atualizado com sucesso!",
      updated,
    });
  } catch (error) {
    console.error("❌ Erro ao atualizar nível:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

/**
 * 🚫 Desativar (soft delete) um nível
 */
export const deactivateCommissionLevel = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await CommissionLevel.findByIdAndUpdate(
      id,
      { active: false },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Nível de comissão não encontrado." });
    }

    res.status(200).json({
      message: "✅ Nível de comissão desativado com sucesso!",
      updated,
    });
  } catch (error) {
    console.error("❌ Erro ao desativar nível:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};
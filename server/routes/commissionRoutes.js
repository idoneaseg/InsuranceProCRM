import express from "express";
import {
  createCommissionLevel,
  getCommissionLevels,
  updateCommissionLevel,
  deactivateCommissionLevel,
} from "../controllers/commissionController.js";

const router = express.Router();

router.post("/", createCommissionLevel);
router.get("/", getCommissionLevels);
router.put("/:id", updateCommissionLevel);
router.delete("/:id", deactivateCommissionLevel);

export default router;

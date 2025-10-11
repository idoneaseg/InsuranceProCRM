import { Router } from "express";
import Claim from "../controllers/claims.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.get("/list", auth, Claim.index);
router.post("/add", auth, Claim.add);
router.get("/view/:id", auth, Claim.view);
router.put("/edit/:id", auth, Claim.edit);
router.delete("/delete/:id", auth, Claim.deleteData);

export default router;

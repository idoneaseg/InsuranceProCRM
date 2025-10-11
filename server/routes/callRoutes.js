import { Router } from "express";
import Call from "../controllers/callController.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.get("/list", auth, Call.index);
router.post("/add", auth, Call.add);
router.get("/view/:id", auth, Call.view);
router.put("/edit/:id", auth, Call.edit);
router.delete("/delete/:id", auth, Call.deleteData);
router.post("/deletemany", auth, Call.deleteMany);

export default router;

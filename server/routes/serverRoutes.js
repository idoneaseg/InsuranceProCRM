// server/routes/serverRoutes.js
import express from "express";
const router = express.Router();

import LeadRoute from "./leadRoutes.js";
import ContactRoute from "./contactRoutes.js";
import ClaimRoute from "./claimRoutes.js";
import NoteRoute from "./noteRoutes.js";
import CallRoute from "./callRoutes.js";
import MeetingRoute from "./meetingRoutes.js";
import EmailRoute from "./EmailRoutes.js";
import TaskRoute from "./taskRoutes.js";
import UserRoute from "./userRoutes.js";
import PolicyRoute from "./policyRoutes.js";
import DocumentRoute from "./documentRoutes.js";
import PolicyDocumentRoute from "./policyDocumentRoutes.js";
import EmailTemplateRoute from "./emailTemplateRoutes.js";
import commissionRoutes from "./commissionRoutes.js";

// ✅ Rotas principais da API
router.use("/leads", LeadRoute);
router.use("/contacts", ContactRoute);
router.use("/claims", ClaimRoute);
router.use("/notes", NoteRoute);
router.use("/calls", CallRoute);
router.use("/meetings", MeetingRoute);
router.use("/emails", EmailRoute);
router.use("/tasks", TaskRoute);
router.use("/users", UserRoute); // 🔥 Corrigido: era "/user"
router.use("/policies", PolicyRoute);
router.use("/documents", DocumentRoute);
router.use("/policy-documents", PolicyDocumentRoute);
router.use("/email-templates", EmailTemplateRoute);
router.use("/commissions", commissionRoutes);

export default router;
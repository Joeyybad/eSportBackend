import { Router } from "express";

import userRoutes from "./userRoutes.js";
import matchRoutes from "./matchRoutes.js";
import teamRoutes from "./teamRoutes.js";
import tournamentRoutes from "./tournamentRoutes.js";
import betRoutes from "./betRoutes.js";
import contactRoutes from "./contactRoutes.js";

const router = Router();

router.use("/user", userRoutes);
router.use("/matches", matchRoutes);
router.use("/admin/teams", teamRoutes);
router.use("/tournaments", tournamentRoutes);
router.use("/bets", betRoutes);
router.use("/contact", contactRoutes);

export default router;

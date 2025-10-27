import { Router } from "express";
import {
  getConfig,
  getBalance,
  postSpin,
} from "../controllers/gameController";

const router = Router();

// Get public game configuration (for client UI)
router.get("/config", getConfig);

// Get player balance
router.get("/balance", getBalance);

// Perform a spin
router.post("/spin", postSpin);

export default router;

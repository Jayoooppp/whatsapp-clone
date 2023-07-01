import express from "express";
import { checkUser, onBoardUser } from "../controllers/AuthController.js";
const router = express.Router();


router.post("/check-user", checkUser);
router.post("/onboard-user", onBoardUser);
export default router;
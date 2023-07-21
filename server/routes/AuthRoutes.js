import express from "express";
import { checkUser, generateToken, onBoardUser } from "../controllers/AuthController.js";
const router = express.Router();


router.post("/check-user", checkUser);
router.post("/onboard-user", onBoardUser);
router.get("/generate-token/:userId", generateToken);
export default router;
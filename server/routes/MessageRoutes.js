import express from "express";
import { getAllUsers } from "../controllers/MessageController.js";
export const messageRouter = express.Router();

messageRouter.get("/getAllUsers", getAllUsers);




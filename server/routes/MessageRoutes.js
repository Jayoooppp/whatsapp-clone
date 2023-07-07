import express from "express";
import { addMessage, getAllUsers, getMessages } from "../controllers/MessageController.js";
export const messageRouter = express.Router();

messageRouter.get("/getAllUsers", getAllUsers);
messageRouter.post("/addMessage", addMessage);
messageRouter.get("/getMessages/:from/:to", getMessages)




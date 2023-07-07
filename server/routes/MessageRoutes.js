import express from "express";
import { addMessage, getAllUsers, getMessages, uploadImageController } from "../controllers/MessageController.js";
import multer from "multer";
export const messageRouter = express.Router();

const uploadImage = multer({ dest: "uploads/images" })

messageRouter.get("/getAllUsers", getAllUsers);
messageRouter.post("/addMessage", addMessage);
messageRouter.get("/getMessages/:from/:to", getMessages)
messageRouter.post("/add-image-message", uploadImage.single("image"), uploadImageController)



import express from "express";
import { addMessage, getAllUsers, getMessages, uploadAudioController, uploadImageController, getInitialContactsWithMessages } from "../controllers/MessageController.js";
import multer from "multer";
export const messageRouter = express.Router();

const uploadImage = multer({ dest: "uploads/images" })
const uploadRecording = multer({ dest: "uploads/recordings" })

messageRouter.get("/getAllUsers", getAllUsers);
messageRouter.post("/addMessage", addMessage);
messageRouter.get("/getMessages/:from/:to", getMessages)
messageRouter.post("/add-image-message", uploadImage.single("image"), uploadImageController)
messageRouter.post("/add-audio-message", uploadRecording.single("audio"), uploadAudioController)
messageRouter.get("/get-initial-contact/:from", getInitialContactsWithMessages);




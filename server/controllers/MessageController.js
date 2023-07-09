import getPrismaInstance from "../utils/PrismaClient.js"
import { renameSync } from "fs"
export const getAllUsers = async (req, res) => {
    try {
        const prisma = getPrismaInstance();
        const users = await prisma.user.findMany({
            orderBy: { name: "asc" },
            select: {
                id: true,
                email: true,
                name: true,
                profilePicture: true,
                about: true
            }
        })
        const usersGroupByInitialLetters = {};
        users.map((user) => {
            const initialLetter = user.name.charAt(0).toUpperCase();
            if (!usersGroupByInitialLetters[initialLetter]) {
                usersGroupByInitialLetters[initialLetter] = [];
            }
            usersGroupByInitialLetters[initialLetter].push(user);
        })
        return res.status(200).json({ users: usersGroupByInitialLetters })
    } catch (error) {
        console.log("🚀 ~ file: MessageController.js:6 ~ getAllUser ~ error:", error)

    }
}


export const addMessage = async (req, res) => {
    try {
        const prisma = getPrismaInstance();
        const { message, from, to } = req.body;
        const getUser = onlineUsers.get(to);
        if (message && from && to) {
            const newMessage = await prisma.Messages.create({
                data: {
                    message,
                    sender: { connect: { id: parseInt(from) } },
                    receiver: { connect: { id: parseInt(to) } },
                    messageStatus: getUser ? "deliverd" : "sent",
                },
                include: { sender: true, receiver: true },
            });
            return res.status(203).json({ message: newMessage })
        }
        return res.status(400).send("From, to and message is required")
    } catch (error) {
        console.log("🚀 ~ file: MessageController.js:36 ~ addMessage ~ error:", error)

    }

}


export const getMessages = async (req, res) => {
    try {
        const prisma = getPrismaInstance();
        const { from, to } = req.params;
        const messages = await prisma.Messages.findMany({
            where: {
                OR: [{
                    senderId: parseInt(to),
                    receiverId: parseInt(from)
                }, {
                    senderId: parseInt(from),
                    receiverId: parseInt(to)
                }],
            },
            orderBy: {
                id: "asc"
            }
        })
        const unreadMessages = [];
        messages.forEach((message, index) => {
            if (message.messageStatus !== "read" && message.senderId === parseInt(to)) {
                messages[index].messageStatus === "read"
                unreadMessages.push(message.id);
            }
        })

        // Current user is from and to is user with whom current user is currently chatting
        // so to make sure that all messages sent by that user is marked read whenever current user open message box with that user

        await prisma.Messages.updateMany({
            where: {
                id: {
                    in: unreadMessages
                }
            },
            data: {
                messageStatus: "read"
            }
        })

        return res.status(200).json({ messages })

    } catch (error) {
        console.log(error)
    }
}

export const uploadImageController = async (req, res, next) => {
    try {

        if (req.file) {
            const date = Date.now();
            let fileName = "uploads/images/" + date + req.file.originalname;
            const prisma = getPrismaInstance();
            renameSync(req.file.path, fileName);
            const { from, to } = req.query;

            if (from && to) {
                const message = await prisma.Messages.create({
                    data: {
                        message: fileName,
                        sender: { connect: { id: parseInt(from) } },
                        receiver: { connect: { id: parseInt(to) } },
                        type: "image"
                    }
                });
                return res.status(201).json({ message })
            }
            return res.status(404).json("From, to and message is required")

        }
        return res.status(400).json("Image is required")


    } catch (error) {
        console.log("🚀 ~ file: MessageController.js:111 ~ uploadImageController ~ error:", error)

    }
}
export const uploadAudioController = async (req, res, next) => {
    try {

        if (req.file) {
            const date = Date.now();
            let fileName = "uploads/recordings/" + date + req.file.originalname;
            const prisma = getPrismaInstance();
            renameSync(req.file.path, fileName);
            const { from, to } = req.query;

            if (from && to) {
                const message = await prisma.Messages.create({
                    data: {
                        message: fileName,
                        sender: { connect: { id: parseInt(from) } },
                        receiver: { connect: { id: parseInt(to) } },
                        type: "audio"
                    }
                });
                return res.status(201).json({ message })
            }
            return res.status(404).json("From, to and message is required")

        }
        return res.status(400).json("Audio is required")


    } catch (error) {
        console.log("🚀 ~ file: MessageController.js:111 ~ uploadImageController ~ error:", error)

    }
}
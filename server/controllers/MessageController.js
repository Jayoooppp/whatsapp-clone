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
                    messageStatus: getUser ? "delivered" : "sent",
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

export const getInitialContactsWithMessages = async (req, res) => {
    try {
        const userId = parseInt(req.params.from);
        const prisma = getPrismaInstance();

        // Finding all the user whose messages has current user as either sender or receiver
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                sentMessages: {
                    include: {
                        receiver: true,
                        sender: true
                    },
                    orderBy: {
                        createdAt: "desc"
                    },
                },
                receivedMessages: {
                    include: {
                        receiver: true,
                        sender: true
                    },
                    orderBy: {
                        createdAt: "desc"
                    },

                }
            }
        });

        // storing all the messages of the user found 

        const messages = [...user.sentMessages, ...user.receivedMessages];
        messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        const users = new Map(); //unique key,value pairs of the users
        const messageStatusChanges = [];

        messages.forEach((msg) => {
            const isSender = msg.senderId === userId; // if current user is sender 
            const calculatedId = isSender ? msg.receiverId : msg.senderId; // opposite user ID
            if (msg.messageStatus === "sent") {
                messageStatusChanges.push(msg.id);
            }

            const {
                id,
                type,
                message,
                messageStatus,
                createdAt,
                senderId,
                receiverId
            } = msg;
            if (!users.get(calculatedId)) {
                let user = {
                    messageId: id,
                    type,
                    message,
                    messageStatus,
                    createdAt,
                    senderId,
                    receiverId

                }

                if (isSender) {
                    // if message was sent by this user  
                    user = {
                        ...user,
                        ...msg.receiver,
                        totalUnreadMessages: 0
                    }
                } else {
                    user = {
                        ...user,
                        ...msg.sender,
                        totalUnreadMessages: messageStatus !== "read" ? 1 : 0
                    }
                }
                // setting the message for receiver user 
                users.set(calculatedId, { ...user })
            } else if (messageStatus !== "read" && !isSender) {
                // if current message is received by the current user and sender is already added in the list
                // then increasing the count of the total messagse send by the sender that are unread
                const user = users.get(calculatedId);
                users.set(calculatedId, {
                    ...user,
                    totalUnreadMessages: user.totalUnreadMessages + 1,
                })
            }
        });
        if (messageStatusChanges.length > 0) {
            await prisma.Messages.updateMany({
                where: {
                    id: {
                        in: messageStatusChanges
                    }
                },
                data: {
                    messageStatus: "delivered"
                }
            })
        }
        return res.status(200).json(
            {
                users: Array.from(users.values()),
                onlineUsers: Array.from(onlineUsers.keys())
            }
        )

    } catch (error) {
        console.log(error);
    }
}
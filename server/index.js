import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import router from "./routes/AuthRoutes.js";
import { messageRouter } from "./routes/MessageRoutes.js"
import { Server, Socket } from "socket.io";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads/images", express.static("uploads/images"))
app.use("/uploads/recordings", express.static("uploads/recordings"))

// Routes
app.use("/api/auth", router);
app.use("/api/message", messageRouter);

app.get("/", (req, res) => {
    res.send("Hello world");
})

const server = app.listen(process.env.PORT, () => {
    console.log("Server is running at ", process.env.PORT);
})

// Established a socket with a origin
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000"
    }
});

// Map data strucutre which can be accessed globally
global.onlineUsers = new Map();


// Socket on connection which will run when there is new connection
io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    })

    socket.on("send-message", (data) => {
        console.log("Receiver msg")
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-receive", {
                from: data.from,
                message: data.message
            })
        }
    })
})
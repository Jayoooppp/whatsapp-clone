import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import router from "./routes/AuthRoutes.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", router);

app.get("/", (req, res) => {
    res.send("Hello world");
})

const server = app.listen(process.env.PORT, () => {
    console.log("Server is running at ", process.env.PORT);
})
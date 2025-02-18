import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDb } from "./config/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import UserRouter from "./routes/user.route.js";
import { socketHandlers } from "./socket/index.js";

// env configuration
dotenv.config({ path: "./config/.env" });

const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO with CORS configuration
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST"]
  }
});

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true
};

app.use(cors(corsOptions));

// Make io accessible throughout the application
app.set("io", io);

// Connect to database
connectDb();

// Initialize socket handlers
socketHandlers(io);

// routes
app.use("/api/v1/user", UserRouter);

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
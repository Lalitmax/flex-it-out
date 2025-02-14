import express from "express"
import { connectDb } from "./config/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import cors from "cors";
import UserRouter from "./routes/user.route.js";


// env configuration
dotenv.config({path:"./config/.env"})

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
const corsOptions = {
    origin:'http://localhost:5173',
    credentials:true
}

app.use(cors(corsOptions));


connectDb();

//route
app.use("/api/v1/user",UserRouter);

app.listen(process.env.PORT, () => {
    console.log("Server listening on port 5000");
});

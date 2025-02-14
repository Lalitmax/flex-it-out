import mongoose from "mongoose";


export const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGOURI);
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
    }
};

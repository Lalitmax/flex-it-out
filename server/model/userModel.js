import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    pushUps: {
        type: Number,
        default: 0
    },
    curls: {
        type: Number,
        default: 0
    },
    squats: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);

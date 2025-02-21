import mongoose from "mongoose";

const exerciseEntrySchema = mongoose.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now
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
    },
    caloriesBurned: {
        type: Number,
        default: 0
    }
});

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
    },
    caloriesBurned: {
        type: Number,
        default: 0
    },
    age:{
        type:Number,
        default:0
    },
    height:{
        type:Number,
        default:0.0
    },
    weight:{
        type:Number,
        default:0.0
    },
    exerciseHistory: [exerciseEntrySchema]
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);

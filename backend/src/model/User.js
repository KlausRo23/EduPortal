import mongoose from "mongoose";

// For account creation
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
        validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: 'Invalid email format'
      }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    role: {
        type: String,
        enum: ['admin', 'teacher', 'student'],
        default: 'student'
    },
    department: {
        type: String,
        enum: ["COE", "CCS", "COB", "none"],
        default: "none"
    },
    profile: {
        type: String,
        required: false
    },
    refreshToken: String
}, {timestamps: true})

const User = mongoose.model("User", userSchema)

export default User;
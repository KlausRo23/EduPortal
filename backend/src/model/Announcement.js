import mongoose from 'mongoose'

const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        require: false,
        trim: true
    },
    photoURL: {
        type: String,
        required: false,
        trim: true
    },
    audience: {
        type: String,
        enumn: ["student", "teacher", "alxl"],
        default: "all",
        required: true
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    commentedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
}, {timestamps: true})

const Announcement = mongoose.model("Account", announcementSchema)

export default Announcement

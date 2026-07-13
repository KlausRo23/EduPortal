import mongoose, { mongo } from "mongoose";

const commentSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    content: {
        type: String,
        trim: true,
        required: true
    }
}, {timestamps: true})

const Comment = mongoose.model("Comment", commentSchema)

export default Comment
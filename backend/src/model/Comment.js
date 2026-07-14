import mongoose, { mongo } from "mongoose";

//This model is for comment in announcement sent by admin
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
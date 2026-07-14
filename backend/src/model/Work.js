import mongoose, { mongo } from "mongoose";

//The works of the student
const workSchema = new mongoose.Schema({
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Classwork"
    },
    status: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubmittedWork"
    }
}, {timestamps: true})

const Work = mongoose.model("Work", workSchema)

export default Work
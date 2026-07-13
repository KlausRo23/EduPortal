import mongoose, { mongo } from "mongoose";

const gradeSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        reuqired: true
    },
    grade: {
        type: Number,
        required: false,
        trim: true
    },

}, {timestamps: true})

const Grade = mongoose.model("Grade", gradeSchema)

export default Grade
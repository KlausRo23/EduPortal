import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
    time: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    },
    Note: {
        type: String,
        required: true,
        trim: true
    }
}, {timestamps: true})

const Schedule = mongoose.model("Schedule", scheduleSchema)

export default Schedule
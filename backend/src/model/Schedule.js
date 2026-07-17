import mongoose from "mongoose";

//Creation of SChedule base on the given schedule
const scheduleSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    time: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    }
}, {timestamps: true})

const Schedule = mongoose.model("Schedule", scheduleSchema)

export default Schedule
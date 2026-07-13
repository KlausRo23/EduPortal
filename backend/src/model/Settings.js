import mongoose from "mongoose";

const settingSchema = new mongoose.Schema({
    semester: {
        type: String,
        enum: ["1st semester, 2nd semester"],
        default: "1st semester"
    },
    period: {
        type: String,
        enum: ["Midterm", "Finals"],
        default: "Midterms"
    },
    schoolYear: {
        type: Number,
        max: 9,
    }
})

const Setting = mongoose.model("Setting", settingSchema)

export default Setting
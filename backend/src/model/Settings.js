import mongoose from "mongoose";

const settingSchema = new mongoose.Schema({
    semester: {
        type: String,
        enum: ["1st semester", "2nd semester"],
        default: "1st semester"
    },
    period: {
        type: String,
        enum: ["midterms", "finals"],
        default: "midterms"
    },
    schoolYear: {
        type: Number,
        max: 9,
        required: true
    },
    isACtive: {
        type: Boolean,
        default: true
    }
}, {timestamps: true})

const Setting = mongoose.model("Setting", settingSchema)

export default Setting
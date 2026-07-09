import mongoose from "mongoose"


const studentSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ["irregular", "regular"],
        default: "regualr"
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
    },
    yearLevel: {
        type: String,
        required: true
    },

})

const Student = new mongoose.model('Student', studentSchema)

export default Student
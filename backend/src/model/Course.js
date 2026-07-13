import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    Teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    courseCode: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        uppercase: true
    },
    courseName: {
        type: String,
        required: true,
        trim: true
    },
    time: {
        type: String,
        required: true,
        trim: true
    },
    day: {
        type: String,
        enum: ["Monday","Tuesday","Wendesday", "Thursday", "Friday", "Saturday"],
        required: true
    },
    enrolledStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    }],
    classWork: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Classwork"
    }]
},{timestamps: true})

const Course = mongoose.model("Course", courseSchema)

export default Course
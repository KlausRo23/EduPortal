import mongoose from "mongoose";

//Personla info of the teacher
const teacherSchema =  new mongoose.Schema({
    department: {
        type: String,
        enum: [
            "College of Computer Studies",
            "Colllege of Education",
            "College of Engineering",
            "College of Business",
            "College of Accountancy"
        ],
        required: true,
    },
    Specialization: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    }],
    position: {
    type: String,
    enum: [
        "Instructor",
        "Assistant Professor",
        "Associate Professor",
        "Professor"
    ]
},
}, {timestamps: true})
const Teacher = mongoose.model("Teacher", teacherSchema)

export default Teacher
import mongoose, { mongo } from "mongoose";

//This model is for teachers who will post works for student in their respective course
const classworkSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    classType: {
      type: String,
      enum: ["lesson", "quiz", "activity", "project", "assignment"],
      default: "lesson",
      required: true,
    },
    attachments: [{
        type: String,
        trim: true,
      },],

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    perfectScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 100,
    },

    submittedWork: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "submittedWork",
      },],

    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },],

    dueDate: {
      type: Date,
    },
    semester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Setting",
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    }
  },{timestamps: true,});

 const Classwork = mongoose.model("Classwork", classworkSchema);

 export default Classwork


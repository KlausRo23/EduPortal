import mongoose from "mongoose";

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
      enum: ["lesson", "quiz", "activity", "project"],
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
      min: 1,
      max: 100,
      default: 100,
    },

    submittedWork: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },],

    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },],

    dueDate: {
      type: Date,
    },
  },{timestamps: true,});

 const Classwork = mongoose.model("Classwork", classworkSchema);

 export default Classwork


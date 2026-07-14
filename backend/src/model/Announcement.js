import mongoose from "mongoose";

// This model is for admin who will be sending announcements to users
const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: false,
      trim: true,
    },
    photoURL: {
      type: String,
      required: false,
      trim: true,
    },
    audience: {
      type: String,
      enum: ["student", "teacher", "all"],
      default: "all",
      required: true,
    },
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    commentedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

const Announcement = mongoose.model("Announcement", announcementSchema);

export default Announcement;
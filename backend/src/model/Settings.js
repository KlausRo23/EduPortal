import mongoose from "mongoose";

// Configuration model — admin controls the active semester, period, and school year
const settingSchema = new mongoose.Schema(
  {
    semester: {
      type: String,
      enum: ["1st semester", "2nd semester"],
      default: "1st semester",
    },
    period: {
      type: String,
      enum: ["midterm", "finals"],
      default: "midterm",
    },
    schoolYear: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Setting = mongoose.model("Setting", settingSchema);

export default Setting;
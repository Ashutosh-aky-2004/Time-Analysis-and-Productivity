import mongoose from "mongoose";

const DailyCheckInSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    priorities: [
      {
        type: String,
        trim: true,
      },
    ],
    energyLevel: {
      type: Number,
      min: 1,
      max: 5,
    },
    moodLevel: {
      type: Number,
      min: 1,
      max: 5,
    },
    stressLevel: {
      type: Number,
      min: 1,
      max: 5,
    },
    focusAreas: [
      {
        type: String,
        enum: ["Studies", "Projects", "Health", "Social", "Personal", "Other"],
      },
    ],
    motivation: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a user can only have one check-in per day (optional, but good practice)
// Using a compound index on userId and a date-only field would be better,
// but for simplicity we'll just index date for queries.
DailyCheckInSchema.index({ userId: 1, date: -1 });

const DailyCheckIn = mongoose.model("DailyCheckIn", DailyCheckInSchema);

export default DailyCheckIn;

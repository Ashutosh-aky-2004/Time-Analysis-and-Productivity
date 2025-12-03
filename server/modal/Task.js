// models/Task.js
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    taskName: { type: String, required: true },

    taskPriority: {
      type: String,
      enum: ["high", "medium", "low", "critical"],
      default: "low",
    },

    workingMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    completedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    taskTotalDuration: { type: Number, default: 0 }, // minutes

    completedMinutes: { type: Number, default: 0 },

    // Fixed: proper reference to Comment model
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    completed: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: Remaining duration
taskSchema.virtual("duration").get(function () {
  return this.taskTotalDuration - this.completedMinutes;
});

export default mongoose.model("Task", taskSchema);

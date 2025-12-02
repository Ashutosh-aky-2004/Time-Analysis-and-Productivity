import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    commentId: {
      type: String,
      required: true,
      unique: true,
    },
    message: {
      type: String,
      required: true,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
  },
  { timestamps: true }
);

// Middleware
commentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Method to increment likes
commentSchema.methods.incrementLikes = function () {
  this.likesCount += 1;
  return this.save();
};

// Method to decrement likes
commentSchema.methods.decrementLikes = function () {
  if (this.likesCount > 0) {
    this.likesCount -= 1;
  }
  return this.save();
};

export default mongoose.model("Comment", commentSchema);

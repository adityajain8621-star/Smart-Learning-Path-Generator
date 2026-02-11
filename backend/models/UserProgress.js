const mongoose = require("mongoose");

const userProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  learningPath: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LearningPath"
  },
  moduleId: String,
  completed: { type: Boolean, default: false },
  score: Number,
  timeSpent: Number,
  completedAt: Date
}, { timestamps: true });

module.exports = mongoose.model("UserProgress", userProgressSchema);

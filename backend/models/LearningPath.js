const mongoose = require("mongoose");

const learningPathSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: { type: String, required: true },
  description: String,
  difficulty: String,
  estimatedDuration: Number,
  content: Object
}, { timestamps: true });

module.exports = mongoose.model("LearningPath", learningPathSchema);

const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  learningPath: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LearningPath"
  },
  moduleId: String,
  questions: Array
}, { timestamps: true });

module.exports = mongoose.model("Quiz", quizSchema);

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "Smart Learning Path Generator API",
    status: "running",
  });
});

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/learning-paths", require("./routes/learningPaths"));
app.use("/api/quizzes", require("./routes/quizzes"));
app.use("/api/tutoring", require("./routes/tutoring"));

// Error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

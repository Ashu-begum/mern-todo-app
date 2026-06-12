const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI;

// Middleware lets React call this API and lets Express read JSON request bodies.
app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
app.use("/", authRoutes);
app.use("/", taskRoutes);

app.get("/health", (req, res) => {
  res.json({ message: "MERN To-Do API is running" });
});

// Keep one small startup function so database errors are easy to understand.
const startServer = async () => {
  try {
    if (!mongoUri) {
      throw new Error("MONGO_URI is missing in backend/.env");
    }

    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

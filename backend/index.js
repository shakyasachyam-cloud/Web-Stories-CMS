require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require("./routes/auth");
const storiesRoutes = require("./routes/stories");

const app = express();

// ✅ CORS for frontend
app.use(
  cors({
    origin: [
      'https://web-stories-cms-f8qf.vercel.app', // your frontend
      'http://localhost:5173',                   // optional for local dev
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

// ✅ Middleware
app.use(express.json({ limit: '10mb' }));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/stories", storiesRoutes);

app.get("/", (req, res) => {
  res.send("Webstories backend is working ✅");
});

// ✅ Connect MongoDB once
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ Mongo Error:", err));

// ✅ DO NOT app.listen() on Vercel
// app.listen(PORT) ❌ REMOVE

module.exports = app;

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require("./routes/auth");

const app = express();
const corsOptions = {
  origin: [
    'https://web-stories-cms-player-mpph.vercel.app', // your frontend URL
    'http://localhost:3000', // for local testing
  ],
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  credentials: true,
};


// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cors(corsOptions));
app.use("/api/auth", authRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.get("/", (req, res) => {
  
  res.send("Webstories backend is working ✅");
});

app.use("/api/stories", require("./routes/stories"));
app.use("/api/auth", require("./routes/auth")); // optional

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);

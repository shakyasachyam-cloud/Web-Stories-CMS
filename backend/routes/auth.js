const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// REGISTER (only run once to create admin)
router.post("/register", async (req, res) => {
  try {
    const adminExists = await User.findOne({});
    if (adminExists) {
      return res
        .status(403)
        .json({ message: "Admin already exists. Registration disabled." });
    }

    const { name, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);

    const newAdmin = await User.create({
      name,
      email,
      password: hashed,
    });

    res.json({ message: "Admin account created", newAdmin });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Login success", token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

// Register
// Register route
app.post("/register", async (req, res) => {
  try {
    const { name, age, address, mobileNo, password } = req.body;

    // ✅ Check for duplicate
    const existingUser = await User.findOne({ mobileNo });
    if (existingUser) {
      return res.status(400).send("User already exists with this mobile number");
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, age, address, mobileNo, password: hashed });
    await user.save();

    res.send("Registered successfully");
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).send("Error registering user");
  }
});


// Login
app.post("/login", async (req, res) => {
  const { mobileNo, password } = req.body;
  const user = await User.findOne({ mobileNo });
  if (!user) return res.status(400).send("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).send("Invalid password");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token, user });
});

const auth = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send("No token");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).send("Invalid token");
  }
};

app.get("/weather", auth, (req, res) => {
  res.send("Weather data here");
});

app.listen(5000, () => console.log("Server started on port 5000"));

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  address: String,
  mobileNo: { type: String, unique: true },
  password: { type: String, unique: true },
});

module.exports = mongoose.model("User", userSchema);

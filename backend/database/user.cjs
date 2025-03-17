const mongoose = require("mongoose");
const Users = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  Column: {
    type: Array,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("Users", Users);
module.exports = User;

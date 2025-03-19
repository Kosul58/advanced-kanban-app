const mongoose = require("mongoose");
const Tasks = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  columnId: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  userid: {
    type: String,
    required: true,
  },
});

const Task = mongoose.model("Tasks", Tasks);
module.exports = Task;

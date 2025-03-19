import mongoose from "mongoose";
import dotenv from "dotenv";
import Task from "./database/tasks.cjs";
dotenv.config();

// Updated MongoDB connection URI
const mongoURI = process.env.MONGODB_URI;

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1); // Exit process on failure
  }
};

const closeConn = async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("MongoDB connection close error:", error.message);
  }
};

// Update task content based on task id
const updatetask = async (id, content) => {
  await connectDB();
  try {
    // Find the task by its id
    const task = await Task.findOne({ id: id });

    if (!task) {
      console.log("Task not found");
      return { success: false, message: "Task not found" };
    }

    // Map through task content and replace the matching one
    task.content = task.content === content ? task.content : content;

    // Save the updated task
    await task.save();
    console.log("Task updated successfully:", task);
    return { success: true, task };
  } catch (error) {
    console.error("Error updating task:", error.message);
    return { success: false, message: error.message };
  } finally {
    await closeConn();
  }
};

export default updatetask;

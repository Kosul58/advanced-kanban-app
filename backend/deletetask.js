import mongoose from "mongoose";
import dotenv from "dotenv";
import Task from "./database/tasks.cjs"; // Assuming this is the correct path
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

// Function to delete a task
const deletetask = async (task) => {
  await connectDB();
  try {
    // Find the task by task ID (use _id if it's Mongo's default identifier)
    const taskToDelete = await Task.findOne({
      userid: task.userid,
      id: task.id,
    });

    if (!taskToDelete) {
      console.error("Task not found");
      return "Task not found"; // Return a message if no task was found
    }

    // Delete the task
    await Task.deleteOne({ id: task.id });
    return "Task deleted successfully";
  } catch (error) {
    console.error("Error deleting task:", error.message);
    return "Error deleting task";
  } finally {
    await closeConn();
  }
};

export default deletetask;

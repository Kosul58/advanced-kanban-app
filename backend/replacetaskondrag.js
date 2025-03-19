import mongoose from "mongoose";
import dotenv from "dotenv";
import Task from "./database/tasks.cjs"; // Assuming Task is the model for tasks
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

// Replace tasks for a specific userId with new values
const replacetasks = async (tasks, userid) => {
  await connectDB();
  try {
    // Step 1: Remove all tasks with the same userId
    await Task.deleteMany({ userid });
    console.log(`All tasks for userId ${userid} removed successfully`);

    // Step 2: Insert all tasks from the tasks array
    const newTasks = tasks.map((task) => ({ ...task, userid })); // Add userId to each task
    await Task.insertMany(newTasks);
    console.log("All tasks inserted successfully");

    return { success: true, message: "Tasks replaced successfully" };
  } catch (error) {
    console.error("Error replacing tasks:", error.message);
    return { success: false, message: error.message };
  } finally {
    await closeConn();
  }
};

export default replacetasks;

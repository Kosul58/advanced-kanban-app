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

const tasks = async (task) => {
  await connectDB();
  try {
    // console.log(task);
    const newTask = new Task(task);
    const savedTask = await newTask.save();
    return savedTask;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return [];
  } finally {
    await closeConn();
  }
};

export default tasks;

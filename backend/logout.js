import mongoose from "mongoose";
import dotenv from "dotenv";
import Task from "./database/tasks.cjs";
dotenv.config();

// Updated MongoDB connection URI
const mongoURI = process.env.MONGODB_URI;

const closeConn = async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("MongoDB connection close error:", error.message);
  }
};

export default closeConn;

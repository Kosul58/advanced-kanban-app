import mongoose from "mongoose";
import User from "./database/user.cjs";
import dotenv from "dotenv";
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

const pagereload = async (uid, control, column) => {
  await connectDB();
  try {
    const presentDate = new Date().toISOString().split("T")[0];
    // console.log(presentDate);
    const user = await User.findOne({ _id: uid });

    if (control === "reload") {
      // console.log(user);
      return user ? user : "no users";
    } else if (control === "add") {
      user.Column.push(column);
      await user.save();
      return "Column Added Succesfully";
    } else if (control === "delete") {
      user.Column = user.Column.filter((col) => col.id !== column.id);
      await user.save();
      return "Column Deleted Succesfully";
    }
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return [];
  } finally {
    await closeConn();
  }
};

export default pagereload;

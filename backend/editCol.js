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

const editCol = async (colid, title, userid) => {
  await connectDB();
  try {
    const user = await User.findOne({ _id: userid });

    if (!user) {
      console.log("User not found");
      return { success: false, message: "User not found" };
    }

    // Map through columns and replace the matching one
    user.Column = user.Column.map((col) =>
      col.id === colid ? { ...col, title } : col
    );
    // // Save the updated user document
    await user.save();
    console.log("Column title updated successfully");
    return { success: true, message: "Column title updated successfully" };
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return [];
  } finally {
    await closeConn();
  }
};

export default editCol;

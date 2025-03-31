import User from "./database/user.cjs";

const editCol = async (colid, title, userid) => {
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
  }
};

export default editCol;

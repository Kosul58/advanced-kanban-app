import User from "./database/user.cjs";

const pagereload = async (uid, control, column) => {
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
  }
};

export default pagereload;

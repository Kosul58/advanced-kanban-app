import Task from "./database/tasks.cjs";
// Replace tasks for a specific userId with new values
const replacetasks = async (tasks, userid) => {
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
  }
};

export default replacetasks;

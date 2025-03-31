import Task from "./database/tasks.cjs"; // Assuming this is the correct path

// Function to delete a task
const deletetask = async (task) => {
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
  }
};

export default deletetask;

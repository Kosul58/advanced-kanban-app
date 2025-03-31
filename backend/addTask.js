import Task from "./database/tasks.cjs";

const tasks = async (task) => {
  try {
    // console.log(task);
    const newTask = new Task(task);
    const savedTask = await newTask.save();
    return savedTask;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return [];
  }
};

export default tasks;

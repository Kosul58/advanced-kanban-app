import Task from "./database/tasks.cjs";

const taskhandler = async (uid) => {
  try {
    const task = await Task.find({ userid: uid });
    return task ? task : "no tasks";
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return [];
  }
};

export default taskhandler;

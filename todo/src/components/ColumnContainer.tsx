import { Column, Id, Task } from "../types";
import TrashIcon from "../icons/Trashicon";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import Plusicon from "../icons/Plusicon";
import TaskCard from "./TaskCard";
import { SortableContext } from "@dnd-kit/sortable";
import { MdCancel } from "react-icons/md";

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  createTask: (columnId: Id, content: string, priority: string) => void;
  task: Task[];
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}

const ColumnContainer = (props: Props) => {
  const {
    column,
    deleteColumn,
    updateColumn,
    createTask,
    deleteTask,
    updateTask,
    task,
  } = props;

  const [editMode, setEditMode] = useState<boolean>(false);
  const [colTitle, setColTitle] = useState<string>(column.title);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  const style = { transition, transform: CSS.Transform.toString(transform) };

  const tasksIds = useMemo(() => {
    return task.map((task) => task.id);
  }, [task]);

  const [taskModal, setTaskModal] = useState<boolean>(false);
  const [taskContent, setTaskContent] = useState<string>("");
  const [activePriority, setActivePriority] = useState<string | null>(null);

  const handleSelect = (priority: string) => {
    setActivePriority(priority);
  };

  const addTask = (id: Id) => {
    if (!taskContent || !activePriority) {
      console.log("Complete task information");
      return;
    }
    createTask(id, taskContent, activePriority);
    setTaskModal(false);
    setTaskContent("");
    setActivePriority(null);
    alert("Task added Successfully");
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-slate-600 min-w-[350px] w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col opacity-50 border-2 border-red-400"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-slate-700 min-w-[350px] w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col relative"
    >
      {/* Column Header */}
      <div
        {...attributes}
        {...listeners}
        onClick={() => {
          if (Number(column.id) <= 3) return;
          setEditMode(true);
        }}
        className="text-md cursor-grab h-[60px] bg-slate-800 p-3 font-bold border-4 border-slate-700 rounded-2xl flex items-center justify-between relative"
      >
        <div className="flex gap-2">
          <div className="flex justify-center in-checked: px-2 py-1 text-sm rounded-full">
            0
          </div>
          {!editMode ? (
            column.title
          ) : (
            <input
              value={colTitle}
              onChange={(e) => setColTitle(e.target.value)}
              autoFocus
              onBlur={() => {
                setEditMode(false);
                updateColumn(column.id, colTitle);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setEditMode(false);
                  updateColumn(column.id, colTitle);
                }
              }}
              className="px-4 outline-indigo-600"
            />
          )}
        </div>
        <button
          onClick={() => deleteColumn(column.id)}
          className="stroke-gray-500 hover:stroke-white cursor-pointer hover:scale-110"
        >
          <TrashIcon />
        </button>
      </div>

      {/* Task List */}
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={tasksIds}>
          {task.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>

      {/* Add Task Button */}
      <div className="w-[100%] h-fit flex items-center justify-center p-2">
        <button
          onClick={() => setTaskModal(true)}
          className="flex gap-2 items-center justify-center bg-gray-900 cursor-pointer px-4 py-2 rounded-md hover:scale-105 hover:bg-green-600"
        >
          <Plusicon /> Add Task
        </button>
      </div>

      {/* Task Modal */}
      {taskModal && (
        <div className="absolute top-2/3 -translate-y-2/3 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-indigo-900 rounded-xl p-4 flex items-center justify-center flex-col gap-3">
          <MdCancel
            className="absolute top-2 right-2 size-6 cursor-pointer hover:text-red-600"
            onClick={() => {
              setTaskContent("");
              setTaskModal(false);
              handleSelect("");
            }}
          />
          <input
            type="text"
            placeholder="Task Content"
            className="w-[90%] h-12 px-4 bg-indigo-500 outline-none rounded-lg"
            onChange={(e) => setTaskContent(e.target.value)}
          />
          <p>Priority:</p>
          <div className="w-[90%] flex items-center justify-between">
            {["High", "Mid", "Low"].map((priority) => (
              <button
                key={priority}
                className={`px-4 py-2 rounded-md bg-violet-300 text-black cursor-pointer hover:bg-violet-500 ${
                  activePriority === priority ? "!bg-green-500 text-white" : ""
                }`}
                onClick={() => handleSelect(priority)}
              >
                {priority}
              </button>
            ))}
          </div>
          <button
            className="px-8 py-2 bg-green-300 rounded-md text-black hover:bg-green-600 cursor-pointer"
            onClick={() => addTask(column.id)}
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
};

export default ColumnContainer;

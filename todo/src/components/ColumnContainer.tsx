import { Column, Id, Task } from "../types";
import TrashIcon from "../icons/Trashicon";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import Plusicon from "../icons/Plusicon";
import TaskCard from "./TaskCard";
import { SortableContext } from "@dnd-kit/sortable";
interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  createTask: (columnId: Id) => void;
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
    task,
    deleteTask,
    updateTask,
  } = props;

  const [editMode, setEditMode] = useState(false);

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

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-slate-600 min-w-[350px] w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col opacity-50"
      ></div>
    );
  }
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-slate-700 min-w-[350px] w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
    >
      <div
        {...attributes}
        {...listeners}
        onClick={() => setEditMode(true)}
        className="text-md cursor-grab h-[60px] bg-slate-800 p-3 font-bold border-4 border-slate-700 rounded-2xl flex items-center justify-between"
      >
        <div className="flex gap-2">
          <div className="flex justify-center in-checked: px-2 py-1 text-sm rounded-full">
            0
          </div>
          {!editMode ? (
            column.title
          ) : (
            <input
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              autoFocus
              onBlur={() => {
                setEditMode(false);
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
              className="px-4 outline-indigo-600"
            ></input>
          )}
        </div>
        <button
          onClick={() => deleteColumn(column.id)}
          className="stroke-gray-500 hover:stroke-white cursor-pointer hover:scale-110"
        >
          <TrashIcon />
        </button>
      </div>
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
      <div className="w-[100%] h-fit flex items-center justify-center  p-2">
        <button
          onClick={() => createTask(column.id)}
          className="flex gap-2 items-center justify-center bg-gray-900  cursor-pointer px-4 py-2 rounded-md hover:scale-105 hover:bg-green-600"
        >
          <Plusicon /> Add Task
        </button>
      </div>
    </div>
  );
};

export default ColumnContainer;

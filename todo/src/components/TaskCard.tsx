import { useState } from "react";
import TrashIcon from "../icons/Trashicon";
import { Task, Id } from "../types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}

const TaskCard = ({ task, deleteTask, updateTask }: Props) => {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: editMode,
  });
  const style = { transition, transform: CSS.Transform.toString(transform) };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-slate-800 p-4 h-[100px] min-h-[100px] items-center border-2 border-rose-500  flex text-left rounded-xl  cursor-grab relative opacity-40"
      />
    );
  }

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };

  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-slate-800 p-4 h-[100px] min-h-[100px] items-center  flex text-left rounded-xl hover:ring-2 hover:ring-rose-500  cursor-grab relative"
      >
        <textarea
          value={task.content}
          placeholder="Task Content Here"
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              toggleEditMode();
            }
          }}
          onChange={(e) => updateTask(task.id, e.target.value)}
          autoFocus
          className="
        h-[90%] w-full resize-none border-none rounded-lg bg-transparent text-white focus:outline-none task"
        ></textarea>
      </div>
    );
  }
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={toggleEditMode}
      className="bg-slate-800 p-4 h-[100px] min-h-[100px] items-center  flex text-left rounded-xl hover:ring-2 hover:ring-rose-500  cursor-grab relative"
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
    >
      <p className="m-auto h-[90%] w-[90%] overflow-y-auto  break-words whitespace-pre-wrap task">
        {task.content}
      </p>
      {mouseIsOver && (
        <button
          onClick={() => deleteTask(task.id)}
          className="absolute top-1/2 -translate-y-1/2 right-1 stroke-gray-300 hover:scale-110 hover:stroke-white z-30"
        >
          <TrashIcon />
        </button>
      )}
    </div>
  );
};

export default TaskCard;

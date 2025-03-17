import { useMemo, useState, useEffect } from "react";
import Plusicon from "../icons/Plusicon";
import { Column, Id, Task } from "../types";
import ColumnContainer from "./ColumnContainer";
import Calendar from "./Calendar/Calendar";
// import { columnss } from "../data/data";

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { DragOverlay } from "@dnd-kit/core";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";

interface KanbanBoardProps {
  udata: string;
  setLogged: React.Dispatch<React.SetStateAction<boolean>>;
  columnx: Column[];
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  udata,
  setLogged,
  columnx,
}) => {
  //present date
  const [presDate, setPresDate] = useState("");
  //setting the columns
  const [columns, setColumns] = useState<Column[]>(columnx);
  //get columns data fromt the db then set it
  useEffect(() => {
    setColumns(columnx);
  }, [columnx]); // Runs whenever columnx updates

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const generatedId = () => {
    return Math.floor(Math.random() * 10001);
  };
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [task, setTask] = useState<Task[]>([]);

  const ColumnInDb = async (type: string, col: Column) => {
    const uid = sessionStorage.getItem("userid");
    if (type === "add") {
      const response = await fetch("http://localhost:3000/putcolindb", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userid: uid, control: type, column: col }),
      });
      const data = await response.json();
      console.log(data);
    } else if (type === "delete") {
      const response = await fetch("http://localhost:3000/putcolindb", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userid: uid, control: type, column: col }),
      });
      const data = await response.json();
      console.log(data);
    }
  };

  //fucntion to create a new column on button click
  const createNewColumn = async () => {
    const columnToAdd: Column = {
      id: generatedId(),
      title: `Column ${columns.length - 3 + 1}`,
      date: presDate,
    };
    await ColumnInDb("add", columnToAdd);
    setColumns([...columns, columnToAdd]);
  };

  //function to delete column on delete icon click
  async function deleteColumn(id: Id) {
    if (Number(id) <= 3) {
      alert("Cannot delete todo, in progress and completed");
      return;
    } else {
      const filteredColumn = columns.filter((col) => col.id !== id);

      const colToDel = columns.filter((col) => col.id === id);
      await ColumnInDb("add", colToDel[0]);

      setColumns(filteredColumn);
      const newTask = task.filter((t) => t.columnId !== id);
      setTask(newTask);
    }
  }

  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  //handle drag start
  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Check if we are dragging tasks or columns
    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";

    if (isActiveTask && isOverTask) {
      // Moving task within the same column
      setTask((tasks) => {
        const activeTask = tasks.find((t) => t.id === activeId);
        const overTask = tasks.find((t) => t.id === overId);

        if (
          !activeTask ||
          !overTask ||
          activeTask.columnId !== overTask.columnId
        )
          return tasks;

        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);
        return arrayMove(tasks, activeIndex, overIndex);
      });
    } else if (isActiveTask && !isOverTask) {
      // Moving task to a different column
      setTask((tasks) => {
        return tasks.map((task) =>
          task.id === activeId ? { ...task, columnId: overId } : task
        );
      });
    } else if (!isActiveTask && !isOverTask) {
      // Swapping columns (moving columns)
      setColumns((columns) => {
        const activeColumnIndex = columns.findIndex(
          (col) => col.id === activeId
        );
        const overColumnIndex = columns.findIndex((col) => col.id === overId);
        return arrayMove(columns, activeColumnIndex, overColumnIndex);
      });
    }
  }

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || !active.data.current || !over.data.current) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current.type === "Task";
    const isOverATask = over.data.current.type === "Task";

    // If both are tasks, move within the same column
    if (isActiveATask && isOverATask) {
      setTask((tasks) => {
        const activeTask = tasks.find((t) => t.id === activeId);
        const overTask = tasks.find((t) => t.id === overId);

        if (
          !activeTask ||
          !overTask ||
          activeTask.columnId !== overTask.columnId
        )
          return tasks;

        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    // Handle moving task to a different column
    else if (isActiveATask && !isOverATask) {
      setTask((tasks) => {
        return tasks.map((task) =>
          task.id === activeId ? { ...task, columnId: overId } : task
        );
      });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  const updateColumn = (id: Id, title: string) => {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });
    setColumns(newColumns);
  };

  const createTask = (columnId: Id) => {
    const newTask: Task = {
      id: generatedId(),
      columnId,
      content: `Task ${task.length + 1}`,
      priority: "",
    };
    setTask([...task, newTask]);
  };

  const deleteTask = (id: Id) => {
    const newTasks = task.filter((task) => task.id !== id);
    setTask(newTasks);
  };

  const updateTask = (id: Id, content: string) => {
    const newTasks = task.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });
    setTask(newTasks);
  };

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // This function will handle the data received from the Calendar component
  const sendDataToParent = (date: string) => {
    setSelectedDate(date); // You can store the received date in a state
    console.log("Received date from calendar:", date); // Console log the selected date
  };

  const showDate = () => {
    console.log(selectedDate);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("username");
    setLogged(false);
  };

  //fetch page data on page reload
  useEffect(() => {
    const getuserdata = async () => {
      const presentDate = new Date().toISOString().split("T")[0];
      setPresDate(presentDate);
      const userid = sessionStorage.getItem("userid");
      console.log(userid);
      const response = await fetch(
        `http://localhost:3000/pagereload?id=${userid}`
      );

      const data = await response.json();
      console.log(data);
      setColumns(data.Column);
    };
    getuserdata();
  }, []);
  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden">
      <DndContext
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        sensors={sensors}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-4  w-full h-screen items-center justify-center px-5 ">
          <main className="flex gap-4 w-[80%] h-[90%] bg-gray-800 flex-wrap overflow-auto items-center justify-center p-4 rounded-xl">
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  task={task.filter((task) => task.columnId === col.id)}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                />
              ))}
            </SortableContext>
          </main>
          <aside className="w-[20%] min-w-[250px] h-[500px] bg-gray-800 flex flex-col items-center justify-center rounded-md gap-6">
            <h1>{udata}</h1>
            <button
              className="h-[60px] w-[200px] cursor-pointer min-w-[200px] bg-slate-900
               border-2 border-slate-950 
       rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.8)] ring-green-500 hover:ring-2 flex items-center p-4 gap-2"
              onClick={() => {
                createNewColumn();
              }}
            >
              <Plusicon />
              Add Column
            </button>
            <Calendar sendDataToParent={sendDataToParent} />
            <button
              onClick={() => handleLogout()}
              className="px-4 py-2 cursor-pointer rounded-lg bg-red-800"
            >
              Log Out
            </button>
          </aside>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                task={task.filter((task) => task.columnId === activeColumn.id)}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
};

export default KanbanBoard;

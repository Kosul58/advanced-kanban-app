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
  taskz: Task[];
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  udata,
  setLogged,
  columnx,
  taskz,
}) => {
  //present date
  const [presDate, setPresDate] = useState("");
  //setting the columns
  const [columns, setColumns] = useState<Column[]>(columnx);
  //get columns data fromt the db then set it
  useEffect(() => {
    const presentDate = new Date().toISOString().split("T")[0];
    let [x, y, z] = presentDate.split("-").map((x) => Number(x));
    const newcol1 = columnx.filter((x: any) => {
      if (x.id <= 3) {
        return x;
      }
    });
    const newcol2 = columnx.filter((val: any) => {
      if (val.id > 3) {
        let [a, b, c] = val.date.split("-").map((t: string) => Number(t));
        if (a === x && b === y && c === z) {
          return val;
        }
      }
    });
    const totalcol = [...newcol1, ...newcol2];
    setColumns(totalcol);
  }, [columnx]); // Runs whenever columnx updates

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const generatedId = () => {
    return Math.floor(Math.random() * 10001);
  };
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [task, setTask] = useState<Task[]>(taskz);

  useEffect(() => {
    setTask(taskz);
  }, [taskz]);
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
      date: selectedDate || presDate,
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
      await ColumnInDb("delete", colToDel[0]);
      setColumns(filteredColumn);
      const newTask = task.filter((t) => t.columnId !== id);
      setTask(newTask);
    }
  }

  const columnsId = useMemo(
    () => columns.map((col) => col.id.toString()),
    [columns]
  );

  const [taskondrag, settaskondrag] = useState<boolean>(false);
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
          activeTask.columnId === overTask.columnId
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

      settaskondrag(true);
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

    // const isActiveAColumn = active.data.current.type === "Column";
    // const isOverAColumn = over.data.current.type === "Column";

    // Moving a task within the same column
    if (isActiveATask && isOverATask) {
      setTask((tasks) => {
        const activeTask = tasks.find((t) => t.id === activeId);
        const overTask = tasks.find((t) => t.id === overId);
        if (
          !activeTask ||
          !overTask ||
          activeTask.columnId !== overTask.columnId
        ) {
          return tasks;
        }
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    // Moving a task to a different column
    else if (isActiveATask && !isOverATask) {
      setTask((tasks) => {
        return tasks.map((task) =>
          task.id === activeId ? { ...task, columnId: overId } : task
        );
      });
    }

    // Moving a column over another column
    // else if (isActiveAColumn && isOverAColumn) {
    // }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  const updateColumn = async (id: Id, title: string) => {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });

    console.log("column lai update gar");
    setColumns(newColumns);
  };

  const createTask = async (
    columnId: Id,
    content: string,
    priority: string
  ) => {
    const userid = sessionStorage.getItem("userid");
    const presentDate = new Date().toISOString().split("T")[0];
    const newTask: Task = {
      id: generatedId(),
      columnId,
      content: content,
      priority: priority,
      date: selectedDate || presentDate,
      userid: userid,
    };

    setTask([...task, newTask]);

    // console.log(newTask);
    const response = await fetch(`http://localhost:3000/addtask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    });
    const data = await response.json();
  };

  const deleteTask = async (id: Id) => {
    const newTasks = task.filter((task) => task.id !== id);
    setTask(newTasks);

    const tasktodelete = task.filter((task) => task.id === id);
    const response = await fetch(`http://localhost:3000/deletetask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tasktodelete[0]),
    });
    const data = await response.json();
  };

  const updateTask = async (id: Id, content: string) => {
    const newTasks = task.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });
    setTask(newTasks);
    const response = await fetch(`http://localhost:3000/updatetask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, content }),
    });
    const data = await response.json();
  };

  const [selectedDate, setSelectedDate] = useState<string>("");

  //recieve data from calendar component and set the columns accordingly
  const sendDataToParent = async (date: string) => {
    setSelectedDate(date); //store received data
    console.log("Received date from calendar:", date); // Console log selected date
    console.log("date change huda yo dekhiyo ta");
    try {
      let [x, y, z] = date.split("-").map((x) => Number(x));
      const getuserdata = async () => {
        const uid = sessionStorage.getItem("userid");
        if (!uid) {
          return;
        }
        const presentDate = new Date().toISOString().split("T")[0];
        setPresDate(presentDate);
        const userid = sessionStorage.getItem("userid");
        const response = await fetch(
          `http://localhost:3000/pagereload?id=${userid}`
        );

        const data = await response.json();
        // console.log(data.Column);

        const newcol1 = data.Column.filter((x: any) => {
          if (x.id <= 3) {
            return x;
          }
        });
        console.log(newcol1);
        const newcol2 = data.Column.filter((val: any) => {
          if (val.id > 3) {
            let [a, b, c] = val.date.split("-").map((t: string) => Number(t));
            if (a === x && b === y && c === z) {
              return val;
            }
          }
        });
        console.log(newcol2);
        const totalcol = [...newcol1, ...newcol2];
        setColumns(totalcol);
        // console.log("data reloaded succesfully");
        // setColumns(data.Column);
      };
      await getuserdata();
    } catch (e) {
      console.log("Error:", e);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("userid");
    setLogged(false);
  };

  //fetch page data on page reload
  useEffect(() => {
    const getuserdata = async () => {
      const uid = sessionStorage.getItem("userid");
      if (!uid) {
        return;
      }
      const presentDate = new Date().toISOString().split("T")[0];
      setPresDate(presentDate);
      let [x, y, z] = presentDate.split("-").map((x) => Number(x));
      const userid = sessionStorage.getItem("userid");
      const response = await fetch(
        `http://localhost:3000/pagereload?id=${userid}`
      );
      const data = await response.json();
      const newcol1 = data.Column.filter((x: any) => {
        if (x.id <= 3) {
          return x;
        }
      });
      const newcol2 = data.Column.filter((val: any) => {
        if (val.id > 3) {
          let [a, b, c] = val.date.split("-").map((t: string) => Number(t));
          if (a === x && b === y && c === z) {
            return val;
          }
        }
      });
      console.log(newcol1, newcol2);
      const totalcol = [...newcol1, ...newcol2];
      setColumns(totalcol);

      const response2 = await fetch(
        `http://localhost:3000/gettaskdata?userid=${uid}`
      );
      const data2 = await response2.json();
      if (data2 !== "no tasks") {
        console.log(data2);
        setTask((prev) => [...data2]);
      }
      console.log("data reloaded succesfully");
    };
    getuserdata();
    // gettask();
  }, []);

  // const gettask = async () => {
  //   const uid = sessionStorage.getItem("userid");
  //   const response2 = await fetch(
  //     `http://localhost:3000/gettaskdata?userid=${uid}`
  //   );
  //   const data2 = await response2.json();
  //   if (data2 !== "no tasks") {
  //     console.log(data2);
  //     setTask((prev) => [...data2]);
  //   }
  // };

  const replacetasksindb = async () => {
    const userid = sessionStorage.getItem("userid");
    const response = await fetch("http://localhost:3000/replacetasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task, userid }),
    });
    const data = await response.json();
    console.log("xx");
    settaskondrag(false);
  };

  useEffect(() => {
    if (taskondrag === false) return;
    replacetasksindb();
  }, [task]);

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
                  task={task.filter(
                    (task) => Number(task.columnId) === Number(col.id)
                  )}
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

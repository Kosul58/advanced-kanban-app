import React, { useEffect, useRef, useState } from "react";
import KanbanBoard from "../KanbanBoard";
import { Column, Task } from "../../types";

const Login = () => {
  const [login, setLogin] = useState<boolean>(true);
  const [signup, setSignup] = useState<boolean>(true);
  const [logged, setLogged] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [throttle, setThrottle] = useState<boolean>(false);
  const [columnx, setColumnx] = useState<Column[]>([]);
  const [taskz, setTaskz] = useState<Task[]>([]);

  // UseRef with correct types for input fields
  const luname = useRef<HTMLInputElement | null>(null);
  const lpwd = useRef<HTMLInputElement | null>(null);
  const suname = useRef<HTMLInputElement | null>(null);
  const spwd = useRef<HTMLInputElement | null>(null);
  const scpwd = useRef<HTMLInputElement | null>(null);
  const semail = useRef<HTMLInputElement | null>(null);

  const [udata, setUdata] = useState<string>("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const x = luname.current?.value;
    const y = lpwd.current?.value;
    // if (!call) {
    //   call = true;
    //   func.apply(this, args); // Ensure arguments are passed correctly
    //   setTimeout(() => {
    //     call = false;
    //   }, delay);
    // }
    if (!throttle) {
      setThrottle(true);
      setTimeout(() => {
        setThrottle(false);
      }, 4000);
    } else {
      return;
    }

    if (!login) {
      setLogin(true);
      setSignup(true);
      return;
    }

    if (!x || !y) {
      console.log("Enter both username and password");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/login?name=${x}&password=${y}`,
        { method: "GET" }
      );
      if (!response.ok) {
        throw new Error("Failed to login. Please check your credentials.");
        return;
      }
      const data = await response.json();

      const response2 = await fetch(
        `http://localhost:3000/gettaskdata?userid=${data._id}`
      );
      const data2 = await response2.json();
      setTaskz(data2);

      if (data !== "no users") {
        setColumnx(data.Column);
        setLogged(true);
        setUdata(x);
        sessionStorage.setItem("username", JSON.stringify(x));
        sessionStorage.setItem("userid", data._id);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const x = suname.current?.value;
    const y = spwd.current?.value;
    const y2 = scpwd.current?.value;
    const z = semail.current?.value;
    if (signup) {
      setSignup(!signup);
      setLogin(!login);
      return;
    }

    if (!x || !y || !y2 || !z) {
      console.log("All fields are required");
      return;
    }

    if (y !== y2) {
      console.log("password do not match");
      return;
    }

    if (!throttle) {
      setThrottle(true);
      setTimeout(() => {
        setThrottle(false);
      }, 4000);
    } else {
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: x, password: y, email: z }),
      });

      if (!response.ok) {
        throw new Error("Failed to register. Please try again.");
      }

      const data = await response.json();
      console.log(data);
      if (data.email) {
        setColumnx(data.Column);
        console.log("Register Successful");
        setLogged(true);
        setUdata(x || "");
        sessionStorage.setItem("username", JSON.stringify(x));
        sessionStorage.setItem("userid", data._id);
      }
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  useEffect(() => {
    const data = sessionStorage.getItem("username");
    if (data) {
      setLogged(true);
      setUdata(JSON.parse(data));
    }
    setLoading(false); // Set loading to false after checking session storage
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Optional loading state while session data is being checked
  }

  return (
    <>
      <section
        className={`flex flex-col bg-black w-full h-screen
          ${logged ? "flex" : "hidden"} justify-center items-center`}
      >
        <KanbanBoard
          udata={udata}
          setLogged={setLogged}
          columnx={columnx}
          taskz={taskz}
        />
      </section>
      {/* Login part */}
      <section
        className={` flex  flex-col bg-blue-950 w-full h-screen ${
          !logged ? "flex" : "hidden"
        }`}
      >
        <div className="absolute top-[15%] left-1/2 transform -translate-x-1/2 w-[100%] h-auto bg-inherit rounded-lg flex flex-1 justify-center items-center flex-wrap py-8">
          {/* Login Form */}
          <form
            className="w-[45vw] h-[75vh] bg-red-200 min-w-[600px] xl:rounded-s-xl max-lg:rounded-t-lg flex flex-col justify-center items-center gap-2 max-[700px]:min-w-[400px] max-[450px]:min-w-[90%]"
            onSubmit={handleLogin}
          >
            <div
              className={`w-[100%] h-[35%] flex justify-center items-center flex-col gap-2 ${
                login ? "flex" : "hidden"
              }`}
            >
              <input
                type="text"
                placeholder="Username"
                className="w-[60%] h-[50px] px-3 rounded-lg max-[700px]:min-w-[80%] bg-white text-black"
                ref={luname}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-[60%] h-[50px] px-3 rounded-lg max-[700px]:min-w-[80%]   bg-white text-black"
                ref={lpwd}
              />
            </div>
            <button
              type="submit"
              className="w-24 h-10 bg-orange-500 rounded-lg hover:bg-green-400 hover:scale-110"
            >
              Login
            </button>
          </form>

          {/* Signup Form */}
          <form
            className="w-[45vw] h-[75vh] bg-yellow-200 min-w-[600px] xl:rounded-e-xl max-lg:rounded-b-lg flex flex-col justify-center items-center gap-2 max-[700px]:min-w-[400px] max-[450px]:min-w-[90%]"
            onSubmit={handleSignup}
          >
            <div
              className={`w-[100%] h-[60%] flex justify-center items-center flex-col gap-2 ${
                signup ? "hidden" : "flex"
              }`}
            >
              <input
                type="text"
                placeholder="Username"
                className="w-[60%] h-[50px] px-3 rounded-lg max-[700px]:min-w-[80%]  bg-white text-black"
                ref={suname}
              />
              <input
                type="email"
                placeholder="kosul@nike.com"
                className="w-[60%] h-[50px] px-3 rounded-lg max-[700px]:min-w-[80%]  bg-white text-black"
                ref={semail}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-[60%] h-[50px] px-3 rounded-lg max-[700px]:min-w-[80%]  bg-white text-black"
                ref={spwd}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-[60%] h-[50px] px-3 rounded-lg max-[700px]:min-w-[80%]  bg-white text-black"
                ref={scpwd}
              />
            </div>
            <button
              type="submit"
              className="w-24 h-10 bg-black rounded-lg hover:bg-green-400 hover:scale-110"
            >
              Signup
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Login;

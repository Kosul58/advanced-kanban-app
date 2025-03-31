import express from "express";
import users from "./adduser.js";
import pagereload from "./pagereloadhandler.js";
import editCol from "./editCol.js";
import tasks from "./addTask.js";
import taskhandler from "./taskdatahandler.js";
import deletetask from "./deletetask.js";
import updatetask from "./updatetask.js";
import replacetasks from "./replacetaskondrag.js";
import closeConn from "./logout.js";

const taskrouter = express.Router();

taskrouter.get("/", (req, res) => res.send("Hello World!"));

taskrouter.get("/login", async (req, res) => {
  let uinfo = { username: req.query.name, password: req.query.password };
  const result = await users(uinfo, "login");
  res.json(result);
});

taskrouter.post("/register", async (req, res) => {
  let uinfo = req.body;
  console.log(uinfo);
  const result = await users(uinfo, "register");
  res.json(result);
  console.log(result);
});

taskrouter.get("/pagereload", async (req, res) => {
  let uid = req.query.id;
  const result = await pagereload(uid, "reload");
  res.json(result);
});

taskrouter.post("/putcolindb", async (req, res) => {
  const { userid, control, column } = req.body;
  console.log(userid, control, column);
  const result = await pagereload(userid, control, column);
  res.json(result);
});

taskrouter.post("/updatecol", async (req, res) => {
  let { colid, title, userid } = req.body;
  console.log(colid, title, userid);
  const result = await editCol(colid, title, userid);
  res.json(result);
});

taskrouter.post("/addtask", async (req, res) => {
  const task = req.body;
  const result = await tasks(task);
  res.json(result);
});

taskrouter.get("/gettaskdata", async (req, res) => {
  const uid = req.query.userid;
  const result = await taskhandler(uid);
  res.json(result);
});

taskrouter.delete("/deletetask", async (req, res) => {
  const task = req.body;
  const result = await deletetask(task);
  res.json(result);
});

taskrouter.put("/updatetask", async (req, res) => {
  const { id, content } = req.body;
  console.log(id, content);
  const result = await updatetask(id, content);
  res.json(result);
});

taskrouter.put("/replacetasks", async (req, res) => {
  const { task, userid } = req.body;

  setTimeout(async () => {
    try {
      const result = await replacetasks(task, userid);
      res.json(result); // Send response only after replacetasks completes
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }, 2000);
});

taskrouter.get("/logoutuser", async (req, res) => {
  console.log("logout");
  await closeConn();
  res.json("User Logged Out");
});
export default taskrouter;

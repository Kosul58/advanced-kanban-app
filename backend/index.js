import express from "express";
import cors from "cors";
import users from "./adduser.js";
import pagereload from "./pagereloadhandler.js";
import editCol from "./editCol.js";
import tasks from "./addTask.js";
import taskhandler from "./taskdatahandler.js";
import deletetask from "./deletetask.js";
import updatetask from "./updatetask.js";
import replacetasks from "./replacetaskondrag.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.send("Hello World!"));

app.get("/login", async (req, res) => {
  let uinfo = { username: req.query.name, password: req.query.password };
  const result = await users(uinfo, "login");
  res.json(result);
});

app.post("/register", async (req, res) => {
  let uinfo = req.body;
  console.log(uinfo);
  const result = await users(uinfo, "register");
  res.json(result);
  console.log(result);
});

app.get("/pagereload", async (req, res) => {
  let uid = req.query.id;
  const result = await pagereload(uid, "reload");
  res.json(result);
});

app.post("/putcolindb", async (req, res) => {
  const { userid, control, column } = req.body;
  console.log(userid, control, column);
  const result = await pagereload(userid, control, column);
  res.json(result);
});

app.post("/updatecol", async (req, res) => {
  let { colid, title, userid } = req.body;
  console.log(colid, title, userid);
  const result = await editCol(colid, title, userid);
  res.json(colid);
});

app.post("/addtask", async (req, res) => {
  const task = req.body;
  const result = await tasks(task);
  res.json(result);
});

app.get("/gettaskdata", async (req, res) => {
  const uid = req.query.userid;
  const result = await taskhandler(uid);
  res.json(result);
});

app.post("/deletetask", async (req, res) => {
  const task = req.body;
  const result = await deletetask(task);
  res.json(result);
});

app.post("/updatetask", async (req, res) => {
  const { id, content } = req.body;
  console.log(id, content);
  const result = await updatetask(id, content);
  res.json(result);
});

app.post("/replacetasks", async (req, res) => {
  const { task, userid } = req.body;
  const result = await replacetasks(task, userid);
  res.json(result);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

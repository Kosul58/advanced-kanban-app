import express from "express";
import cors from "cors";
import users from "./adduser.js";
import pagereload from "./pagereloadhandler.js";

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

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

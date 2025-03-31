import express from "express";
import cors from "cors";
import taskrouter from "./taskrouter.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.use("/taskapi", taskrouter);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

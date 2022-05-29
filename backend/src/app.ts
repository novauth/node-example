import express from "express";
import morgan from "morgan";
import indexRouter from "./app.routes.js";
import cors from 'cors'

const app = express();
app.use(cors())
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: false }));
if (process.env.NODE_ENV === "production")
  app.use("/", express.static("../frontend/build"));

app.use("/api", indexRouter);

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (err.error !== null && err.error !== undefined) {
      console.error("Something went wrong while serving the request.");
      console.error("-----------------------------------------");
      console.error(err.error);
      console.error("-----------------------------------------");
    }
    return res
      .status(500)
      .json({ message: "Something went wrong while serving the request." });
  }
);

export default app;

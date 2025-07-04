import express, { Application } from "express";
import { booksRouter } from "./app/book/book-controller";
import { borrowRouter } from "./app/borrow/borrow.controller";
import { notFound } from "./utility/notFound";
import cors from "cors";

const app: Application = express();

app.use(express.json());
app.use(cors());

app.use("/api", booksRouter);
app.use("/api", borrowRouter);
app.use(notFound);

app.get("/", (req, res) => {
  res.send("Welcome to library management system");
});

export default app;

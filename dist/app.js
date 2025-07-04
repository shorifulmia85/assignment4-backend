"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const book_controller_1 = require("./app/book/book-controller");
const borrow_controller_1 = require("./app/borrow/borrow.controller");
const notFound_1 = require("./utility/notFound");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api", book_controller_1.booksRouter);
app.use("/api", borrow_controller_1.borrowRouter);
app.use(notFound_1.notFound);
app.get("/", (req, res) => {
    res.send("Welcome to library management system");
});
exports.default = app;

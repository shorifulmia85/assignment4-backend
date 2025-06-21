"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.booksRouter = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const express_1 = require("express");
const book_model_1 = require("./book-model");
const formatMongooseError_1 = require("../../utility/formatMongooseError");
exports.booksRouter = (0, express_1.Router)();
// create book
exports.booksRouter.post("/books", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = req.body;
        const result = yield book_model_1.books.create(book);
        res.json({
            success: true,
            message: "Book created successfully",
            data: result,
        });
    }
    catch (err) {
        const formatted = (0, formatMongooseError_1.formatError)(err);
        res.status(400).json(formatted);
    }
}));
// get all books
exports.booksRouter.get("/books", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filter = req.query.filter;
        const sortBy = req.query.sortBy || "createdAt";
        const sortOrder = req.query.sort === "asc" ? 1 : -1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const filterData = {};
        if (filter) {
            filterData.genre = filter.toUpperCase();
        }
        const result = yield book_model_1.books
            .find(filterData)
            .sort({ [sortBy]: sortOrder })
            .limit(limit);
        res.status(200).json({
            success: true,
            message: "Books retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "server error",
            error: error.message || error,
        });
    }
}));
// get single book
exports.booksRouter.get("/books/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.bookId;
        const result = yield book_model_1.books.findById(id);
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Book not found",
                error: {
                    path: "_id",
                    value: id,
                },
            });
        }
        res.status(200).json({
            success: true,
            message: "Book retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "server error",
            error: error.message || error,
        });
    }
}));
// book update
exports.booksRouter.put("/books/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.bookId;
        const data = yield req.body;
        const result = yield book_model_1.books.findByIdAndUpdate(id, data, { new: true });
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Book not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Book updated successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "server error",
            error: error.message || error,
        });
    }
}));
// book delete
exports.booksRouter.delete("/books/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.bookId;
        yield book_model_1.books.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Book deleted successfully",
            data: null,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "server error",
            error: error.message || error,
        });
    }
}));

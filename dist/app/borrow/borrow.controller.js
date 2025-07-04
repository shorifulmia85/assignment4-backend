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
exports.borrowRouter = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const express_1 = require("express");
const book_model_1 = require("../book/book-model");
const borrow_model_1 = require("./borrow.model");
const formatMongooseError_1 = require("../../utility/formatMongooseError");
exports.borrowRouter = (0, express_1.Router)();
exports.borrowRouter.post("/borrow", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookId, quantity, dueDate } = req.body;
        yield book_model_1.books.updateCopies(bookId, quantity);
        const result = yield borrow_model_1.borrows.create({
            book: bookId,
            quantity: quantity,
            dueDate: dueDate,
        });
        res.status(201).json({
            success: true,
            message: "Book borrowed successfully",
            data: result,
        });
    }
    catch (error) {
        const formatted = (0, formatMongooseError_1.formatError)(error);
        res.status(400).json(formatted);
    }
}));
exports.borrowRouter.get("/borrow", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const summary = yield borrow_model_1.borrows.aggregate([
            {
                $group: {
                    _id: "$book",
                    totalQuantity: { $sum: "$quantity" },
                },
            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "bookInfo",
                },
            },
            {
                $unwind: "$bookInfo",
            },
            {
                $project: {
                    _id: 0,
                    book: {
                        title: "$bookInfo.title",
                        isbn: "$bookInfo.isbn",
                    },
                    totalQuantity: 1,
                },
            },
        ]);
        res.status(200).json({
            success: true,
            message: "Borrowed books summary retrieved successfully",
            data: summary,
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

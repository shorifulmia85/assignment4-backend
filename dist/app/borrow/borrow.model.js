"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrows = void 0;
const mongoose_1 = require("mongoose");
const borrowSchema = new mongoose_1.Schema({
    book: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "books",
    },
    quantity: {
        type: Number,
        required: true,
        min: [0, "Copies must be a positive number"],
    },
    dueDate: {
        type: Date,
        required: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.borrows = (0, mongoose_1.model)("borrows", borrowSchema);

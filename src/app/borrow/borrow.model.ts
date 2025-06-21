import mongoose, { model, Schema } from "mongoose";
import { IBorrow } from "./borrow.interface";

const borrowSchema = new Schema<IBorrow>(
  {
    book: {
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const borrows = model<IBorrow>("borrows", borrowSchema);

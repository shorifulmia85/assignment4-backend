/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, Router } from "express";
import { books } from "../book/book-model";
import { borrows } from "./borrow.model";
import { formatError } from "../../utility/formatMongooseError";

export const borrowRouter = Router();

borrowRouter.post("/borrow", async (req: Request, res: Response) => {
  try {
    const { bookId, quantity, dueDate } = req.body;

    await books.updateCopies(bookId, quantity);

    const result = await borrows.create({
      book: bookId,
      quantity: quantity,
      dueDate: dueDate,
    });

    res.status(201).json({
      success: true,
      message: "Book borrowed successfully",
      data: result,
    });
  } catch (error: any) {
    const formatted = formatError(error);
    res.status(400).json(formatted);
  }
});

borrowRouter.get("/borrow", async (req: Request, res: Response) => {
  try {
    const summary = await borrows.aggregate([
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "server error",
      error: error.message || error,
    });
  }
});

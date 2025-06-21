/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, Router } from "express";
import { books } from "./book-model";
import { formatError } from "../../utility/formatMongooseError";

export const booksRouter = Router();

// create book

booksRouter.post("/books", async (req: Request, res: Response) => {
  try {
    const book = req.body;
    const result = await books.create(book);
    res.json({
      success: true,
      message: "Book created successfully",
      data: result,
    });
  } catch (err: any) {
    const formatted = formatError(err);
    res.status(400).json(formatted);
  }
});

// get all books

booksRouter.get("/books", async (req: Request, res: Response) => {
  try {
    const filter = req.query.filter as string;
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const sortOrder = req.query.sort === "asc" ? 1 : -1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const filterData: any = {};

    if (filter) {
      filterData.genre = filter.toUpperCase();
    }

    const result = await books
      .find(filterData)
      .sort({ [sortBy]: sortOrder })
      .limit(limit);
    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "server error",
      error: error.message || error,
    });
  }
});

// get single book

booksRouter.get(
  "/books/:bookId",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const id = req.params.bookId;

      const result = await books.findById(id);
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
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "server error",
        error: error.message || error,
      });
    }
  }
);

// book update

booksRouter.put(
  "/books/:bookId",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const id = req.params.bookId;
      const data = await req.body;

      const result = await books.findByIdAndUpdate(id, data, { new: true });

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
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "server error",
        error: error.message || error,
      });
    }
  }
);

// book delete

booksRouter.delete(
  "/books/:bookId",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const id = req.params.bookId;
      await books.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: "Book deleted successfully",
        data: null,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "server error",
        error: error.message || error,
      });
    }
  }
);

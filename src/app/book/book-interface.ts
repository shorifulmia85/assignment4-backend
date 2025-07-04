import { Model } from "mongoose";

export interface IBook {
  title: string;
  author: string;
  bookImg: string;
  genre:
    | "FICTION"
    | "NON_FICTION"
    | "SCIENCE"
    | "HISTORY"
    | "BIOGRAPHY"
    | "FANTASY";
  isbn: string;
  description?: string;
  copies: number;
  available: boolean;
}

export interface BookModel extends Model<IBook> {
  updateCopies(bookId: string, quantity: number): Promise<IBook>;
}

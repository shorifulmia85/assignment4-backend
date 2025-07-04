import mongoose from "mongoose";
import app from "./app";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 5000;

async function main() {
  try {
    await mongoose.connect(process.env.URI as string);
    console.log(" MongoDB connected successfully");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

main();

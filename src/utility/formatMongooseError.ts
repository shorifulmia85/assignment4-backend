/* eslint-disable @typescript-eslint/no-explicit-any */
import { Error } from "mongoose";

export const formatError = (err: any) => {
  if (err.name === "ValidationError") {
    const formattedErrors: Record<string, any> = {};

    for (const field in err.errors) {
      const error = err.errors[field] as Error.ValidatorError;
      formattedErrors[field] = {
        message: error.message,
        name: error.name,
        properties: error.properties,
        kind: error.kind,
        path: error.path,
        value: error.value,
      };
    }

    return {
      success: false,
      message: "Validation failed",
      error: {
        name: err.name,
        errors: formattedErrors,
      },
    };
  }

  return {
    success: false,
    message: err.message || "Something went wrong",
    error: {
      name: err.name || "Error",
      message: err.message || "Unknown error",
    },
  };
};

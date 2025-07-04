/* eslint-disable @typescript-eslint/no-explicit-any */
import { Error } from "mongoose";

export const formatError = (err: any) => {
  // ✅ Handle Mongoose validation errors
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

  // ✅ Handle Duplicate Key Error (E11000)
  if (err.code === 11000) {
    const duplicateField = Object.keys(err.keyValue || {})[0];
    const duplicateValue = err.keyValue?.[duplicateField];

    return {
      success: false,
      message: ` already exists this ${duplicateField} number`,
      error: {
        name: "DuplicateKeyError",
        field: duplicateField,
        value: duplicateValue,
      },
    };
  }

  // ✅ Generic error fallback
  return {
    success: false,
    message: err.message || "Something went wrong",
    error: {
      name: err.name || "Error",
      message: err.message || "Unknown error",
    },
  };
};

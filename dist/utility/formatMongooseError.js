"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatError = void 0;
const formatError = (err) => {
    if (err.name === "ValidationError") {
        const formattedErrors = {};
        for (const field in err.errors) {
            const error = err.errors[field];
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
exports.formatError = formatError;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../../common/errors");
/**
 * Injects an `ErrorHandlerFunction` into the scope of an Express Middleware function, providing access to the
 * `Error`, `Request`, `Response`, and `NextFunction` arguments. Checks if the `err` is a custom error, passing it
 * to the handler function if so, calling `next` to drop into the next function of the stack if not.
 * @param handlerFunc Error Handler Function.
 */
exports.errorHandlerProvider = (handlerFunc) => (err, req, res, next) => {
    if (err instanceof errors_1.BaseErrors.BaseError && err.customError) {
        return handlerFunc(err, res, next);
    }
    else {
        return next();
    }
};

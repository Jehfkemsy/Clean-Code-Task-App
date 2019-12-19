"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../../common/errors");
/**
 * Handles common error to HTTP Response mapping.
 */
exports.commonErrorHandler = (err, res, next) => {
    switch (err.constructor) {
        case errors_1.CommonErrors.ValidationError:
            return res.status(400).send(err.serializeError());
        default:
            return next();
    }
};

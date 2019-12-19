"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../../features/users/errors");
/**
 * Handles user error to HTTP Response mapping.
 */
exports.userErrorHandler = (err, res, next) => {
    switch (err.constructor) {
        case errors_1.CreateUserErrors.UsernameTakenError:
        case errors_1.CreateUserErrors.EmailTakenError:
            return res.status(409).send(err.serializeError());
        default:
            return next();
    }
};

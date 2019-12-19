"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../../features/auth/errors");
/**
 * Handles authentication error to HTTP Response mapping.
 */
exports.authErrorHandler = (err, res, next) => {
    switch (err.constructor) {
        case errors_1.AuthenticationErrors.InvalidTokenError:
        case errors_1.AuthenticationErrors.AuthorizationError:
            return res.status(401).send(err.serializeError());
        default:
            return next();
    }
};

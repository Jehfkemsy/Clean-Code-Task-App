"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../../common/errors");
var AuthenticationErrors;
(function (AuthenticationErrors) {
    class InvalidTokenError extends errors_1.BaseErrors.BaseError {
        constructor(message, code) {
            super(message, code);
        }
        static create(message) {
            return new InvalidTokenError(message ? message : 'The provided token was invalid.', 'A0');
        }
    }
    AuthenticationErrors.InvalidTokenError = InvalidTokenError;
    class AuthorizationError extends errors_1.BaseErrors.BaseError {
        constructor(message, code) {
            super(message, code);
        }
        static create(message) {
            return new AuthorizationError(message ? message : 'Please authenticate. Request denied.', 'A1');
        }
    }
    AuthenticationErrors.AuthorizationError = AuthorizationError;
})(AuthenticationErrors = exports.AuthenticationErrors || (exports.AuthenticationErrors = {}));

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../../common/errors");
var CreateUserErrors;
(function (CreateUserErrors) {
    class UsernameTakenError extends errors_1.BaseErrors.BaseError {
        constructor(message, code) {
            super(message, code);
        }
        static create(message) {
            return new UsernameTakenError(message ? message : 'The provided username is already in use.', 'U0');
        }
    }
    CreateUserErrors.UsernameTakenError = UsernameTakenError;
    class EmailTakenError extends errors_1.BaseErrors.BaseError {
        constructor(message, code) {
            super(message, code);
        }
        static create(message) {
            return new EmailTakenError(message ? message : 'The provided email is already in use.', 'U1');
        }
    }
    CreateUserErrors.EmailTakenError = EmailTakenError;
})(CreateUserErrors = exports.CreateUserErrors || (exports.CreateUserErrors = {}));

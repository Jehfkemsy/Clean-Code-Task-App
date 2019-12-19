"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseErrors;
(function (BaseErrors) {
    class BaseError extends Error {
        constructor(message, code) {
            super(message);
            this.customError = true;
            this.message = message;
            this.code = code;
            this.name = this.constructor.name;
            Error.captureStackTrace(this, this.constructor);
        }
        serializeError() {
            return {
                message: this.message,
                code: this.code
            };
        }
    }
    BaseErrors.BaseError = BaseError;
})(BaseErrors = exports.BaseErrors || (exports.BaseErrors = {}));
var CommonErrors;
(function (CommonErrors) {
    class ValidationError extends BaseErrors.BaseError {
        constructor(message, code) {
            super(message, code);
        }
        static create(message) {
            return new ValidationError(message ? message : 'Validation failed for the attempted operation.', 'C0');
        }
    }
    CommonErrors.ValidationError = ValidationError;
})(CommonErrors = exports.CommonErrors || (exports.CommonErrors = {}));
var ApplicationErrors;
(function (ApplicationErrors) {
    class UnexpectedError extends BaseErrors.BaseError {
        constructor(message, code) {
            super(message, code);
        }
        static create(message) {
            return new UnexpectedError(message ? message : 'An unexpected error has occurred.', 'A0');
        }
    }
    ApplicationErrors.UnexpectedError = UnexpectedError;
})(ApplicationErrors = exports.ApplicationErrors || (exports.ApplicationErrors = {}));

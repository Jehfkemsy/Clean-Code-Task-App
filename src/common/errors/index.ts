export interface ISerializedClientSafeError {
    message: string;
    code: string;
}

export namespace BaseErrors {
    export class BaseError extends Error {
        private readonly code: string;

        public customError = true;

        constructor (message: string, code: string) {
            super(message);

            this.message = message;
            this.code = code;

            Error.call(this); 
            Error.captureStackTrace(this, this.constructor); 
            this.name = this.constructor.name;
        }

        public serializeError(): ISerializedClientSafeError {
            return {
                message: this.message,
                code: this.code
            };
        }
    }
}

export namespace CommonErrors {
    export class ValidationError extends BaseErrors.BaseError {
        private constructor (message: string, code: string) {
            super(message, code);
        }

        public static create(message?: string): ValidationError {
            return new ValidationError(
                message ? message : 'Validation failed for the attempted operation.',
                'C0'
            );
        }
    }

    export class NotFoundError extends BaseErrors.BaseError {
        private constructor (message: string, code: string) {
            super(message, code);
        }

        public static create(message?: string): ValidationError {
            return new NotFoundError(
                message ? message : 'The requested resource could not be found.',
                'C1'
            );
        }
    }
}

export namespace ApplicationErrors {
    export class UnexpectedError extends BaseErrors.BaseError {
        private constructor (message: string, code: string) {
            super(message, code);
        }

        public static create(message?: string): UnexpectedError {
            return new UnexpectedError(
                message ? message : 'An unexpected error has occurred.',
                'A0'
            );
        }
    }
}

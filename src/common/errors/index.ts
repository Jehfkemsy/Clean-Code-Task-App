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

            this.name = this.constructor.name;
            Error.captureStackTrace(this, this.constructor);
        }

        protected serializeError(): ISerializedClientSafeError {
            return {
                message: this.message,
                code: this.code
            };
        }
    }
}

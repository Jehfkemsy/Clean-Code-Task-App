export interface ISerializedError {
    message: string;
}

export namespace BaseErrors {
    export class BaseError extends Error {
        constructor (message: string) {
            super(message);

            this.message = message;

            this.name = this.constructor.name;
            Error.captureStackTrace(this, this.constructor);
        }

        protected serializeError(): ISerializedError {
            return {
                message: this.message
            };
        }
    }
}

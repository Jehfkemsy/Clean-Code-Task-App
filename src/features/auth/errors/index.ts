import { BaseErrors } from '../../../common/errors';

export namespace AuthenticationErrors {
    export class InvalidTokenError extends BaseErrors.BaseError {
        private constructor (message: string, code: string) {
            super(message, code);
        }

        public static create(message?: string): InvalidTokenError {
            return new InvalidTokenError(
                message ? message : 'The provided token was invalid.',
                'A0'
            );
        }
    }

    export class AuthorizationError extends BaseErrors.BaseError {
        private constructor (message: string, code: string) {
            super(message, code);
        }

        public static create(message?: string): AuthorizationError {
            return new AuthorizationError(
                message ? message : 'Please authenticate. Request denied.',
                'A1'
            );
        }
    }

    export class CouldNotHashPasswordError extends BaseErrors.BaseError {
        private constructor (message: string, code: string) {
            super(message, code);
        }

        public static create(message?: string): CouldNotHashPasswordError {
            return new CouldNotHashPasswordError(
                message ? message : 'Could not hash the provided password.',
                'A2'
            );
        }
    }

    export class CouldNotCompareHashesError extends BaseErrors.BaseError {
        private constructor (message: string, code: string) {
            super(message, code);
        }

        public static create(message?: string): CouldNotCompareHashesError {
            return new CouldNotCompareHashesError(
                message ? message : 'Could not compare the provided hashes.',
                'A3'
            );
        }
    }
}
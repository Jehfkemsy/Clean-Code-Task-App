import { BaseErrors } from '../../../common/errors';

export namespace CreateUserErrors {
    export class UsernameTakenError extends BaseErrors.BaseError {
        private constructor (message: string, code: string) {
            super(message, code);
        }

        public static create(message?: string): UsernameTakenError {
            return new UsernameTakenError(
                message ? message : 'The provided username is already in use.',
                'U0'
            );
        }
    }

    export class EmailTakenError extends BaseErrors.BaseError {
        private constructor (message: string, code: string) {
            super(message, code);
        }

        public static create(message?: string): EmailTakenError {
            return new EmailTakenError(
                message ? message : 'The provided email is already in use.',
                'U1'
            );
        }
    }
}
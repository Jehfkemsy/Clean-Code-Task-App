import { BaseErrors } from './../../../common/errors';

export namespace CreateUserErrors {
    export class UsernameTakenError extends BaseErrors.BaseError {

    }

    export class EmailTakenError extends BaseErrors.BaseError {

    }
}